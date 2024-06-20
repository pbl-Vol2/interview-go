import { FloatingLabel } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Landing from "./landing";
import Logo from "../assets/image/logo.png"

const Registration = () => {
  // const navigate = useNavigate();
  // const handleLandingButton = () => {
  //   navigate("/landing");
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center from-sky-100 to-white">
      <div className="from-sky-100 to-white p-10 rounded-lg shadow-2xl w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <img
            src={Logo}
            alt="InterviewGo Logo"
            className="h-20"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">InterviewGo!</h1>
        <h2 className="text-lg text-center mb-6">
          <span className="font-medium">Join TODAY</span> and Ace Every Interview
        </h2>
        <form className="space-y-4">
          <div>
            <div className="mt-8">
              <FloatingLabel
                variant="standard"
                label="Fullname"
                id="fullname"
                name="fullname"
                type="text"
                required
                className="focus:ring-customBiru2-500 focus:border-customBiru2-500"
              />
            </div>
            <div className="mt-6">
              <FloatingLabel
                variant="standard"
                label="Email"
                id="email"
                name="email"
                type="email"
                required
                className="focus:ring-customBiru2-500 focus:border-customBiru2-500"
              />
            </div>
            <div className="mt-6">
              <FloatingLabel
                variant="standard"
                label="Password"
                id="password"
                name="password"
                type="password"
                required
                className="focus:ring-customBiru2-500 focus:border-customBiru2-500"
              />
            </div>
            <div className="mt-6">
              <FloatingLabel
                variant="standard"
                label="Re-Type Password"
                id="retype-password"
                name="retype-password"
                type="password"
                required
                className="focus:ring-customBiru2-500 focus:border-customBiru2-500"
              />
            </div>
          </div>
          <div>
          <button
              // onClick={handleSignupButton}
              className="mt-6 w-full flex justify-center bg-gradient-to-r from-customBiru3 to-customBiru6 text-white py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-customBiru4 hover:to-customBiru3"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
