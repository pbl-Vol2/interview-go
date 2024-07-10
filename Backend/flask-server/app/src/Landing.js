import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from './image/logo2.svg';
import orang from './image/orang.png';

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
            <img src={logo2} alt="Logo" className="inline-block mr-2 h-8" />
            <h1 className="text-5xl font-bold">Fluentify</h1>
          </div>
          <p className="mt-2 text-lg leading-relaxed">
            Step into the world of Fluentify, your gateway to a transformative language learning experience!
            Here, amidst a dynamic blend of cutting-edge technology and personalized teaching, you'll discover an immersive platform crafted to ignite your language journey with passion and purpose.
            Whether you're a beginner embarking on your first linguistic adventure or an advanced learner fine-tuning your fluency, Fluentify empowers you to thrive in a supportive environment tailored to your unique needs.
            Join us and unlock the keys to linguistic mastery, where every interaction becomes an opportunity to broaden your horizons and connect with the world in new and profound ways.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-6 bg-gradient-to-r from-cyan-800 to-blue-500 text-white py-2 px-6 rounded-full hover:from-emerald-950 hover:to-cyan-950"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
