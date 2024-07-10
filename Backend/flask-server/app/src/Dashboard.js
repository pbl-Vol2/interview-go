import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl bg-gray-200 p-4 rounded mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* <div className="flex space-x-6">
          <a href="#home" className="text-black">Home</a>
          <a href="#about" className="text-black">About</a>
          <a href="#user" className="text-black">User</a>
        </div> */}
      </div>
      <div className="w-full max-w-6xl flex">
        <div className="w-2/3 mr-8">
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="font-bold text-lg">Learn 1</h2>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
          </div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="font-bold text-lg">Learn 2</h2>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
          </div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="font-bold text-lg">Learn 3</h2>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
          </div>
        </div>
        <div className="w-1/3">
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="font-bold text-lg">Your Progress</h2>
            <p className="text-4xl text-center mt-4">40%</p>
          </div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="font-bold text-lg">Title</h2>
            <p className="text-gray-700 mt-2">Subtitle</p>
            <p className="text-gray-700 mt-2">Subtitle</p>
            <p className="text-gray-700 mt-2">Subtitle</p>
          </div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <p className="text-center mt-2">CERITANYA INI CHATBOT!</p>
            <p className="text-center mt-2">MASIH BLOM TAU JADI APA NGGA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
