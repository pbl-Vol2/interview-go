import { FloatingLabel, Checkbox, Label } from "flowbite-react";
import { useState, useEffect } from 'react'; // Import useEffect
import Logo from "../assets/image/logo.png";
import React, { useEffect, useState } from "react";
import "../assets/style.css";

// Define colors array
const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
];

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [activeColors, setActiveColors] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });

  // Function to handle mouse move
  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

// Function to handle login form submission
const handleLoginButton = async (e) => {
  e.preventDefault(); // Prevent default form submission

  try {
    console.log("Attempting to login with email:", email); // Log the email for debugging

    // Send a POST request to the backend server
    const response = await axios.post('http://localhost:5000/login', {
      email_give: email,
      password_give: password,
    });

    // Check the response from the server
    if (response.data.result === 'success') {
      setMessage('Login successful!'); // Set success message
      localStorage.setItem('token', response.data.token); // Store token in localStorage

      // Perform action upon successful login (e.g., redirect to dashboard)
      onLogin(); // Assuming this function navigates to the dashboard
    } else {
      setMessage(response.data.msg || 'Unknown error occurred'); // Display error message from backend
    }
  } catch (error) {
    console.log("Login error:", error.response?.data?.msg || 'An error occurred'); // Log and display error message
    setMessage(error.response?.data?.msg || 'An error occurred'); // Display error message to user
  }
};



  // UseEffect to set interval for color change animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColors((prevColors) => {
        const newColors = [...prevColors];
        if (newColors.length >= 5) {
          newColors.shift();
        }
        newColors.push(colors[Math.floor(Math.random() * colors.length)]);
        return newColors;
      });
    }, 6000); // Interval update every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleSignUpButton = () => {
    navigate("/dashboard");
  };

  const handleForgotPassButton = () => {
    navigate("/forgot-password");
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center from-sky-100 to-white"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {activeColors.map((color, index) => (
          <div
            key={index}
            className={`absolute h-40 w-40 ${color} opacity-75 rounded-full blur-3xl transition-transform duration-3000 ease-in-out`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%) scale(0)',
              animation: `pulse-${index} 8s infinite`,
              ...(cursorPosition.x !== -100 && cursorPosition.y !== -100
                ? {
                    top: `${cursorPosition.y}px`,
                    left: `${cursorPosition.x}px`,
                    transform: "translate(-50%, -50%) scale(1.5)",
                    transition: "top 0.2s ease, left 0.2s ease",
                  }
                : {}),
            }}
          ></div>
        ))}
      </div>

      <div className="from-sky-100 to-white p-10 rounded-lg shadow-2xl w-full max-w-sm bg-white z-10">
        <div className="flex justify-center mb-4">
          <img src={Logo} alt="InterviewGo Logo" className="h-20" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">InterviewGo!</h1>
        <h2 className="text-lg text-center mb-6">
          Hello, Welcome Back
        </h2>
        {message && <p className="text-center text-red-500">{message}</p>}
        <form className="space-y-4" onSubmit={handleLoginButton}>
          <div>
            <div className="mt-6">
              <FloatingLabel
                variant="standard"
                label="Email"
                id="email"
                name="email"
                type="email"
                required
                className="focus:ring-customBiru2-500 focus:border-customBiru2-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <FloatingLabel
                variant="standard"
                label="Password"
                id="password"
                name="password"
                type="password"
                required
                className="focus:ring-customBiru2-500 focus:border-customBiru2-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <a
              onClick={handleForgotPassButton}
              className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
            >
              Lost Password?
            </a>

          </div>
          <div className="text-center mt-4">
          <a
            href="/registration"
            className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
          >
            Not registered yet? Sign Up
          </a>
          </div>
          <div>
            <button
              type="submit"
              className="mt-10 w-full flex justify-center bg-gradient-to-r from-customBiru3 to-customBiru6 text-white py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-customBiru4 hover:to-customBiru3"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;