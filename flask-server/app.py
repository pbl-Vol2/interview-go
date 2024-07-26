import sys
import os
from flask import Flask, jsonify, request,Blueprint, current_app, session, send_from_directory, abort
from flask_cors import CORS, cross_origin
from flask_session import Session
from pymongo import MongoClient
from config import Config
from jwt import ExpiredSignatureError, DecodeError
from bson import ObjectId
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from functools import wraps
import hashlib
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import shutil
import tempfile

# from tensorflow.keras.layers import LayerNormalization
# from tensorflow.python.keras.models import load_model

# # Load the trained models
# current_dir = os.path.dirname(os.path.realpath(__file__))
# model1 = load_model(os.path.join(current_dir, "../machine-learning/assets/model_chatbot.h5"))
# model2 = load_model(os.path.join(current_dir, "../machine-learning/assets/model_scoring.h5"))

# # Import models
# from chatbot_model import ChatbotModel, random, pad_sequences, preprocessing_text, np, tokenizer, training_padded, responses, model, le
# from scoring.speaking_test_model import SpeakingTestModel, df, sr, df_field_values, generate_feedback


app = Flask(__name__)
CORS(app, supports_credentials=True) 
app.config.from_object(Config)
Session(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

auth = Blueprint('auth', __name__)

# Ensure the upload folder exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

class Feedback:
  def __init__(self, category, question, answer, feedback):
    self.category = category
    self.question = question
    self.answer = answer
    self.feedback = feedback

# MongoDB client setup
client = MongoClient(Config.MONGO_URI)
db = client.db_interviewgo

# Secret key for JWT generation
app.config['SECRET_KEY'] = 'VIEWGO'

# Hashing function for passwords
def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            kwargs['current_user'] = data
            return f(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

    return decorated_function

# Route for user registration
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')
        retype_password = data.get('retype_password')

        # Validate input
        if not fullname or not email or not password or not retype_password:
            return jsonify({'result': 'fail', 'msg': 'All fields are required'}), 400

        # Check if passwords match
        if password != retype_password:
            return jsonify({'result': 'fail', 'msg': 'Passwords do not match'}), 400

        # Check if user already exists
        if db.users.find_one({'email': email}):
            return jsonify({'result': 'fail', 'msg': 'User already exists'}), 400

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Insert new user into database
        db.users.insert_one({
            'fullname': fullname,
            'email': email,
            'password': hashed_password
        })

        return jsonify({'result': 'success', 'msg': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)}), 500

# Route for user Login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = db.users.find_one({'email': email})

        if user and bcrypt.check_password_hash(user['password'], password):
            # Create token
            access_token = create_access_token(identity=email)
            return jsonify({'result': 'success', 'msg': 'Login successful', 'token': access_token}), 200
        else:
            return jsonify({'result': 'fail', 'msg': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)}), 500

# Protected route example
@app.route('/protected', methods=['GET'])
@token_required
def protected(current_user):
    user_id = current_user['id']
    user = db.users.find_one({'_id': ObjectId(user_id)}, {'_id': False, 'password': False})

    if user:
        return jsonify({'result': 'success', 'user': user}), 200
    else:
        return jsonify({'result': 'fail', 'msg': 'User not found'}), 404

# Route to get user information including email and profile picture
@app.route('/get_user_info', methods=['GET'])
@jwt_required()
@cross_origin(supports_credentials=True)
def get_user_info():
    current_user = get_jwt_identity()
    user = db.users.find_one({'email': current_user}, {'_id': False, 'password': False})
    
    if user:
        return jsonify({
            'user': {
                'fullname': user.get('fullname', ''),
                'email': user.get('email', ''),
                'profile_pic_real': user.get('profile_pic_real', '')  # Include profile_pic_real
            }
        })
    else:
        return jsonify({'error': 'User not found'}), 404
    
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    uploads_dir = os.path.join(app.root_path, 'uploads')
    file_path = os.path.join(uploads_dir, filename)
    if not os.path.isfile(file_path):
        print(f"File not found: {file_path}")  # Debug line
        return jsonify({'message': 'File not found'}), 404
    return send_from_directory(uploads_dir, filename)

# Update Profile   
@app.route("/update_profile", methods=["POST"])
@jwt_required()
def update_profile():
    try:
        email = get_jwt_identity()
        new_profile = {}

        # Update profile fullname if provided
        fullname = request.form.get('fullname')
        if fullname:
            new_profile['fullname'] = fullname

        # Update profile picture if provided
        if 'file_give' in request.files:
            file = request.files['file_give']
            if file and file.filename:
                filename = secure_filename(file.filename)
                extension = filename.split('.')[-1]
                
                # Ensure the file is an image
                if extension.lower() not in ['jpg', 'jpeg', 'png', 'gif']:
                    return jsonify({'result': 'fail', 'msg': 'Unsupported file type'}), 400
                
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{email}.{extension}')
                file.save(file_path)
                new_profile['profile_pic'] = filename
                new_profile['profile_pic_real'] = f'{email}.{extension}'

        # Debug logging
        print(f"Updating profile for email: {email}")
        print(f"New profile data: {new_profile}")

        # Perform database update
        result = db.users.update_one({'email': email}, {'$set': new_profile})

        # Debug logging
        print(f"Update result: {result.raw_result}")

        # Check if update was successful
        if result.modified_count > 0:
            return jsonify({'result': 'success', 'msg': 'Profile updated successfully'})
        else:
            return jsonify({'result': 'fail', 'msg': 'No changes were made to the profile'})

    except Exception as e:
        # Debug logging
        print(f"Error: {str(e)}")
        return jsonify({'result': 'fail', 'msg': str(e)}), 500
 
#Route to Logout   
@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Invalidate the token by unsetting JWT cookies
    response = jsonify({'msg': 'Logout successful'})
    unset_jwt_cookies(response)
    return response

@app.route('/logout', methods=['OPTIONS', 'POST'])
def handle_options():
    if request.method == 'OPTIONS':
        response = jsonify({'msg': 'Preflight request'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    else:
        # Handle the POST request as usual
        return logout()



# #Route to Chatbot
# @app.route('/predict', methods=['POST'])
# def predict():
#     user_input = request.get_json(force=True)
#     user_id = user_input.get('user_id')
#     question = user_input.get('message')
#     input = preprocessing_text(question)
#     input = tokenizer.texts_to_sequences([input])
#     input = np.array(input).reshape(-1)
#     input = pad_sequences([input], maxlen=10, padding='post', truncating='pre')
#     output = model.predict(input)
#     output = output.argmax()
#     response_tag = le.inverse_transform([output])[0]
#     response = {
#         'response': random.choice(responses.get(response_tag, ['Maaf, saya tidak mengerti. Bisa kamu ulangi lagi dengan kata lain?']))
#     }
    
#     # Save interaction history
#     db.chatbot.insert_one({
#         'user_id': user_id,
#         'question': question,
#         'response': response_tag,
#         'timestamp': datetime.utcnow()
#     })
    
#     response = {
#         'response': response_tag
#     }
#     return jsonify(response)

# # Route to get chatbot history for a specific user
# @app.route('/chatbot_history/<user_id>', methods=['GET'])
# def get_chatbot_history(user_id):
#     history = list(db.chatbot.find({'user_id': user_id}))
#     for item in history:
#         item['_id'] = str(item['_id'])  # Convert ObjectId to string for JSON serialization
#     return jsonify(history), 200

# # Questions    
# @app.route('/questions', methods=['POST'])
# def questions():
#     user_input = request.get_json(force=True)
#     num = int(user_input.get('code'))
#     df_field_values_unique = df_field_values.unique().tolist()
#     field = df_field_values_unique[num]
#     questions = []
#     while len(questions) < 3:
#         question = str(df[df['field'] == field].sample(1)['q'].iloc[0])
#         if question not in questions:
#             questions.append(question)
#     response = {
#         'category': field,
#         'questions': questions
#     }
#     return jsonify(response)

# # Route to Answer
# @app.route('/answer', methods=['POST'])
# def answer():
#     r = sr.Recognizer()
#     audio = request.files.get('audio')
#     question = request.form.get('question')
#     if audio:
#         temp_dir = tempfile.mkdtemp()
#         temp_path = os.path.join(temp_dir, 'temp_audio.wav')
#         audio.save(temp_path)
#     else:
#         return jsonify({"error": "No audio file provided"}), 400
#     try:
#         with sr.AudioFile(temp_path) as source:
#             audio_data = r.record(source)
#         # Recognize speech using Google Web Speech API
#         answer = r.recognize_google(audio_data, language="id-ID")
#         print(answer)
#         response = {
#             'answer' : answer
#         }
#     except sr.UnknownValueError:
#         response = {
#             'error': "Could not understand the audio. Please try again with clearer speech or check for background noise."
#         }
#     except sr.RequestError:
#         response = {
#             'error': "Could not request results from Google Web Speech API. Check your internet connection."
#         }
#     finally:
#         shutil.rmtree(temp_dir)
#     return jsonify(response)

# #Route to Feedabck
# @app.route('/feedback', methods=['POST'])
# def feedback():
#     user_input = request.get_json(force=True)
#     user_id = user_input.get('user_id')
#     question = user_input.get('question')
#     answer = user_input.get('answer')
#     category = user_input.get('category')  # Add category field

#     # Generate feedback based on question and answer
#     feedback = generate_feedback(question, answer)
    
#     # Prepare feedback document with category
#     feedback_doc = {
#         'user_id': user_id,
#         'question': question,
#         'answer': answer,
#         'feedback': feedback,
#         'category': category  # Save the category
#     }

#     # Replace existing feedback or insert new feedback if not exists
#     feedback.replace_one(
#         {'user_id': user_id, 'category': category},
#         feedback_doc,
#         upsert=True  # Insert if not exists, otherwise update
#     )

#     return jsonify({
#         'message': 'Feedback saved successfully.',
#         'feedback': feedback,
#         'answer': answer
#     })


# @app.route("/summary", methods=['POST'])
# def summary():

#     return 0

# Save history Chat (Dummy)
@app.route('/save_chat', methods=['POST'])
def save_chat():
    try:
        data = request.json
        message = data.get('message')
        sender = data.get('sender')
        time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Validate input
        if not message or not sender:
            return jsonify({'error': 'Invalid input'}), 400
        
        # Save to MongoDB
        chat_record = {
            'message': message,
            'sender': sender,
            'time': time
        }
        db.chat_history.insert_one(chat_record)
        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/get_bot_response', methods=['POST'])
def get_bot_response():
    try:
        data = request.json
        user_message = data.get('message')
        
        # Validate input
        if not user_message:
            return jsonify({'error': 'Invalid input'}), 400
        
        # Generate a response (dummy response for now)
        bot_response = "Terima kasih atas pesan Anda!"
        
        return jsonify({'response': bot_response}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#Route to Chatbot
# @app.route('/predict', methods=['POST'])
# def predict():
#         user_input = request.get_json(force=True)
#         question = user_input.get('message')
#         input = preprocessing_text(question)
#         input = tokenizer.texts_to_sequences([input])
#         input = np.array(input).reshape(-1)
#         input = pad_sequences([input], training_padded.shape[1])
#         output = model.predict(input)
#         output = output.argmax()
#         response_tag = le.inverse_transform([output])[0]
#         # Check if the response_tag is in responses
#         if response_tag in responses:
#             response = {
#                 'response' : random.choice(responses[response_tag])
#             }
#         else:
#             response = {
#                 'response' : 'Maaf, saya tidak mengerti. Bisa kamu ulangi lagi dengan kata lain?'
#             }
#         return jsonify(response)

#Route to Summary    
@app.route('/summary', methods=['POST'])
def save_summary():
    data = request.json
    user_id = data.get('user_id')
    summary_id = data.get('summary_id')
    summary_content = data.get('summary')
    
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400
    
    summary = {
        "_id": ObjectId(summary_id) if summary_id else ObjectId(),
        "user_id": user_id,
        "summary": summary_content
    }
    
    result = db.summaries.replace_one(
        {"_id": summary["_id"], "user_id": user_id},
        summary,
        upsert=True
    )
    
    return jsonify({"message": "Summary saved successfully", "id": str(summary["_id"])}), 200

@app.route('/get_summary/<user_id>', methods=['GET'])
def get_summary(user_id):
    summaries = list(db.summaries.find({"user_id": user_id}))
    
    if summaries:
        for summary in summaries:
            summary["_id"] = str(summary["_id"])
        return jsonify(summaries), 200
    else:
        return jsonify({"message": "No summaries found for this user"}), 404

# # Route to save course history
# @app.route("/course_history", methods=["POST"])
# def save_course_history():
#     token_receive = request.cookies.get(Config.TOKEN_KEY)
#     try:
#         payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
#         username = payload.get('id')
#         course_id = request.form.get('course_id_give')
#         timestamp = datetime.utcnow()
        
#         db.course_history.insert_one({'username': username, 'course_id': course_id, 'timestamp': timestamp})
        
#         return jsonify({'result': 'success', 'msg': 'Course history saved successfully'})
    
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# # Route to get course history
# @app.route("/get_course_history", methods=["GET"])
# def get_course_history():
#     token_receive = request.cookies.get(Config.TOKEN_KEY)
#     try:
#         payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
#         username = payload.get('id')
        
#         history = list(db.course_history.find({'username': username}, {'_id': False}).sort('timestamp', -1).limit(10))
        
#         return jsonify({'result': 'success', 'history': history})
    
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# # Route to Chatbot
# @app.route('/predict', methods=['POST'])
# def predict():
#         user_input = request.get_json(force=True)
#         question = user_input.get('message')
#         input = preprocessing_text(question)
#         input = tokenizer.texts_to_sequences([input])
#         input = np.array(input).reshape(-1)
#         input = pad_sequences([input], training_padded.shape[1])
#         output = model.predict(input)
#         output = output.argmax()
#         response_tag = le.inverse_transform([output])[0]
#         # Check if the response_tag is in responses
#         if response_tag in responses:
#             response = {
#                 'response' : random.choice(responses[response_tag])
#             }
#         else:
#             response = {
#                 'response' : 'Maaf, saya tidak mengerti. Bisa kamu ulangi lagi dengan kata lain?'
#             }
#         return jsonify(response)

# # Route to save course progress
# @app.route("/save_progress", methods=["POST"])
# def save_progress():
#     token_receive = request.cookies.get(Config.TOKEN_KEY)
#     try:
#         payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
#         username = payload.get('id')
#         course_id = request.form.get('course_id_give')
#         progress = int(request.form.get('progress_give'))
        
#         db.course_progress.update_one(
#             {'username': username, 'course_id': course_id},
#             {'$set': {'progress': progress}},
#             upsert=True
#         )
        
#         return jsonify({'result': 'success', 'msg': 'Progress saved successfully'})
    
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# # Route to get total progress
# @app.route("/get_total_progress", methods=["GET"])
# def get_total_progress():
#     token_receive = request.cookies.get(Config.TOKEN_KEY)
#     try:
#         payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
#         username = payload.get('id')
        
#         courses = list(db.course_progress.find({'username': username}, {'_id': False}))
#         total_progress = sum(course['progress'] for course in courses)
        
#         return jsonify({'result': 'success', 'total_progress': total_progress})
    
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# # Route to delete course history
# @app.route("/delete_course_history", methods=["POST"])
# def delete_course_history():
#     token_receive = request.cookies.get(Config.TOKEN_KEY)
#     try:
#         payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
#         username = payload.get('id')
#         course_id = request.form.get('course_id_give')
        
#         db.course_history.delete_one({'username': username, 'course_id': course_id})
        
#         return jsonify({'result': 'success', 'msg': 'Course history deleted successfully'})
    
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# Route to delete user profile
@app.route("/delete_user", methods=["POST"])
def delete_user():
    token_receive = request.cookies.get(Config.TOKEN_KEY)
    
    if not token_receive:
        return jsonify({'result': 'fail', 'msg': 'Token is missing'}), 401
    
    try:
        payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
        email = payload.get('id')
        
        if not email:
            return jsonify({'result': 'fail', 'msg': 'Email not found in token'}), 401
        
        db.users.delete_one({'email': email})
        
        return jsonify({'result': 'success', 'msg': 'Profile deleted successfully'})
    
    except ExpiredSignatureError:
        return jsonify({'result': 'fail', 'msg': 'Token has expired'}), 401
    except DecodeError:
        return jsonify({'result': 'fail', 'msg': 'Token is invalid'}), 401

if __name__ == '__main__':
    app.run(debug=True)