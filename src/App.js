// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from "./components/navbar";
import Landing from "./pages/landing";
import About from "./pages/about";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard";
import Footer from "./components/footer";
import Features from "./pages/features";
import Chatbot from "./pages/chatbot";
import Interview from "./pages/interview";
import Login from "./pages/login";
import Profile from "./pages/profile";
import EditProfile from "./pages/editProfile";
import Verif from "./pages/verif";
import History from "./pages/history";
import ForgotPassword from "./pages/forgotPassword";
import Summary from "./pages/summary";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import withAuth from './components/withAuth';

const SessionChecker = ({ setIsModalOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const now = new Date().getTime();
      const expirationTime = localStorage.getItem('tokenExpiration');
      if (expirationTime && now > expirationTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        setIsModalOpen(true); // Show modal when session expires
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 30000); // 30,000 milliseconds = 30 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [setIsModalOpen]);

  return null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="App">
      <Router>
        <SessionChecker setIsModalOpen={setIsModalOpen} />
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={withAuth(Dashboard)} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/features" element={<Features />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/profile" element={withAuth(Profile)} />
          <Route path="/editProfile" element={withAuth(EditProfile)} />
          <Route path="/verif" element={withAuth(Verif)} />
          <Route path="/history" element={withAuth(History)} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/summary/:id" element={withAuth(Summary)} />
        </Routes>
        <Footer />

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="text-center">
                  <FiAlertCircle className="text-red-500 mx-auto mb-4 text-4xl" />
                  <h2 className="text-xl font-semibold mb-2">Session Expired</h2>
                  <p className="text-gray-600 mb-4">Your session has expired. Please log in again.</p>
                  <button
                    onClick={handleModalClose}
                    className="bg-gradient-to-r from-customBiru3 to-customBiru6 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg hover:from-customBiru4 hover:to-customBiru3"
                  >
                    OK
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Router>
    </div>
  );
}

export default App;
