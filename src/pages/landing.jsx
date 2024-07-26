import React from 'react';
import logo from "../assets/image/logo.png";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-b from-sky-100 to-white min-h-screen flex flex-col items-center justify-center text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <img src={logo} alt="Logo" className="h-48 w-auto mx-auto" />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Helps you prepare for{" "}
          <span className="text-customBiru3">job interviews</span> with
          confidence and top-notch skills.
        </h1>
        <p className="text-2xl text-gray-600 mb-6 max-w-3xl mx-auto">
          With our advanced features, you will be prepared for every question
          and challenge in the job selection process.
        </p>
        <div className="mt-8">
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-customBiru3 to-customBiru6 text-white py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-customBiru4 hover:to-customBiru3"
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Add any additional content here if needed */}
      </div>
    </div>
  );
};

export default Landing;
