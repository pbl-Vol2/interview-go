import os
from flask import Flask, jsonify, request, url_for
from flask_cors import CORS
from pymongo import MongoClient
from config import Config
import jwt
import hashlib
from datetime import datetime, timedelta
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature


app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

app.config.from_object(Config)

# MongoDB client setup
client = MongoClient(Config.MONGO_URI)
db = client.db_interviewgo

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'your_email@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'your_email_password')
app.config['MAIL_DEFAULT_SENDER'] = 'daffarach@gmail.com'  # Set the default sender



# Initialize Flask-Mail
mail = Mail(app)

# Secret key for JWT and email token generation
app.config['SECRET_KEY'] = 'your_secret_key'
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Hashing function for passwords
def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

# Function to generate email confirmation token
def generate_confirmation_token(email):
    expires_in = timedelta(hours=24)  # Token valid for 24 hours
    return serializer.dumps(email, salt='email-confirm-key'), expires_in.total_seconds()

# Function to send registration confirmation email
def send_confirmation_email(email):
    token, _ = generate_confirmation_token(email)
    confirm_url = url_for('confirm_email', token=token, _external=True)
    msg = Message('Confirm Email', recipients=[email])
    msg.body = f'Please click this link to confirm your email: {confirm_url}'
    mail.send(msg)

# Route for user registration
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        fullname = data.get('fullname')

        # Check if user already exists
        if db.users.find_one({'email': email}):
            return jsonify({'result': 'fail', 'msg': 'Email already registered'}), 400

        # Hash the password
        hashed_password = hash_password(password)

        # Insert user into MongoDB with 'confirmed' set to False
        user = {
            'email': email,
            'password': hashed_password,
            'fullname': fullname,
            'confirmed': False
        }
        db.users.insert_one(user)

        # Send confirmation email
        send_confirmation_email(email)

        return jsonify({'result': 'success', 'msg': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)}), 500

# Route to confirm email
@app.route('/confirm_email/<token>', methods=['GET'])
def confirm_email(token):
    try:
        email = serializer.loads(token, salt='email-confirm-key', max_age=86400)  # Max age 24 hours
        db.users.update_one({'email': email}, {'$set': {'confirmed': True}})
        return jsonify({'result': 'success', 'msg': 'Email confirmed successfully'}), 200

    except SignatureExpired:
        return jsonify({'result': 'fail', 'msg': 'Token expired'}), 400
    except BadSignature:
        return jsonify({'result': 'fail', 'msg': 'Invalid token'}), 400

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get('email_give')
        password = data.get('password_give')

        if not email or not password:
            return jsonify({'result': 'fail', 'msg': 'Missing email or password'}), 400

        user = db.users.find_one({'email': email})

        if user and user.get('confirmed', False):
            pw_hash = hash_password(password)
            if user['password'] == pw_hash:
                payload = {
                    'id': str(user['_id']),
                    'exp': datetime.utcnow() + timedelta(days=1)
                }
                token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
                response = jsonify({'result': 'success', 'token': token})
                response.set_cookie('token', token, httponly=True, samesite='Strict')
                print("Login successful")
                return response, 200
            else:
                return jsonify({'result': 'fail', 'msg': 'Invalid email or password'}), 401
        else:
            return jsonify({'result': 'fail', 'msg': 'Email not confirmed or user not found'}), 401

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'result': 'fail', 'msg': str(e)}), 500


# Protected route example
@app.route('/protected', methods=['GET'])
def protected():
    token = request.cookies.get('token')

    if not token:
        return jsonify({'result': 'fail', 'msg': 'Missing token'}), 401

    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['id']

        # Perform actions based on user_id

        return jsonify({'result': 'success', 'msg': 'Access granted'})
    except jwt.ExpiredSignatureError:
        return jsonify({'result': 'fail', 'msg': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'result': 'fail', 'msg': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)}), 500
    
# Route to update user profile
@app.route("/update_profile", methods=["POST"])
def update_profile():
    token_receive = request.cookies.get(Config.TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
        email = payload.get('id')
        
        new_profile = {}
        
        # Update profile name if provided
        name = request.form.get('name_give')
        if name:
            new_profile['profile_name'] = name
        
        # Update profile picture if provided
        if 'file_give' in request.files:
            file = request.files.get('file_give')
            filename = secure_filename(file.filename)
            extension = filename.split('.')[-1]
            file_path = f'profile_pics/{email}.{extension}'
            file.save('./static/' + file_path)
            new_profile['profile_pic'] = filename
            new_profile['profile_pic_real'] = file_path
        
        db.users.update_one({'email': email}, {'$set': new_profile})
        
        return jsonify({'result': 'success', 'msg': 'Profile updated successfully'})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# Route to save course history
@app.route("/course_history", methods=["POST"])
def save_course_history():
    token_receive = request.cookies.get(Config.TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
        username = payload.get('id')
        course_id = request.form.get('course_id_give')
        timestamp = datetime.utcnow()
        
        db.course_history.insert_one({'username': username, 'course_id': course_id, 'timestamp': timestamp})
        
        return jsonify({'result': 'success', 'msg': 'Course history saved successfully'})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# Route to get course history
@app.route("/get_course_history", methods=["GET"])
def get_course_history():
    token_receive = request.cookies.get(Config.TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
        username = payload.get('id')
        
        history = list(db.course_history.find({'username': username}, {'_id': False}).sort('timestamp', -1).limit(10))
        
        return jsonify({'result': 'success', 'history': history})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# Route to save course progress
@app.route("/save_progress", methods=["POST"])
def save_progress():
    token_receive = request.cookies.get(Config.TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
        username = payload.get('id')
        course_id = request.form.get('course_id_give')
        progress = int(request.form.get('progress_give'))
        
        db.course_progress.update_one(
            {'username': username, 'course_id': course_id},
            {'$set': {'progress': progress}},
            upsert=True
        )
        
        return jsonify({'result': 'success', 'msg': 'Progress saved successfully'})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# Route to get total progress
@app.route("/get_total_progress", methods=["GET"])
def get_total_progress():
    token_receive = request.cookies.get(Config.TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
        username = payload.get('id')
        
        courses = list(db.course_progress.find({'username': username}, {'_id': False, 'progress': True}))
        if not courses:
            return jsonify({'result': 'success', 'total_progress': 0})
        
        total_courses = len(courses)
        total_progress = sum(course['progress'] for course in courses)
        average_progress = total_progress / total_courses
        
        return jsonify({'result': 'success', 'total_progress': average_progress})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# # Route untuk menerima pesan dari frontend
# @app.route('/api/chatbot', methods=['POST'])
# def chatbot():
#     try:
#         data = request.get_json()
#         user_message = data['message']
        
#         # Generate chatbot response using your model
#         bot_response = generate_response(user_message)
        
#         # Format respons sebagai JSON
#         return jsonify({'message': bot_response}), 200
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    
# # Route to get interview questions from database
# @app.route('/get_questions', methods=['GET'])
# def get_questions():
#     try:
#         questions = list(mongo.db.interview_questions.find({}, {'_id': 0}))  # Ambil semua pertanyaan tanpa _id
#         return jsonify({'questions': questions}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
