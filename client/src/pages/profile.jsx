import React, { useState, useEffect } from "react";
import { FloatingLabel } from "flowbite-react";
import AvatarEditor from "react-avatar-edit";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import axios from "axios";

const Profile = () => {
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user info from backend upon component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // Example: retrieve token from local storage
        if (!token) {
          throw new Error('Missing token');
        }

        const response = await axios.get("http://localhost:5000/get_user_info", {
          headers: {
            Authorization: `Bearer ${token}` // Include token in headers
          },
          withCredentials: true, // Ensure credentials are sent if using cookies for authentication
        });
        const { fullname, email } = response.data.user; // Assuming backend returns fullname and email
        setFullname(fullname);
        setEmail(email);
        // Assuming 'profile_pic' is also retrieved and can be used for AvatarEditor
        // setSrc(user.profile_pic); // Uncomment if profile picture is also fetched
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          setError(`Error: ${error.response.data.msg}`);
        } else if (error.request) {
          console.log(error.request);
          setError("Error: No response received from server");
        } else {
          console.log('Error', error.message);
          setError(`Error: ${error.message}`);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const onClose = () => {
    setPreview(null);
  };

  const onCrop = (view) => {
    setPreview(view);
  };

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 716800) {
      alert("File is too big!");
      elem.target.value = "";
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (newPassword !== retypePassword) {
        setError("Passwords do not match");
        return;
      }

      const token = localStorage.getItem('token'); // Retrieve token from local storage

      const response = await axios.post(
        "http://localhost:5000/update_profile",
        {
          fullname,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          withCredentials: true, // Ensure credentials are sent if using cookies for authentication
        }
      );

      console.log(response.data);
      setIsOpen(true); // Show modal or alert on successful update
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        setError(`Error: ${error.response.data.msg}`);
      } else if (error.request) {
        console.log(error.request);
        setError("Error: No response received from server");
      } else {
        console.log('Error', error.message);
        setError(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBiru3 text-white">
      <div className="w-1/2 p-8 rounded-lg shadow-lg bg-white">
        <div className="flex gap-10 pt-3">
          {/* image profile */}
          <div className="image-profile">
            <div className="flex items-center justify-center mb-6">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center outline outline-blue-500">
                  <i className="ri-bear-smile-line text-blue-500 text-5xl"></i>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center mb-6">
              <AvatarEditor
                width={250}
                height={250}
                onCrop={onCrop}
                onClose={onClose}
                onBeforeFileLoad={onBeforeFileLoad}
                src={src}
              />
            </div>
          </div>

          {/* input profile */}
          <div className="flex flex-col w-full items-center space-y-4 ms-5">
            <h1 className="text-secondaryBlack font-bold text-3xl">
              My Profile
            </h1>
            <div className="w-full">
              <div className="mt-8">
                <FloatingLabel
                  variant="outlined"
                  label="Fullname"
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="rounded-none outline-black"
                />
              </div>
              <div className="mt-6">
                <FloatingLabel
                  variant="outlined"
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled // Make the email field disabled
                  value={email}
                  className="rounded-none outline-black"
                />
              </div>
              <h2 className="text-secondaryBlack font-semibold mt-5">
                Reset Password
              </h2>
              <div className="mt-4">
                <FloatingLabel
                  variant="outlined"
                  label="New Password"
                  id="password"
                  name="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="rounded-none outline-black"
                />
              </div>
              <div className="mt-6">
                <FloatingLabel
                  variant="outlined"
                  label="Re-Type Password"
                  id="retype-password"
                  name="retype-password"
                  type="password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  required
                  className="rounded-none outline-black"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-500">
            <p>{error}</p>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleUpdateProfile}
            className="px-4 py-2 flex justify-center bg-gradient-to-r from-customBiru3 to-customBiru6 text-white rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-customBiru4 hover:to-customBiru3"
          >
            Save Profile
          </button>
        </div>

        <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};

const SpringModal = ({ isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br  from-customBiru6 to-customBiru3 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-customBiru3 grid place-items-center mx-auto">
                <FiAlertCircle />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                Profile Updated!
              </h3>
              <p className="text-center mb-6">
                Your profile settings have been updated successfully.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-customBiru3 hover:bg-customBiru4 text-white font-semibold w-full py-2 rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Profile;
