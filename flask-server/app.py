from flask import Flask, jsonify, request, current_app, send_from_directory, session
from flask_cors import CORS, cross_origin
from flask_session import Session
from pymongo import MongoClient
from config import Config
import jwt
from bson import ObjectId
from flask_bcrypt import Bcrypt
from functools import wraps
import hashlib
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
app.config.from_object(Config)
Session(app)

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
        hashed_password = generate_password_hash(password)

        # Insert new user into database
        db.users.insert_one({
            'fullname': fullname,
            'email': email,
            'password': hashed_password
        })

        return jsonify({'result': 'success', 'msg': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'result': 'fail', 'msg': str(e)}), 500

# Route untuk login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Cari pengguna berdasarkan email
        user = db.users.find_one({'email': email})

        if user and check_password_hash(user['password'], password):
            # Set session untuk pengguna yang sudah login
            session['email'] = email
            return jsonify({'result': 'success', 'msg': 'Login successful'}), 200
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

# Route to get user information
@app.route('/get_user_info', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user_info():
    if 'email' in session:
        email = session['email']
        user = db.users.find_one({'email': email}, {'_id': False, 'password': False})
        if user:
            return jsonify({'user': {'fullname': user['fullname']}})
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'error': 'Unauthorized'}), 401
 
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
        
        courses = list(db.course_progress.find({'username': username}, {'_id': False}))
        total_progress = sum(course['progress'] for course in courses)
        
        return jsonify({'result': 'success', 'total_progress': total_progress})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# Route to delete course history
@app.route("/delete_course_history", methods=["POST"])
def delete_course_history():
    token_receive = request.cookies.get(Config.TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
        username = payload.get('id')
        course_id = request.form.get('course_id_give')
        
        db.course_history.delete_one({'username': username, 'course_id': course_id})
        
        return jsonify({'result': 'success', 'msg': 'Course history deleted successfully'})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

# Route to delete user profile
@app.route("/delete_profile", methods=["POST"])
def delete_profile():
    token_receive = request.cookies.get(Config.TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, Config.SECRET_KEY, algorithms=["HS256"])
        email = payload.get('id')
        
        db.users.delete_one({'email': email})
        
        return jsonify({'result': 'success', 'msg': 'Profile deleted successfully'})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

if __name__ == '__main__':
    app.run(debug=True)
