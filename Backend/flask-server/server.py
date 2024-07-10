from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_cors import CORS
from pymongo import MongoClient
import jwt
import hashlib
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
SECRET_KEY = 'VIEWGO'
MONGODB_CONNECTION_STRING = 'mongodb+srv://daffarach:Kimjisoo95@cluster0.wkwtpvh.mongodb.net/db_interviewgo?retryWrites=true&w=majority'
TOKEN_KEY = 'mytoken'

# MongoDB client setup
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client.db_interviewgo

# Routes
@app.route('/api/data', methods=['GET'])
def get_data():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(
            token_receive,
            SECRET_KEY,
            algorithms=['HS256']
        )
        user_info = db.users.find_one({'username': payload.get('id')}, {'_id': False})
        return jsonify(user_info)
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'TokenExpiredError', 'message': 'Your token has expired'}), 401
    except jwt.exceptions.DecodeError:
        return jsonify({'error': 'DecodeError', 'message': 'There was a problem decoding your token'}), 400

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get('username_give')
    password = request.form.get('password_give')
    pw_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    user = db.users.find_one({'username': username, 'password': pw_hash})

    if user:
        payload = {
            'id': username,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # Token valid for 24 hours
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        response = jsonify({'result': 'success', 'token': token})
        response.set_cookie('mytoken', token, httponly=True, samesite='Strict')
        return response
    else:
        return jsonify({'result': 'fail', 'msg': 'Invalid username or password'}), 401

@app.route("/sign_up", methods=["POST"])
def sign_up():
    username = request.form.get('username_give')
    password = request.form.get('password_give')
    password_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

    if db.users.find_one({'username': username}):
        return jsonify({'result': 'fail', 'msg': 'Username already exists'}), 409

    db.users.insert_one({'username': username, 'password': password_hash})
    return jsonify({'result': 'success', 'msg': 'User registered successfully'}), 201

@app.route("/update_profile", methods=["POST"])
def update_profile():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        username = payload.get('id')
        
        name = request.form.get('name_give')
        about = request.form.get('about_give')
        new_profile = {'profile_name': name, 'profile_info': about}
        
        if 'file_give' in request.files:
            file = request.files.get('file_give')
            filename = secure_filename(file.filename)
            extension = filename.split('.')[-1]
            file_path = f'profile_pics/{username}.{extension}'
            file.save('./static/' + file_path)
            new_profile['profile_pic'] = filename
            new_profile['profile_pic_real'] = file_path
        
        db.users.update_one({'username': username}, {'$set': new_profile})
        
        return jsonify({'result': 'success', 'msg': 'Profile updated successfully'})
    
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'result': 'fail', 'msg': 'Authentication failed'}), 401

if __name__ == '__main__':
    app.run(debug=True)
