import React, { useRef, useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import animationData from "./Graph.json";
import { useAuth } from "./auth";

const AnimationPage = ({ isDarkMode }) => {
  const containerRef = useRef(null);
  const [isLottieVisible, setIsLottieVisible] = useState(false);
  const [isMidRange, setIsMidRange] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();

  // Dynamic theme application
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = isDarkMode
        ? "#111827"
        : "#ffffff";
      containerRef.current.style.color = isDarkMode ? "#ffffff" : "#000000";
    }
  }, [isDarkMode]);

  // Responsive layout handling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsLottieVisible(width > 1097);
      setIsMidRange(width >= 764 && width <= 1095);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? "/workspace" : "/login");
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center min-h-screen px-8 md:px-24 py-10 transition-all duration-300 ${
        isMidRange ? "flex-col items-center" : "md:flex-row"
      } mt-6 md:mt-[-7px]`}
    >
      {/* Text Content Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 2 }}
        className={`space-y-8 text-center ${
          isMidRange ? "w-full" : "md:w-1/2 md:text-left md:pl-12"
        }`}
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text leading-tight">
          Graph-X
        </h1>

        <p className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Your Data - Our Graphs
        </p>

        {isAuthenticated && userData && (
          <p className="text-lg font-medium">
            Welcome, {userData.name || userData.email}
          </p>
        )}

        <p
          className={`text-lg sm:text-xl md:text-2xl leading-relaxed ${
            isMidRange ? "max-w-full px-4" : "max-w-full md:max-w-lg"
          }`}
        >
          Transform raw data into stunning, interactive visualizations with{" "}
          <strong>Graph-X</strong>. Our AI-powered platform helps you create
          beautiful charts effortlessly, empowering you to{" "}
          <strong>analyze, explore, and share insights</strong> like never
          before.
        </p>

        <motion.button
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.8)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStarted}
          className="bg-blue-600 text-white text-lg sm:text-xl md:text-2xl px-8 py-4 rounded-lg shadow-lg 
                    hover:bg-blue-700 transition-all duration-300 font-semibold tracking-wide"
          aria-label={
            isAuthenticated ? "Go to workspace" : "Get started with Graph-X"
          }
        >
          {isAuthenticated ? "Go to Workspace" : "Get Started →"}
        </motion.button>
      </motion.div>

      {/* Animation Section */}
      {isLottieVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className={`flex justify-center mt-10 ${
            isMidRange ? "w-full" : "md:w-1/2 md:mt-0"
          }`}
        >
          <Lottie
            loop
            animationData={animationData}
            play
            className="w-full max-w-[800px] sm:max-w-[750px] md:max-w-[900px] h-[600px] md:h-[800px]"
            aria-label="Data visualization animation"
          />
        </motion.div>
      )}
    </div>
  );
};

export default AnimationPage;
