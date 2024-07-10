import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'VIEWGO'
    MONGO_URI = os.environ.get('MONGODB_URI') or 'mongodb+srv://daffarach:Kimjisoo95@cluster0.wkwtpvh.mongodb.net/db_interviewgo?retryWrites=true&w=majority'
