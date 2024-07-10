import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'VIEWGO'
    MONGO_URI = os.environ.get('MONGODB_URI') or 'mongodb+srv://daffarach:Kimjisoo95@cluster0.wkwtpvh.mongodb.net/db_interviewgo?retryWrites=true&w=majority'

# Flask-Mail configuration
    MAIL_SERVER = 'smtp.example.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'your-email@example.com'
    MAIL_PASSWORD = os.environ.get('PASSWORD')
