import React from 'react';
import monye from '../image/monye.png';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
          <img src={monye} alt="Logo" className="inline-block pl-5 mr-2 h-12 w"/>
          </div>
          <div className="hidden md:flex md:space-x-8 md:items-center">
            <a href="/" className="text-xl text-black hover:text-customKuning">Home</a>
            <a href="/about" className="text-xl text-black hover:text-customKuning">About</a>
          </div>
          <div className="space-x-4 hidden md:flex md:items-center">
            <button className="bg-gradient-to-r from-customBiru3 to-customBiru6 text-lg text-white py-2 px-2 rounded-md shadow-lg hover:from-customBiru4 hover:to-customBiru3">Sign Up</button>
            <button className="bg-gradient-to-r from-customBiru3 to-customBiru6 text-lg text-white py-2 px-2 rounded-md shadow-lg hover:from-customBiru4 hover:to-customBiru3">Sign In</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
