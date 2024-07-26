import React, { useState, useEffect } from "react";
import { FloatingLabel } from "flowbite-react";
import AvatarEditor from "react-avatar-edit";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState('');
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Modal open state

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Missing token");
        }

        const response = await axios.get("http://localhost:5000/get_user_info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data && response.data.user) {
          const { fullname, email, profile_pic } = response.data.user;
          setFullname(fullname);
          setEmail(email);
          setSrc(profile_pic || '');
        } else {
          throw new Error("User data is missing in the response");
        }
      } catch (error) {
        handleFetchError(error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFetchError = (error) => {
    if (error.response) {
      console.log(error.response.data);
      setError(`Error: ${error.response.data.msg}`);
    } else if (error.request) {
      console.log(error.request);
      setError("Error: No response received from server");
    } else {
      console.log("Error", error.message);
      setError(`Error: ${error.message}`);
    }
  };

  const onClose = () => {
    setPreview(null);
  };

  const onCrop = (view) => {
    if (view) {
      setPreview(view);
    }
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
  
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullname", fullname);
  
      if (newPassword) {
        formData.append("newPassword", newPassword);
        formData.append("oldPassword", oldPassword);
      }
  
      if (preview) {
        const isDataURL = preview.startsWith('data:');
        if (isDataURL) {
          const response = await fetch(preview);
          const blob = await response.blob();
          formData.append("file_give", new File([blob], "profile-pic.jpg", { type: blob.type }));
        } else {
          formData.append("file_give", preview);
        }
      }
  
      const response = await axios.post(
        "http://localhost:5000/update_profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true,
        }
      );
  
      if (response.data.result === 'success') {
        setIsOpen(true); // Open the modal on success
      } else {
        setError(response.data.msg || "An error occurred while updating profile.");
      }
    } catch (error) {
      handleUpdateError(error);
    }
  };

  const handleUpdateError = (error) => {
    if (error.response) {
      console.log(error.response.data);
      setError(`Error: ${error.response.data.msg}`);
    } else if (error.request) {
      console.log(error.request);
      setError("Error: No response received from server");
    } else {
      console.log("Error", error.message);
      setError(`Error: ${error.message}`);
    }
  };

  const handleModalClose = () => {
    console.log('Modal closed'); // Debug log
    setIsOpen(false);
    navigate("/profile"); // Redirect to profile page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBiru3 text-white">
      <div className="w-1/2 p-8 rounded-lg shadow-lg bg-white">
        <div className="flex flex-row gap-12 pt-3">
          {/* Image Profile */}
          <div className="image-profile">
            <div className="flex items-center justify-center mb-6">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full justify-center outline outline-blue-500"
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
                src={src} // Ensure src is always a string
              />
            </div>
          </div>

          {/* Input Profile */}
          <div className="flex flex-col w-full items-center space-y-4 ms-5 pe-5">
            <h1 className="text-secondaryBlack font-bold text-3xl">My Profile</h1>
            <div className="w-full">
              <div className="mt-8">
                <FloatingLabel
                  variant="outlined"
                  label="Fullname"
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
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
                  value={email}
                  readOnly
                  required
                  className="rounded-none outline-black"
                />
              </div>
              <h2 className="text-secondaryBlack font-semibold mt-5">Reset Password</h2>
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

        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={handleUpdateProfile}
            className="flex justify-center font-medium text-sm bg-gradient-to-r from-customBiru3 to-customBiru6 text-white rounded-full shadow-lg hover:from-customBiru4 hover:to-customBiru3 px-5 py-2.5 me-2 mb-2"
          >
            Save Profile
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isOpen && (
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
              className="bg-white rounded-lg p-6 shadow-lg"
            >
              <h2 className="text-center text-lg font-bold text-green-600">Profile Updated!</h2>
              <p className="text-center mt-2">Your profile has been successfully updated.</p>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleModalClose}
                  className="text-white bg-green-500 px-4 py-2 rounded-full"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfile;
