import React, { useState, useEffect } from "react";
import { FloatingLabel } from "flowbite-react";
import AvatarEditor from "react-avatar-edit";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import axios from "axios";
import monye from "../assets/image/monye.png";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
        setEmail(email); // Set email state with fetched email
        // Assuming 'profile_pic' is also retrieved and can be used for AvatarEditor
        // setSrc(user.profile_pic); // Uncomment if profile picture is also fetched
      } catch (error) {
        handleFetchError(error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFetchError = (error) => {
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
  };


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

  const handleEditProfile = () => {
    navigate ("/editProfile");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBiru3 text-white">
      <div className="w-1/2 p-8 rounded-lg shadow-lg bg-white">
        <div className="flex flex-row gap-8 p-3">
          {/* image profile */}
          <div className="image-profile content-center basis-1/2">
            <div className="flex items-center justify-center mb-6">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full justify-center outline outline-blue-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full flex items-center justify-center outline outline-blue-500">
                  <i class="ri-bear-smile-line text-blue-500 text-5xl"></i>
                </div>
              )}
            </div>
          </div>

          {/* input profile */}
          <div className="flex flex-col w-full items-center space-y-4 ms-5 pe-5">
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
                  className="rounded-none outline-black "
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
                  required
                  className="rounded-none outline-black"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleEditProfile}
            className="flex justify-center font-medium text-sm bg-gradient-to-r from-customBiru3 to-customBiru6 text-white  rounded-full shadow-lg hover:from-customBiru4 hover:to-customBiru3 px-5 py-2.5 me-2 mb-2"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
