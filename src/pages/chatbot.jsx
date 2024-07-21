import React, { useState } from "react";
import { Card, Button } from "flowbite-react";
import axios from "axios";
import monye from "../assets/image/monye.png";
import profile from "../assets/image/profile-chatbot.png"
import userImage from "../assets/image/user.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    // Initial greeting
    {
      text: "Hallo! Bagaimana saya bisa membantu Anda?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = input.trim();
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages([
        ...messages,
        { text: userMessage, sender: "user", time: currentTime },
      ]);
      setInput("");

      // Call Flask backend
      axios
        .post("http://127.0.0.1:5000/predict", { message: userMessage })
        .then((response) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: response.data.response,
              sender: "bot",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        })
        .catch((error) => {
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
    <div className="flex flex-col items-center p-4 h-screen">
      <Card className="w-1/3 max-w-full h-full flex flex-col">
        <div className="flex items-center p-4 bg-customBiru6 rounded-t-lg gap-4">
          <div class="relative">
            <img class="w-12 h-12 rounded-full" src={profile} alt="" />
            <span class="absolute bottom-0 left-9 transform translate-y-1/5 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Monbot</h2>
            <p className="text-sm text-white">Online</p>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 mb-2 ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <img
                className="w-7 h-7 ring-2 ring-gray-300 dark:ring-gray-500 rounded-full"
                src={message.sender === "user" ? userImage : monye}
                alt={message.sender === "user" ? "User" : "Logo"}
              />
              <div class="flex flex-col gap-1 max-w-[320px]">
                <div
                  className={`flex items-center space-x-2 rtl:space-x-reverse ${
                    message.sender === "user" ? "gap-2 flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {message.sender === "user" ? "You" : "Monbot"}
                  </span>
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {message.time}
                  </span>
                </div>
                <div
                  className={`flex flex-col w-full max-w-[500px] leading-1.5 py-0 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${
                    message.sender === "user"
                      ? "bg-blue-100 dark:bg-blue-700 rounded-l-xl rounded-tr-none"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white break-words">
                    {message.text}
                  </p>
                </div>
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
      </Card>
    </div>
  );
};

export default Chatbot;