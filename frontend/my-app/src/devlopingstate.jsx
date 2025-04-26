import React from "react";
import { useNavigate } from "react-router-dom";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";

const MaintenancePage = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-6 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-800 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900"
      }`}
    >
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div
          className="absolute bg-purple-500 rounded-full h-72 w-72 top-10 left-10 opacity-30"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
        ></motion.div>
        <motion.div
          className="absolute bg-blue-400 rounded-full h-56 w-56 bottom-10 right-10 opacity-20"
          animate={{ scale: [1, 1.5, 1], rotate: [-360, 0, 360] }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-0 text-center">
        {/* Animated Header */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
          style={{
            color: "inherit",
            textShadow: isDarkMode
              ? "2px 2px 10px rgba(255, 255, 255, 0.8)"
              : "2px 2px 10px rgba(0, 0, 0, 0.2)",
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          🚧 Page Under Development 🚧
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl font-medium mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
        >
          We’re working on something amazing. Stay tuned for the big reveal!
        </motion.p>
        <motion.p
          className={`text-sm ${
            isDarkMode ? "text-purple-300" : "text-gray-500"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        >
          Thank you for your patience. Check back soon!
        </motion.p>

        {/* Button */}
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={navigateBack}
            className={`px-8 py-3 rounded-full text-lg font-semibold shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "bg-gradient-to-r from-indigo-400 to-cyan-500 text-white"
            } hover:opacity-90 transition duration-300`}
          >
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenancePage;
