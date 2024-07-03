import React from 'react';
import chatbot from '../assets/image/chatbot.jpg';
import speaking from '../assets/image/speaking.jpg';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const cardData = [
    {
      title: 'Interview Test',
      description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
      buttonText: 'Test Now',
      image: speaking, 
      link: '/interview',
    },
    {
      title: 'Monbot',
      description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
      buttonText: 'Chat Now',
      image: chatbot, 
      link: '/chatbot',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Hello User!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardData.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg">
              <Link to={card.link} className="block">
                <img src={card.image} alt="" className="rounded-t-lg w-full h-48 object-cover" />
              </Link>
              <div className="p-6">
                <Link to={card.link} className="block">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition duration-300">
                    {card.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 mb-4">
                  {card.description}
                </p>
                <Link
                  to={card.link}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  {card.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;