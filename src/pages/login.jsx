import { FloatingLabel, Checkbox, Label } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/image/logo.png";
import React, { useEffect, useState } from 'react';
import '../assets/style.css';

const colors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500'
];

const Login = () => {
  const [activeColors, setActiveColors] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColors(prevColors => {
        const newColors = [...prevColors];
        if (newColors.length >= 5) {
          newColors.shift();
        }
        newColors.push(colors[Math.floor(Math.random() * colors.length)]);
        return newColors;
      });
    }, 6000); // Interval pembaruan setiap 6 detik

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleSignUpButton = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center from-sky-100 to-white" onMouseMove={handleMouseMove}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {activeColors.map((color, index) => (
          <div
            key={index}
            className={`absolute h-40 w-40 ${color} opacity-75 rounded-full blur-3xl transition-transform duration-3000 ease-in-out`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%) scale(0)`,
              animation: `pulse-${index} 8s infinite`,
              ...(cursorPosition.x !== -100 && cursorPosition.y !== -100 ? {
                top: `${cursorPosition.y}px`,
                left: `${cursorPosition.x}px`,
                transform: 'translate(-50%, -50%) scale(1.5)',
                transition: 'top 0.2s ease, left 0.2s ease'
              } : {})
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
        <form className="space-y-4">
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
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <a
              href="#"
              className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
            >
              Lost Password?
            </a>
          </div>
          <div>
            <button
              onClick={handleSignUpButton}
              className="mt-10 w-full flex justify-center bg-gradient-to-r from-customBiru3 to-customBiru6 text-white py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-customBiru4 hover:to-customBiru3"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
