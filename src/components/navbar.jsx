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
            <button
              onClick={handleSignupButton}
              className="font-semibold w-72 h-12 hover:underline hover:bg-secondaryGrey duration-500"
            >
              Sign Up
            </button>
            <p className="text-gray-300"> / </p>
            <button onClick={() => setOpenModal(true)} className="flex align-middle justify-center font-semibold w-full py-1 px-4 border-2 border-customBiru3 rounded-full shadow-lg transform transition-transform hover:scale-105">
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
      className="relative w-fit h-fit"
    >
      <a href={href} className="relative text-black">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
        />
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
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
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
        <h3 className="font-semibold">For Individuals</h3>
        <a href="/" className="block text-sm hover:underline">
          <i class="ri-rocket-fill mx-2"></i>
          Introduction
        </a>
        <a href="/" className="block text-sm hover:underline">
          <i class="ri-mic-line mx-2"></i>
          Interview Test
        </a>
        <a href="/" className="block text-sm hover:underline">
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
