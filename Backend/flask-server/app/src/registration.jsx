import React from 'react';
import { FloatingLabel } from "flowbite-react";
import { useNavigate } from 'react-router-dom';


export default function RegistrationForm() {
  const navigate = useNavigate();
  const handleLoginButton = () => {
    navigate("/landing");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        <div className="flex justify-center mb-4">
          <img src="../assets/image/logo.svg" alt="Fluentify Logo" className="h-16" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Fluentify</h1>
        <h2 className="text-lg font-medium text-center mb-6">Welcome Onboard!</h2>
        <form className="space-y-4">
          <div>
            {/* <FloatingLabel variant="standard" label="Fullname" /> */}
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Fullname</label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Enter Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="retype-password" className="block text-sm font-medium text-gray-700">Re-Type Password</label>
            <input
              id="retype-password"
              name="retype-password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              onClick={handleLoginButton}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-8">
          <img src="../assets/image/fam.png" alt="family using laptop" className="rounded-md w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
