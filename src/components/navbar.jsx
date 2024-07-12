import React from 'react';
import monye from "../assets/image/monye.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignupButton = () => {
    navigate("/registration");
  };

  const handleProfileButton = () => {
    navigate("/profile");
  };

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

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
            <ul className="flex navbar gap-8">
              <li className="nav-item ">
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
                <a href="/about" className="text-black hover:underline">
                  TIPS & TRICK
                </a>
              </li>
            </ul>
          </div>
          <div className="group space-x-2 hidden md:flex md:items-center w-52">
            <>
              <button
                onClick={handleProfileButton}
                className="font-semibold w-72 h-12 hover:underline hover:bg-secondaryGrey duration-500"
              >
                Profile
              </button>
              <button
                onClick={() => navigate('/login')}
                className="font-semibold w-72 h-12 hover:underline hover:bg-secondaryGrey duration-500"
              >
                Login
              </button>
            </>
          </div>
        </div>
      </div>

      {/* modal login */}
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-2">
              InterviewGo!
            </h1>
            <h2 className="text-lg text-center mb-6">
              Welcome back, you’ve been missed!
            </h2>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput id="password" type="password" required />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a
                href="#"
                className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Lost Password?
              </a>
            </div>
            <div className="w-full">
              <Button>Log in to your account</Button>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <a
                href="#"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Create account
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal> 
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
      className="relative nav-item"
    >
      <a href={href} className="text-black hover:underline">
        {children}
      </a>
      {showFlyout && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          className="absolute left-0 w-64 pt-2"
        >
          <div className="bg-white shadow-lg border p-4">
            <FlyoutContent />
          </div>
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
          <i class="ri-rocket-fill mx-2"></i>
          Introduction
        </a>
        <a href="/interview" className="block text-sm hover:underline">
          <i class="ri-mic-line mx-2"></i>
          Interview Test
        </a>
        <a href="/chatbot" className="block text-sm hover:underline">
          <i class="ri-chat-smile-3-fill mx-2"></i>
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
