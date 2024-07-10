from flask import Flask, request, jsonify
from keras.models import load_model
from flask_cors import CORS
import speech_recognition as sr

class UserFeedback:
    def __init__(self, question, answer, feedback):
        self.Question = question
        self.Answer = answer
        self.Feedback = feedback

    def to_dict(self):
        return {
            "question": self.Question,
            "answer": self.Answer,
            "feedback": self.Feedback,
        }

app = Flask(__name__)
CORS(app)

model_chatbot = load_model('assets/model_chatbot.h5')
model_scoring = load_model('assets/model_scoring.h5')
model_sentence = load_model('assets/model_sentence.h5')

@app.route('/chatbot', methods=['POST'])
def predict():
        user_input = request.get_json(force=True)
        question = user_input.get('message')
        input = preprocessing_text(question)
        input = tokenizer.texts_to_sequences([input])
        input = np.array(input).reshape(-1)
        input = pad_sequences([input], training_padded.shape[1])
        output = model.predict(input)
        output = output.argmax()
        response_tag = le.inverse_transform([output])[0]
        # Check if the response_tag is in responses
        if response_tag in responses:
            response = {
                'response' : random.choice(responses[response_tag])
            }
        else:
            response = {
                'response' : 'Maaf, saya tidak mengerti. Bisa kamu ulangi lagi dengan kata lain?'
            }
        return jsonify(response)

class UserFeedback:
    Question: str
    Answer: str
    Feedback: str

class UserFeedback:
    def __init__(self, question, answer, feedback):
        self.Question = question
        self.Answer = answer
        self.Feedback = feedback

    def to_dict(self):
        return {
            "question": self.Question,
            "answer": self.Answer,
            "feedback": self.Feedback,
        }

@app.route('/feedback/categories', methods=['POST'])
def generate_question():
    # ambil jsonnya
    user_input = request.get_json(force=True)
    num = user_input.get('message')
    df_field_values_unique = df_field_values.unique().tolist()
    field = df_field_values_unique[num]
    questions = []
    question = UserFeedback(questions)
    for i in range(3):
        while True:
            question = str(df[df['field'] == field].sample(1)['q'].iloc[0])
            if question not in questions:
                questions.append(question)
                break
    data = {
        'questions' : question.Question
    }
    return jsonify(data)

# buat jalanin flasknya
if __name__ == '__main__':
    app.run(debug=True)