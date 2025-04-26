import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const GridSettings = ({ styles, handleStyleChange, isDarkMode, premier }) => {
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const colors = isDarkMode
    ? {
        bg: "bg-gray-900",
        text: "text-gray-200",
        cardBg: "bg-gray-800",
        toggleTrack: "bg-gray-700 peer-checked:bg-cyan-800",
        togglePointer: "bg-gray-500 peer-checked:bg-green-500",
        sliderBar: "bg-gradient-to-r from-cyan-700 to-cyan-500",
        sliderPointer: "bg-gray-400 peer-checked:bg-green-500",
        gradientStart: "#0891B2",
        gradientEnd: "#065F46",
      }
    : {
        bg: "bg-gray-100",
        text: "text-gray-800",
        cardBg: "bg-white",
        toggleTrack: "bg-gray-300 peer-checked:bg-[#374151]",
        togglePointer: "bg-gray-200 peer-checked:bg-gray-300",
        darkerText: "text-gray-700",
        sliderBar: "bg-gradient-to-r from-gray-300 to-gray-500",
        sliderPointer: "bg-gray-200 peer-checked:bg-gray-300",
        gradientStart: "#374151",
        gradientEnd: "#10B981",
      };

  // Helper function to convert hex to RGBA
  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Function to calculate the gradient based on the current value
  const getGradient = (value, min, max) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, ${colors.gradientStart} 0%, ${colors.gradientStart} ${percentage}%, ${colors.gradientEnd} ${percentage}%, ${colors.gradientEnd} 100%)`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        duration: 0.2,
      },
    },
  };

  const toggleVariants = {
    off: { x: 0 },
    on: { x: "calc(149%)" },
  };

  const cardVariants = {
    hidden: { scale: 0.98, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.25,
      },
    },
  };

  // Popup animations
  const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      backdropFilter: "blur(0px)",
      backgroundColor: "rgba(0,0,0,0)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      backdropFilter: "blur(10px)",
      backgroundColor: isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        backgroundColor: { duration: 0.3 },
        backdropFilter: { duration: 0.4 },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      backdropFilter: "blur(0px)",
      backgroundColor: "rgba(0,0,0,0)",
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const popupContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15,
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.15,
      },
    },
  };

  const buttonHoverEffect = {
    scale: 1.03,
    boxShadow: isDarkMode
      ? "0 10px 25px -5px rgba(8, 145, 178, 0.4), 0 10px 10px -5px rgba(6, 95, 70, 0.3)"
      : "0 10px 25px -5px rgba(55, 65, 81, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.3)",
  };

  const buttonTapEffect = {
    scale: 0.97,
    boxShadow: isDarkMode
      ? "0 5px 15px -3px rgba(8, 145, 178, 0.3), 0 4px 6px -2px rgba(6, 95, 70, 0.2)"
      : "0 5px 15px -3px rgba(55, 65, 81, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.2)",
  };

  // Smooth transition for slider pointer and background
  const sliderTransition = {
    type: "spring",
    stiffness: 300,
    damping: 20,
    duration: 0.2,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`p-6 rounded-2xl shadow-lg lg:w-[100%] ${colors.bg}`}
    >
      {/* Main Heading */}
      <motion.div variants={itemVariants} className="mb-6 text-center">
        <h1 className={`text-2xl font-bold tracking-wide ${colors.text}`}>
          Grid Settings
        </h1>
        <motion.div
          className={`h-1 w-16 mx-auto mt-2 rounded-full ${
            isDarkMode ? "bg-cyan-600" : "bg-[#374151]"
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={sliderTransition}
        />
      </motion.div>

      {premier ? (
        <>
          <div className="grid gap-2 lg:grid-cols-2">
            {/* Show Section */}
            <motion.div
              variants={cardVariants}
              className={`p-4 rounded-lg shadow-md ${colors.cardBg}`}
            >
              <h2 className={`text-lg font-medium mb-3 ${colors.text}`}>
                Show
              </h2>
              <div className="space-y-3">
                {/* X-Grid Toggle */}
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${colors.text}`}>
                    X-Grid
                  </label>
                  <div className="relative inline-flex items-center w-20 h-9">
                    <input
                      type="checkbox"
                      checked={styles.showGridX}
                      onChange={(e) =>
                        handleStyleChange("showGridX", e.target.checked)
                      }
                      className="sr-only peer"
                      id="toggleX"
                    />
                    <label
                      htmlFor="toggleX"
                      className={`block w-full h-full rounded-lg ${colors.toggleTrack} transition-all duration-200`}
                    />
                    <motion.div
                      className={`absolute left-1 top-1 h-7 w-7 rounded-md flex items-center justify-center text-[10px] font-bold ${colors.togglePointer}`}
                      variants={toggleVariants}
                      animate={styles.showGridX ? "on" : "off"}
                      transition={sliderTransition}
                    >
                      <span
                        className={`${
                          styles.showGridX
                            ? "text-white"
                            : isDarkMode
                            ? "text-gray-300"
                            : colors.darkerText
                        }`}
                      >
                        {styles.showGridX ? "ON" : "OFF"}
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Y-Grid Toggle */}
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${colors.text}`}>
                    Y-Grid
                  </label>
                  <div className="relative inline-flex items-center w-20 h-9">
                    <input
                      type="checkbox"
                      checked={styles.showGridY}
                      onChange={(e) =>
                        handleStyleChange("showGridY", e.target.checked)
                      }
                      className="sr-only peer"
                      id="toggleY"
                    />
                    <label
                      htmlFor="toggleY"
                      className={`block w-full h-full rounded-lg ${colors.toggleTrack} transition-all duration-200`}
                    />
                    <motion.div
                      className={`absolute left-1 top-1 h-7 w-7 rounded-md flex items-center justify-center text-[10px] font-bold ${colors.togglePointer}`}
                      variants={toggleVariants}
                      animate={styles.showGridY ? "on" : "off"}
                      transition={sliderTransition}
                    >
                      <span
                        className={`${
                          styles.showGridY
                            ? "text-white"
                            : isDarkMode
                            ? "text-gray-300"
                            : colors.darkerText
                        }`}
                      >
                        {styles.showGridY ? "ON" : "OFF"}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Appearance Section */}
            <motion.div
              variants={cardVariants}
              className={`p-4 rounded-lg shadow-md ${colors.cardBg} lg:ml-6`}
              transition={{ delay: 0.05 }}
            >
              <h2 className={`text-lg font-medium mb-3 ${colors.text}`}>
                Appearance
              </h2>
              <div>
                <label className={`text-sm font-medium ${colors.text}`}>
                  Grid Color
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <motion.input
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="color"
                    value={styles.gridColor}
                    onChange={(e) =>
                      handleStyleChange("gridColor", e.target.value)
                    }
                    className={`w-12 h-12 rounded-lg cursor-pointer`}
                  />
                  <span className={`text-sm font-semibold ${colors.text}`}>
                    {styles.gridColor}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Settings Section */}
          <motion.div
            className={`p-4 rounded-lg shadow-md ${colors.cardBg} mt-6`}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.1,
                  type: "spring",
                  stiffness: 200,
                  duration: 0.25,
                },
              },
            }}
          >
            <h2 className={`text-lg font-medium mb-3 ${colors.text}`}>
              Settings
            </h2>
            {[
              {
                label: "Line Width",
                key: "gridLineWidth",
                min: 1,
                max: 10,
                unit: "px",
              },
              {
                label: "Opacity",
                key: "gridOpacity",
                min: 0.1,
                max: 1.0,
                step: 0.1,
                unit: "",
              },
            ].map((setting, index) => (
              <div key={setting.key} className="mb-5">
                <label className={`text-sm font-medium ${colors.text}`}>
                  {setting.label}
                </label>
                <div className="relative w-full h-3 mt-2">
                  {/* Background Gradient */}
                  <div
                    className={`absolute top-0 left-0 w-full h-full rounded-lg`}
                    style={{
                      background: getGradient(
                        styles[setting.key],
                        setting.min,
                        setting.max
                      ),
                    }}
                  />
                  {/* Slider Pointer */}
                  <motion.div
                    className={`absolute -top-2 h-6 w-4 rounded-t-md rounded-b-md ${colors.sliderPointer}`}
                    style={{
                      left: `${
                        ((styles[setting.key] - setting.min) /
                          (setting.max - setting.min)) *
                        100
                      }%`,
                    }}
                    layout
                    transition={sliderTransition}
                  />
                  {/* Range Input */}
                  <input
                    type="range"
                    min={setting.min}
                    max={setting.max}
                    step={setting.step || 1}
                    value={styles[setting.key]}
                    onChange={(e) =>
                      handleStyleChange(setting.key, e.target.value)
                    }
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span
                  className={`block text-xs mt-1 font-semibold ${colors.text}`}
                >
                  {`${styles[setting.key] || setting.min}${setting.unit}`}
                </span>
              </div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          variants={cardVariants}
          className={`p-6 rounded-lg shadow-md ${colors.cardBg} text-center`}
        >
          <div className="mb-4">
            <div className="relative inline-flex">
              <div
                className={`absolute inset-0 rounded-full ${
                  isDarkMode ? "bg-cyan-600/20" : "bg-gray-700/20"
                } blur-md`}
              ></div>
              <svg
                className={`relative w-16 h-16 mx-auto ${
                  isDarkMode ? "text-cyan-400" : "text-gray-700"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>
            Premium Feature
          </h3>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            This feature is available in our premium plan. Upgrade now to unlock
            all exclusive features!
          </p>
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: isDarkMode
                ? "0 8px 20px -5px rgba(8, 145, 178, 0.4)"
                : "0 8px 20px -5px rgba(55, 65, 81, 0.4)",
            }}
            whileTap={{
              scale: 0.97,
              boxShadow: isDarkMode
                ? "0 4px 10px -3px rgba(8, 145, 178, 0.3)"
                : "0 4px 10px -3px rgba(55, 65, 81, 0.3)",
            }}
            onClick={() => setShowUpgradePopup(true)}
            className={`px-6 py-2.5 rounded-lg font-medium relative overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-cyan-600 to-green-600 text-white"
                : "bg-gradient-to-br from-gray-700 to-green-600 text-white"
            } shadow-md`}
          >
            <span className="relative z-10">Upgrade Now</span>
            <span
              className={`absolute inset-0 bg-gradient-to-br ${
                isDarkMode
                  ? "from-cyan-700 to-green-700"
                  : "from-gray-800 to-green-700"
              } opacity-0 hover:opacity-100 transition-opacity`}
            ></span>
          </motion.button>
        </motion.div>
      )}

      {/* Upgrade Popup */}
      <AnimatePresence>
        {showUpgradePopup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowUpgradePopup(false)}
          >
            <motion.div
              variants={popupContentVariants}
              className={`relative max-w-md w-full rounded-2xl p-8 ${
                isDarkMode ? "bg-gray-800/80" : "bg-white/80"
              } backdrop-blur-lg border ${
                isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
              } shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: isDarkMode
                  ? "0 8px 32px 0 rgba(0, 0, 0, 0.36)"
                  : "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
              }}
            >
              <motion.button
                onClick={() => setShowUpgradePopup(false)}
                className={`absolute top-5 right-5 p-1.5 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-200/50"
                } transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              <div className="text-center">
                <div className="mb-6">
                  <div className="relative inline-flex">
                    <div
                      className={`absolute inset-0 rounded-full ${
                        isDarkMode ? "bg-cyan-600/20" : "bg-gray-700/20"
                      } blur-md`}
                    ></div>
                    <svg
                      className={`relative w-20 h-20 mx-auto ${
                        isDarkMode ? "text-cyan-400" : "text-gray-700"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className={`text-2xl font-bold mb-3 ${colors.text}`}>
                  Unlock Premium Features
                </h3>
                <p
                  className={`mb-6 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Upgrade to access advanced grid settings and exclusive
                  features.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {[
                    "Advanced grid customization",
                    "Priority support",
                    "Exclusive templates",
                    "Early access to new features",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                      } backdrop-blur-sm`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <motion.div
                        className="flex-shrink-0 mr-3"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                      <span className={`text-left ${colors.text}`}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    hover: buttonHoverEffect,
                    tap: buttonTapEffect,
                  }}
                  className="w-full"
                >
                  <Link
                    to="/prices"
                    className={`block w-full px-6 py-3.5 rounded-xl font-bold text-center ${
                      isDarkMode ? "text-white" : "text-white"
                    } relative overflow-hidden transition-all duration-300`}
                  >
                    <span
                      className={`absolute inset-0 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-cyan-600 to-green-600"
                          : "bg-gradient-to-br from-gray-700 to-green-600"
                      } opacity-100 group-hover:opacity-90 transition-opacity`}
                    ></span>
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>View Pricing Plans</span>
                      <motion.span
                        initial={{ x: 0 }}
                        animate={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </motion.span>
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GridSettings;