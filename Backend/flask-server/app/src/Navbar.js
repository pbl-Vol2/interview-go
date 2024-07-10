import React, { useState } from 'react';
import './style.css';
import logo from './image/logo.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLoginButton = () => {
    navigate("/register");
  };

  return (
    <nav className="bg-cyan-900 p-4 sticky top-0 z-50 flex justify-between items-center">
      <div className="text-white font-bold text-xl navbar-logo flex items-center">
        <button
          className="p-2 bg-cyan-900 text-white mr-4"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <img src={logo} alt="Logo" className="inline-block mr-2 h-8"/>
        Fluentify
      </div>
      <div className="hidden md:flex space-x-6">
        <a href="#home" className="text-white navbar-link">Home</a>
        <a href="#services" className="text-white navbar-link">Our Service</a>
        <a href="#about" className="text-white navbar-link">About Us</a>
      </div>
      <div className="hidden md:flex space-x-4">
        <button onClick={handleLoginButton}
        className="navbar-button bg-white text-cyan-900 px-4 py-2 rounded-md  hover:from-emerald-950 hover:to-cyan-950">SIGN UP</button>
        <button className="navbar-button hover:from-emerald-950 hover:to-cyan-950 bg-cyan-700 text-white px-4 py-2 rounded-md">SIGN IN</button>
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-cyan-900 text-white flex flex-col justify-between p-4 w-64 h-screen">
          <div>
            <h2 className="text-xl font-bold mb-8 ml-9 mt-1">FLUENTIFY</h2>
            <ul>
              <li className="mb-4 cursor-pointer hover:underline">Menu 1</li>
              <li className="mb-4 cursor-pointer hover:underline">Menu 2</li>
              <li className="mb-4 cursor-pointer hover:underline">Menu 3</li>
              <li className="mb-4 cursor-pointer hover:underline">Menu 4</li>
              <li className="mb-4 cursor-pointer hover:underline">Menu 5</li>
            </ul>
          </div>
          <div className="text-center text-sm">
            <span>&copy; Copyright</span>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default App;
