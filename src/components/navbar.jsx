import React, { useState } from 'react';
import monye from "../assets/image/monye.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/auth-context";
import axios from 'axios';

const Navbar = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSignupButton = () => {
    navigate("/registration");
  };

  const handleProfileButton = () => {
    navigate("/profile");
  };

  const handleLoginButton = () => {
    login();
    navigate("/dashboard");
  };

  const handleLogoutButton = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmLogout = async () => {
    try {
        await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
        // Clear tokens from storage
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('rememberMe');
        // Call logout function and redirect
        logout();
        navigate("/");
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        setShowConfirmDialog(false);
    }
};

 


  const handleCancelLogout = () => {
    setShowConfirmDialog(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src={monye}
              alt="Logo"
              className="h-12 w-auto"
            />
          </div>
          <div className="hidden md:flex md:space-x-8">
            <ul className="flex space-x-8">
              <li className="nav-item">
                <a href="/" className="text-black hover:underline">
                  HOME
                </a>
              </li>
              <li className="nav-item">
                <a href="/about" className="text-black hover:underline">
                  ABOUT
                </a>
              </li>
              <FlyoutLink href="/features" FlyoutContent={FeaturesContent}>
                FEATURES
              </FlyoutLink>
              <li className="nav-item">
                <a href="/pricing" className="text-black hover:underline">
                  PRICING
                </a>
              </li>
            </ul>
          </div>
          <div className="hidden md:flex space-x-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleProfileButton}
                  className="font-semibold px-4 py-2 border rounded-lg hover:bg-secondaryGrey transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogoutButton}
                  className="font-semibold px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignupButton}
                  className="font-semibold px-4 py-2 border rounded-lg hover:bg-secondaryGrey transition-colors"
                >
                  Sign Up
                </button>
                <p className="text-gray-300"> / </p>
                <button
                  onClick={handleLoginButton}
                  className="flex items-center font-semibold px-4 py-2 border-2 border-customBiru3 text-customBiru3 rounded-lg hover:bg-customBiru3 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 20"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="mr-2"
                  >
                    <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path>
                  </svg>
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="mt-2">Are you sure you want to log out?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const FlyoutLink = ({ children, href, FlyoutContent }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative"
    >
      <a href={href} className="text-black hover:underline">
        {children}
      </a>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          className="absolute left-0 mt-2 w-64 bg-white shadow-lg border p-4"
        >
          <FlyoutContent />
        </motion.div>
      )}
    </div>
  );
};

const FeaturesContent = () => {
  return (
    <div className="w-64 bg-white p-6 shadow-xl">
      <div className="mb-3 space-y-3">
        <h3 className="font-semibold">For Individuals</h3>
        <a href="/" className="block text-sm hover:underline">
          <i className="ri-rocket-fill mx-2"></i>
          Introduction
        </a>
        <a href="/interview" className="block text-sm hover:underline">
          <i className="ri-mic-line mx-2"></i>
          Interview Test
        </a>
        <a href="/chatbot" className="block text-sm hover:underline">
          <i className="ri-chat-smile-3-fill mx-2"></i>
          MonBot
        </a>
      </div>
      <div className="mb-6 space-y-3">
        <h3 className="font-semibold">For Companies</h3>
        <a href="/" className="block text-sm hover:underline">
          Startups
        </a>
      </div>
      <button className="w-full rounded-lg border-2 border-neutral-950 px-4 py-2 font-semibold transition-colors hover:bg-neutral-950 hover:text-white">
        Contact Us
      </button>
    </div>
  );
};

export default Navbar;
