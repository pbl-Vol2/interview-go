import React, { useState } from "react";
import { FloatingLabel } from "flowbite-react";
import AvatarEditor from "react-avatar-edit";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const Profile = () => {
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState(null);

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

  const [isOpen, setIsOpen] = useState(false);

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
                  <i class="ri-bear-smile-line text-blue-500 text-5xl"></i>
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
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 flex justify-center bg-gradient-to-r from-customBiru3 to-customBiru6 text-white  rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-customBiru4 hover:to-customBiru3"
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
                One more thing!
              </h3>
              <p className="text-center mb-6">
                Are you sure want to update your profile setting?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Nah, go back
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white hover:opacity-90 transition-opacity text-customBiru3 font-semibold w-full py-2 rounded"
                >
                  Understood!
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Profile;
