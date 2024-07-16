from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
from keras.models import load_model

app = Flask(__name__)
CORS(app)