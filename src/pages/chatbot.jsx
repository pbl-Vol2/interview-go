import React, { useState } from 'react';
import { Card, Button } from 'flowbite-react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    // Initial greeting
    { text: "Hello! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages([...messages, { text: userMessage, sender: "user" }]);
      setInput("");

      // Call Flask backend
      axios.post('http://127.0.0.1:5000/predict', { message: userMessage })
        .then(response => {
          setMessages(prevMessages => [
            ...prevMessages,
            { text: response.data.response, sender: "bot" }
          ]);
        })
        .catch(error => {
          console.error("There was an error with the Flask API:", error);
        });
    }
  };

  const postFeedbackToAPI = async (question, answer) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/feedback', {
        question,
        answer,
      });
      console.log('Feedback posted to API:', response.data);
    } catch (error) {
      console.error('Error posting feedback to API:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col space-y-4">
          <div className="overflow-y-auto h-80">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <div className={`px-4 py-2 rounded-lg ${message.sender === 'bot' ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-grow border rounded-lg px-4 py-2"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chatbot;
