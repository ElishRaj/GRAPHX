import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Loading = ({ darkMode, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const messages = [
    "Loading Assets...",
    "Fetching Data...",
    "Processing...",
    "Finalizing...",
  ];
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const messageInterval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-all duration-300`}
    >
      {/* Pulsating Circle Animation */}
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full border-2 border-gray-500 dark:border-gray-300"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8 + i * 0.4, repeat: Infinity }}
          />
        ))}
        <motion.div
          className="relative w-14 h-14 border-4 border-gray-400 border-t-gray-700 dark:border-gray-600 dark:border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Loading Text */}
      <motion.h1
        className="mt-6 text-lg font-semibold tracking-wide"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.h1>

      {/* Progress Bar */}
      <div className="mt-4 w-64">
        <div className="relative w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-blue-500 dark:bg-blue-400"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "linear" }}
          />
        </div>
        <p className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">
          {progress.toFixed(0)}% Loaded
        </p>
      </div>
    </div>
  );
};

export default Loading;
