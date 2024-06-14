import React from 'react';
import './style.css';
import logo from './image/logo.png';
import orang from './image/orang.png';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    
    const handleGetStarted = () => {
        navigate('/dashboard');
    };
    
    return (
        <section className="flex items-center min-h-screen">
            <div className="container mx-auto flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mt-8 md:mt-0">
                    <img src={orang} alt="logo" className="w-full" />
                </div>
                <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left px-4">
                    <div className="flex items-center mb-4">
                        <img src={logo} alt="Logo" />
                    </div>
                    <p className="mt-2 text-3xl leading-relaxed text-justify">
                        Helps you prepare for job interviews with confidence and top-notch skills. With our advanced features, you will be prepared for every question and challenge in the job selection process.
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="mt-6 bg-gradient-to-r from-gray-950 to-gray-500 text-white py-2 px-6 rounded-full hover:from-cyan-800 hover:to-blue-500"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Landing;