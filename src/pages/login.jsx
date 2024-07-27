import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FloatingLabel, Checkbox, Label } from "flowbite-react";
import Logo from "../assets/image/logo.png";
import '../assets/style.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoginButton = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: email,
        password: password,
      });

      if (response.data.result === 'success') {
        setMessage('Login successful!');
        const token = response.data.token;
        const expiresIn = response.data.expiresIn; // Assume server returns token expiration time in seconds

        // Store token securely, consider using HttpOnly cookie for security
        localStorage.setItem('token', token);

        // Save token expiration time
        const expirationTime = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem('tokenExpiration', expirationTime);

        if (rememberMe) {
          localStorage.setItem('email', email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('rememberMe', 'false');
        }

        // Redirect to dashboard
        navigate('/dashboard');
        window.location.reload();
        
      } else {
        setMessage(response.data.msg || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.msg || 'An error occurred');
      setMessage(error.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center from-sky-100 to-white">
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <a
              href="/forgotPassword"
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
