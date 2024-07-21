from flask import Flask, request, jsonify
from keras.models import load_model
from flask_cors import CORS
import json
import numpy as np
import os
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import re
from nltk.tokenize import word_tokenize
import random

app = Flask(__name__)
CORS(app)

# Load the trained model
current_dir = os.path.dirname(os.path.realpath(__file__))
model = load_model(current_dir + "/assets/model_chatbot.h5")

blacklist_word = ['saya']
replace_words = [
    ['wawancara', ['interview']],
    ['online', ['daring', 'remote']],
    ['meeting', ['gmeet', 'zoom']],
    ['persiapan',['persiapkan', 'disiapkan','dipersiapkan']],
    ['cv', ['curiculum vitae', 'resume']],
    ['penutup', ['closing statement']],
    ['mereschedule', ['jadwal ulang', 'menjadwalkan ulang', 'mengubah jadwal', 'merubah jadwal', 'pindah jadwal']],
    ['pewawancara', ['hrd', 'recruiter', 'interviewer', 'hr']],
    ['bagus', ['menarik', 'keren', 'tepat']],
    ['kesalahan umum', ['kesalahan kecil']],
    ['pakaian', ['baju', 'setelan', 'kostum', 'berpenampilan']],
    ['stres', ['stress']],
    ['bahasa tubuh', ['gestur', 'gerak tubuh', 'postur']],
    ['kurang', ['minim']],
    ['gugup', ['terbatabata', 'gagap', 'grogi']],
    ['saat', ['dalam proses']],
    ['pekerjaan', ['job']],
    ['hai', ['hello', 'hy', 'helo', 'halo', 'hay', 'p']]
]

def preprocessing_text(sentence):
    filtered_words = re.sub(r'[^\w\d\s]', '', sentence.lower())
    words = word_tokenize(filtered_words)

    cleaned_words = []
    for word in words:
        if word in blacklist_word: continue
        replaced = False
        for replacement, target in replace_words:
            if word in target:
                cleaned_words.append(replacement)
                replaced = True
        if not replaced:
            cleaned_words.append(word)

    return ' '.join(cleaned_words)

def processing_json_dataset(dataset):
    tags = []
    inputs = []
    responses={}
    for intent in dataset:
        responses[intent['tag']]=intent['responses']
        for lines in intent['patterns']:
            inputs.append(preprocessing_text(lines))
            tags.append(intent['tag'])
    return [tags, inputs, responses]

def processing_json_val_dataset(dataset):
    tags = []
    inputs = []
    for intent in dataset:
        for lines in intent['patterns']:
            inputs.append(preprocessing_text(lines))
            tags.append(intent['tag'])
    return [tags, inputs]

# Load tokenizer dictionary
with open(current_dir + '/models/chatbot/tokenizer_dict_chatbot.json', 'r') as file:
    word_index = json.load(file)
tokenizer = Tokenizer(oov_token='<OOV>')
tokenizer.word_index = word_index

# Load label encoder
with open(current_dir + '/models/chatbot/result_decoder.json', 'r') as file:
    le_name_mapping = json.load(file)
le = LabelEncoder()
le.classes_ = np.array(list(le_name_mapping.keys()))

# Load responses
with open(current_dir + "/models/chatbot/datasets/dataset_training.json") as file:
    dataset = json.load(file)
responses = {intent['tag']: intent['responses'] for intent in dataset}

@app.route('/predict', methods=['POST'])
def predict():
    user_input = request.get_json(force=True)
    question = user_input.get('message')
    input = preprocessing_text(question)
    input = tokenizer.texts_to_sequences([input])
    input = np.array(input).reshape(-1)
    input = pad_sequences([input], maxlen=10, padding='post', truncating='pre')
    output = model.predict(input)
    output = output.argmax()
    response_tag = le.inverse_transform([output])[0]
    response = {
        'response': random.choice(responses.get(response_tag, ['Maaf, saya tidak mengerti. Bisa kamu ulangi lagi dengan kata lain?']))
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)