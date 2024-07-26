import React from "react";
import monye from "../assets/image/monye.png";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignupButton = () => {
    navigate("/registration");
  };

  const handleProfileButton = () => {
    navigate("/profile");
  };

  const handleLoginButton = () => {
    login();
    navigate("/login");
  };

  const handleLogoutButton = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="justify-center bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img
              src={monye}
              alt="Logo"
              className="inline-block pl-5 mr-2 h-12 w"
            />
          </div>
          <div className="hidden md:flex md:space-x-8 md:items-center">
            <ul className="flex navbar gap-8 justify-center items-center">
              <li className="nav-item font-semibold">
                <a href="/" className="text-black hover:underline">
                  HOME
                </a>
              </li>
              <li className="nav-item font-semibold">
                <a href="/about" className="text-black hover:underline">
                  ABOUT
                </a>
              </li>
              <li className="nav-item">
                <FlyoutLink href="/features" FlyoutContent={FeaturesContent}>
                  FEATURES
                </FlyoutLink>
              </li>
              <li className="nav-item font-semibold">
                <a href="/pricing" className="text-black hover:underline">
                  PRICING
                </a>
              </li>
            </ul>
          </div>
          <div className="group space-x-2 hidden md:flex md:items-center w-52">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleProfileButton}
                  className="font-semibold w-72 h-12 hover:underline hover:bg-secondaryGrey duration-500"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogoutButton}
                  className="flex align-middle justify-center font-semibold w-full py-1 px-4 border-2 border-customBiru3 rounded-full shadow-lg transform transition-transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignupButton}
                  className="font-semibold w-72 h-12 hover:underline hover:bg-secondaryGrey duration-500"
                >
                  Sign Up
                </button>
                <p className="text-gray-300"> / </p>
                <button
                  onClick={handleLoginButton}
                  className="flex align-middle justify-center font-semibold w-full py-1 px-4 border-2 border-customBiru3 rounded-full shadow-lg transform transition-transform hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 20"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="mr-2 mt-1"
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
    </nav>
  );
};

const FlyoutLink = ({ children, href, FlyoutContent }) => {
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit"
    >
      <a href={href} className="relative hover:underline font-semibold">
        {children}
      </a>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-12 bg-white text-black"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            {/* <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" /> */}
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeaturesContent = () => {
  return (
    <div className="w-64 bg-white p-6 shadow-xl">
      <div className="mb-3 space-y-3">
        <h3 className="font-semibold">Our Services</h3>
        <a href="/interview" className="block text-sm hover:underline">
          <i className="ri-mic-line mx-2"></i>
          Interview Test
        </a>
        <a href="/chatbot" className="block text-sm hover:underline">
          <i className="ri-chat-smile-3-fill mx-2"></i>
          MonBot
        </a>
      </div>
    </div>
  );
};

export default Navbar;
