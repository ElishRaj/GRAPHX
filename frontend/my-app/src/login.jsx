import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie-player";
import animationData from "./loogin.json";
import { useAuth } from "./auth";
import axios from "axios";
import { motion } from "framer-motion";

const WelcomeBackForm = ({ isDarkMode, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isHoveringClose, setIsHoveringClose] = useState(false);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isFormHovered, setIsFormHovered] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  // Configure axios to send credentials (cookies)
  axios.defaults.withCredentials = true;

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://graphx-yky3.onrender.com/login",
        { email, password, rememberMe },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
        onLoginSuccess(response.data.user);
        // Force a refresh of auth status
        await checkAuthStatus();
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `https://graphx-yky3.onrender.com/auth/google`;
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `https://graphx-yky3.onrender.com/auth/status`,
          {
            withCredentials: true,
          }
        );

        if (response.data.isAuthenticated) {
          onLoginSuccess(response.data.user);
          navigate("/home");
        }
      } catch (e) {
        console.log("Not authenticated");
      }
    };

    checkAuth();
  }, [navigate, onLoginSuccess]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 overflow-hidden ${
        isDarkMode ? "bg-black/30" : "bg-white/30"
      } backdrop-blur-sm`}
    >
      {/* Success Popup */}
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
              Login Successful! adfakfjaskfjakfjakfjaskfjakfjakafdaf
            </h3>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              Redirecting to dashboard...
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Form */}
      <div
        className="fixed flex items-center justify-center w-full h-full"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl">
          {/* Lottie Animation */}
          <div className="hidden md:block w-1/2">
            <Lottie
              loop
              animationData={animationData}
              play
              className="w-full h-full max-h-[90vh]"
            />
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsFormHovered(true)}
            onMouseLeave={() => setIsFormHovered(false)}
            className={`p-8 w-full max-w-md rounded-xl z-10 relative transition-all duration-500 ${
              isDarkMode
                ? "bg-gray-800/95 border-gray-700"
                : "bg-white/95 border-gray-200"
            } border m-4 ${
              isFormHovered
                ? isDarkMode
                  ? "shadow-[0_0_25px_5px_rgba(255,20,147,0.4)]"
                  : "shadow-[0_0_25px_5px_rgba(255,105,180,0.4)]"
                : "shadow-none"
            } ${
              isDarkMode
                ? "hover:border-pink-500/50"
                : "hover:border-pink-300/50"
            }`}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              onMouseEnter={() => setIsHoveringClose(true)}
              onMouseLeave={() => setIsHoveringClose(false)}
              className={`absolute top-4 right-4 p-1 rounded-full transition-all duration-300 ${
                isHoveringClose ? "bg-gray-700/50" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-all duration-300 ${
                  isDarkMode
                    ? isHoveringClose
                      ? "text-red-400"
                      : "text-gray-400"
                    : isHoveringClose
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Error Message */}
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

              {/* Header */}
              <div className="text-center">
                <h2
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Welcome back
                </h2>
                <p
                  className={`mt-1 text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Sign in to your account
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:bg-gray-600/50"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:bg-gray-50"
                    } border`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:bg-gray-600/50"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:bg-gray-50"
                    } border`}
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 transition-colors duration-300 ${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className={`rounded transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-pink-500 focus:ring-pink-500 hover:border-pink-400"
                        : "border-gray-300 text-pink-500 focus:ring-pink-500 hover:border-pink-400"
                    }`}
                    checked={rememberMe}
                    onChange={handleCheckboxChange}
                  />
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    Remember me
                  </span>
                </label>
                <a href="#" className="relative group">
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode
                        ? "text-pink-400 hover:text-pink-300"
                        : "text-pink-600 hover:text-pink-500"
                    }`}
                  >
                    Forgot password?
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 ${
                      isDarkMode ? "bg-pink-400" : "bg-pink-600"
                    } transition-all duration-500 w-0 group-hover:w-full`}
                  ></span>
                </a>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setIsHoveringSubmit(true)}
                onMouseLeave={() => setIsHoveringSubmit(false)}
                className={`w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-500 ${
                  isDarkMode
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "bg-pink-600 hover:bg-pink-700 text-white"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                  isHoveringSubmit
                    ? "transform hover:scale-[1.02] shadow-md"
                    : ""
                } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
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
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`w-full border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    }`}
                  ></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span
                    className={`px-2 ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    OR
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-500 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500"
                    : "bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400"
                } border relative overflow-hidden ${
                  isDarkMode
                    ? "hover:shadow-gray-700/20"
                    : "hover:shadow-gray-400/20"
                } hover:shadow-md group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Colorful Google Logo */}
                <div className="relative mr-3">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.50277 14.3003C5.00011 12.8099 5.00011 11.1961 5.50277 9.70575V6.61481H1.51674C-0.185266 10.0056 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3003Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                Continue with Google
              </motion.button>

              {/* Register Link */}
              <div className="text-sm text-center pt-2">
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  Don't have an account?{" "}
                </span>
                <motion.button
                  onClick={() => navigate("/register")}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    className={`font-medium transition-colors duration-300 ${
                      isDarkMode
                        ? "text-pink-400 hover:text-pink-300"
                        : "text-pink-600 hover:text-pink-500"
                    }`}
                  >
                    Sign up
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 ${
                      isDarkMode ? "bg-pink-400" : "bg-pink-600"
                    } transition-all duration-500 w-0 group-hover:w-full`}
                  ></span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackForm;
