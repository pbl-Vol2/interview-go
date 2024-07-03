import React, { useState, useEffect } from 'react';
import mic from '../assets/image/mic.png';

function Interview() {
  const [isRecording, setIsRecording] = useState(false);
  const [question, setQuestion] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const questions = [
    "Hello! How Are You?",
    "What is your name?",
    "Where are you from?",
    "What do you do for a living?",
    "What are your hobbies?",
  ];

  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isRecording]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleStopRecording();
      setTimeLeft(60);
    }
  }, [timeLeft]);

  const handleStartRecording = async () => {
    if (!hasPermission) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        setStream(stream);
      } catch (error) {
        console.error('Error requesting microphone permission:', error);
        return;
      }
    }
    if (hasPermission) {
      setIsRecording(true);
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      setQuestion(randomQuestion);
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      mediaRecorder.start();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorder.stop();
  };

  return (
    <div className="bg-gradient-to-b from-sky-100 to-white h-screen">
      <div className="container mx-auto p-4 pt-12">
        <h1 className="text-3xl font-bold mb-4">INTERVIEW TEST</h1>
        <div className="bg-white shadow-md p-8 rounded-lg max-w-lg mx-auto">
          <img src={mic} alt="Monye" className="w-24 rounded-lg mb-4 mx-auto" />
          <p className="text-lg mb-2">Click start recording and say</p>
          <p className="text-2xl font-bold mb-8">{question}</p>
          <p className="text-lg mb-8">{timeLeft} seconds left</p>
          <div className="flex justify-center">
            {isRecording ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg"
                onClick={handleStopRecording}
              >
                Stop Recording
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg"
                onClick={handleStartRecording}
              >
                Start Recording
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;