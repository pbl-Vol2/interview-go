import React from 'react';
import orang from '../assets/image/orang.png';

const dashboard = () => {
  const cardData = [
    {
      title: 'Speaking Test',
      description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
      buttonText: 'Read more',
    },
    {
      title: 'Chatbot',
      description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
      buttonText: 'Read more',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Hello User!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardData.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg">
              <a href="#" className="block">
                <img src={orang} alt="" className="rounded-t-lg w-full h-48 object-cover" />
              </a>
              <div className="p-6">
                <a href="#" className="block">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition duration-300">
                    {card.title}
                  </h2>
                </a>
                <p className="text-sm text-gray-600 mb-4">
                  {card.description}
                </p>
                <a
                  href="#"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  {card.buttonText}
                  <svg
                    className="inline-block w-4 h-4 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75V9h4.25a.75.75 0 110 1.5H10v5.25a.75.75 0 01-1.5 0V10H3.75a.75.75 0 110-1.5H9V3.75A.75.75 0 0110 3zm-9 8a1 1 0 011-1h9a1 1 0 110 2H2a1 1 0 01-1-1zm18-6a1 1 0 00-1-1h-9a1 1 0 100 2h9a1 1 0 001-1z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default dashboard;