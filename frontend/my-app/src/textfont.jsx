/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const TextSettings = ({ styles, handleStyleChange, isDarkMode, premier }) => {
  const [activeTab, setActiveTab] = useState("title");
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  // Configuration constants
  const fontOptions = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Trebuchet MS",
  ];

  const fontStyles = [
    {
      label: "Regular",
      value: "regular",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    { label: "Bold", value: "bold", fontWeight: "bold", fontStyle: "normal" },
    {
      label: "Italic",
      value: "italic",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      label: "Bold Italic",
      value: "boldItalic",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ];

  const tabs = [
    { id: "title", label: "Chart Title" },
    { id: "xlab", label: "Horizontal Axis" },
    { id: "ylab", label: "Vertical Axis" },
  ];

  // Style handlers
  const handleColorChange = (property, value) => {
    handleStyleChange(`textStyles.${activeTab}.${property}`, value);
  };

  const handleFontProperty = (property, value) => {
    handleStyleChange(`textStyles.${activeTab}.${property}`, value);
  };

  const isValidHex = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

  // Animation variants
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

  return (
    <motion.div
      className={`p-6 rounded-xl shadow-lg ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Heading with Center Alignment and Underline Animation */}
      <div className="mb-6 text-center">
        <h3
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Text Customization
        </h3>
        <motion.div
          className={`h-1 w-16 mx-auto mt-2 rounded-full ${
            isDarkMode ? "bg-cyan-600" : "bg-[#374151]"
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {premier ? (
        <>
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            {/* Color Picker */}
            <div className="space-y-2">
              <label
                className={`block text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Font Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.textStyles[activeTab]?.fontColor || "#000000"}
                  onChange={(e) => handleColorChange("fontColor", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={styles.textStyles[activeTab]?.fontColor || "#000000"}
                  onChange={(e) => {
                    if (isValidHex(e.target.value)) {
                      handleColorChange("fontColor", e.target.value);
                    }
                  }}
                  className={`w-32 p-2 rounded border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label
                className={`block text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Font Size
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={styles.textStyles[activeTab]?.fontSize || 14}
                  onChange={(e) =>
                    handleFontProperty("fontSize", parseInt(e.target.value))
                  }
                  className={`w-full h-2 rounded-lg ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                />
                <span
                  className={`w-12 text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {styles.textStyles[activeTab]?.fontSize || 14}px
                </span>
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <label
                className={`block text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Font Family
              </label>
              <select
                value={styles.textStyles[activeTab]?.fontFamily || "Arial"}
                onChange={(e) => handleFontProperty("fontFamily", e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {fontOptions.map((font) => (
                  <option
                    key={font}
                    value={font}
                    style={{ fontFamily: font }}
                    className={isDarkMode ? "bg-gray-800" : ""}
                  >
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Style */}
            <div className="space-y-2">
              <label
                className={`block text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Font Style
              </label>
              <select
                value={
                  fontStyles.find(
                    (style) =>
                      style.fontWeight ===
                        (styles.textStyles[activeTab]?.fontWeight || "normal") &&
                      style.fontStyle ===
                        (styles.textStyles[activeTab]?.fontStyle || "normal")
                  )?.value || "regular"
                }
                onChange={(e) => {
                  const selected = fontStyles.find(
                    (style) => style.value === e.target.value
                  );
                  handleFontProperty("fontWeight", selected?.fontWeight);
                  handleFontProperty("fontStyle", selected?.fontStyle);
                }}
                className={`w-full p-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {fontStyles.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : (
        <motion.div
          className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          } text-center`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Premium Feature
          </h3>
          <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
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

                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Unlock Premium Features
                </h3>
                <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Upgrade to access advanced text customization and exclusive
                  features.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {[
                    "Advanced text customization",
                    "More font options",
                    "Priority support",
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
                      <span className={`text-left ${isDarkMode ? "text-white" : "text-gray-800"}`}>
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

export default TextSettings;