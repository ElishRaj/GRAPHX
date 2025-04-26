import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

const ChartName = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { chartName } = location.state || { chartName: "No Chart Selected" };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mb-4 text-sm text-purple-600 hover:text-purple-800 transition-all duration-300"
        >
          &larr; Go Back
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-pulse">
          Chart Details
        </h2>
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <p className="text-lg font-semibold text-gray-700">Selected Chart:</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">{chartName}</p>
        </div>
        <p className="text-sm text-gray-500 text-center">
          You are viewing the details of the{" "}
          <span className="font-bold text-purple-600">{chartName}</span>.
        </p>
        <button
          className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={() => alert(`You clicked on ${chartName}`)}
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default ChartName;
