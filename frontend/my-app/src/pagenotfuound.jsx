import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import Lottie from "react-lottie"; // For Lottie animation
import animationData from "./404eror.json"; // Import your Lottie animation JSON

const PageNotFound = ({ isDarkMode }) => {
  const navigate = useNavigate(); // To navigate back to the previous page

  // Lottie animation settings
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 text-white"
          : "bg-gradient-to-r from-blue-50 via-pink-100 to-white text-gray-900"
      } text-center px-6`}
    >
      {/* Lottie Animation */}
      <div className="w-full md:w-3/4 lg:w-1/2 xl:w-2/5">
        <Lottie options={defaultOptions} />
      </div>

      {/* Text Content */}
      <h1 className="text-4xl md:text-5xl font-bold mt-[-7px]">
        Oops! Page Not Found
      </h1>
      <p
        className={`mt-2 text-lg ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        } max-w-md`}
      >
        The page you're looking for doesn't exist. It might have been moved,
        deleted, or you might have mistyped the URL.
      </p>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className={`mt-6 py-3 px-10 text-lg font-semibold rounded-full shadow-md transform transition-transform duration-300 ${
          isDarkMode
            ? "bg-purple-700 text-white hover:bg-purple-600"
            : "bg-indigo-500 text-white hover:bg-indigo-600"
        } hover:scale-105`}
      >
        Go Back
      </button>
    </div>
  );
};

export default PageNotFound;
