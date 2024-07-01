import React, { useState } from 'react';
import { Card, Button } from 'flowbite-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulate bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Hallo Kaniw, I'm here to help!", sender: "bot" }
        ]);
      }, 1000);
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
