import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import axios from "axios";

const RegisterForm = ({ isDarkMode, onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  axios.defaults.withCredentials = true;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        " http://localhost:30000/register",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setShowSuccess(true);
        onRegisterSuccess(response.data.user);
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = " http://localhost:30000/auth/google";
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          " http://localhost:30000/auth/status",
          {
            withCredentials: true,
          }
        );
        if (response.data.isAuthenticated) {
          onRegisterSuccess(response.data.user);
          navigate("/");
        }
      } catch (err) {
        console.log("Not authenticated");
      }
    };
    checkAuth();
  }, [navigate, onRegisterSuccess]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get("login_success");
    if (loginSuccess === "true") {
      const user = JSON.parse(urlParams.get("user") || "{}");
      setShowSuccess(true);
      onRegisterSuccess(user);
      setTimeout(() => navigate("/"), 1500);
    }
  }, [navigate, onRegisterSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isDarkMode ? "bg-gray-900/95" : "bg-white/95"
      } backdrop-blur-md`}
    >
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div
            className={`p-6 rounded-lg shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Registration Successful!
            </h3>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              Redirecting to dashboard...
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ y: -30, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        whileHover={{
          boxShadow: isDarkMode
            ? "0 40px 70px -20px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.4)"
            : "0 35px 60px -15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 0 0 1px rgba(59, 130, 246, 0.1)",
          y: -5,
          transition: { duration: 0.4, ease: "easeOut" },
        }}
        transition={{
          duration: 0.4,
          ease: [0.175, 0.885, 0.32, 1.1],
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className={`relative p-8 rounded-2xl w-full max-w-md mx-4 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        style={{
          boxShadow: isDarkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg text-sm ${
              isDarkMode
                ? "bg-red-900/50 text-red-200"
                : "bg-red-100 text-red-800"
            }`}
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
        >
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              transition: { duration: 15, repeat: Infinity, ease: "linear" },
            }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: 2,
              },
            }}
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-600/10 rounded-full blur-3xl"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className={`absolute top-4 right-4 p-1.5 rounded-full ${
            isDarkMode ? "hover:bg-gray-700/80" : "hover:bg-gray-100"
          } transition-all duration-200 z-10`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>

        <div className="text-center mb-8 relative z-10">
          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Create Account
          </motion.h2>
          <motion.p
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Join our community today
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-5 mb-8 relative z-10"
          onSubmit={handleRegister}
        >
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring" }}
          >
            <input
              type="email"
              placeholder="Your email address"
              className={`w-full px-4 py-3.5 rounded-xl border-2 text-lg focus:outline-none focus:ring-4 transition-all ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600 focus:border-blue-500 focus:ring-blue-500/30 placeholder-gray-500"
                  : "bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 placeholder-gray-400"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <input
              type="password"
              placeholder="Create password (8+ chars)"
              className={`w-full px-4 py-3.5 rounded-xl border-2 text-lg focus:outline-none focus:ring-4 transition-all ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600 focus:border-blue-500 focus:ring-blue-500/30 placeholder-gray-500"
                  : "bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 placeholder-gray-400"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
            />
          </motion.div>

          <motion.button
            whileHover={{
              y: -2,
              scale: 1.01,
              boxShadow: isDarkMode
                ? "0 8px 25px -5px rgba(59, 130, 246, 0.4)"
                : "0 8px 25px -5px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-semibold text-lg tracking-wide transition-all duration-300 shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/20"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-500/30"
            } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </div>
            ) : (
              "Continue with Email"
            )}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="relative my-6 z-10"
        >
          <div
            className={`absolute inset-0 flex items-center ${
              isDarkMode ? "text-gray-600" : "text-gray-300"
            }`}
            aria-hidden="true"
          >
            <div
              className={`w-full border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            />
          </div>
          <div className="relative flex justify-center">
            <span
              className={`px-3 text-sm rounded-full ${
                isDarkMode
                  ? "bg-gray-800 text-gray-400"
                  : "bg-white text-gray-500"
              }`}
            >
              Or
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="mb-6 relative z-10"
        >
          <motion.button
            whileHover={{
              y: -2,
              scale: 1.01,
              boxShadow: isDarkMode
                ? "0 8px 20px -5px rgba(0, 0, 0, 0.3)"
                : "0 8px 20px -5px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className={`flex items-center justify-center w-full py-3.5 px-4 rounded-xl border-2 font-medium text-lg transition-all duration-300 ${
              isDarkMode
                ? "border-gray-700 bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 hover:shadow-lg hover:shadow-blue-500/10"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:shadow-lg hover:shadow-blue-500/5"
            } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <FcGoogle className="text-2xl mr-3" />
            Continue with Google
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-center text-sm relative z-10"
        >
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Already have an account?{" "}
          </span>
          <motion.div
            className="inline-block relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-500 hover:text-blue-600 transition-colors relative pb-1"
            >
              Sign in
              <motion.span
                initial={{ scaleX: 0, transformOrigin: "left center" }}
                whileHover={{
                  scaleX: 1,
                  transition: {
                    duration: 0.3,
                    ease: [0.175, 0.885, 0.32, 1.1],
                  },
                }}
                className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-500"
                style={{
                  boxShadow: isDarkMode
                    ? "0 1px 3px rgba(59, 130, 246, 0.5)"
                    : "0 1px 2px rgba(59, 130, 246, 0.3)",
                }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;
