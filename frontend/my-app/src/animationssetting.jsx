import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiSpinningBlades, GiSandsOfTime, GiChoice } from "react-icons/gi";

const AnimationSettings = ({ styles, handleStyleChange, isDarkMode }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 150, damping: 12 },
    },
  };

  const themeClasses = {
    text: isDarkMode ? "text-gray-200" : "text-gray-800",
    border: isDarkMode ? "border-gray-700" : "border-gray-300",
    accent: isDarkMode
      ? "bg-gradient-to-r from-indigo-700 to-purple-800"
      : "bg-gradient-to-r from-indigo-500 to-purple-600",
    toggleHandle: isDarkMode ? "bg-indigo-400" : "bg-indigo-200",
    icon: isDarkMode ? "text-indigo-400" : "text-indigo-600",
    background: isDarkMode ? "bg-gray-800" : "bg-white",
  };

  const handleToggleAnimation = () => {
    handleStyleChange("animationsEnabled", !styles.animationsEnabled);
  };

  const handleDurationChange = (e) => {
    handleStyleChange("animationDuration", parseFloat(e.target.value));
  };

  const handleTypeChange = (type) => {
    handleStyleChange("animationType", type);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`p-6 rounded-xl shadow-lg ${themeClasses.background} ${themeClasses.border} border`}
    >
      <motion.h2
        className="text-2xl font-bold mb-6 flex items-center gap-3"
        variants={itemVariants}
      >
        <GiSpinningBlades className={`text-2xl ${themeClasses.icon}`} />
        <span className={themeClasses.text}>Animation Settings</span>
      </motion.h2>

      <motion.div className="space-y-6" variants={containerVariants}>
        {/* Enable/Disable Toggle */}
        <motion.div
          className="flex items-center justify-between p-4 rounded-lg bg-opacity-10"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <GiChoice className={`text-xl ${themeClasses.icon}`} />
            <span className={`font-medium ${themeClasses.text}`}>
              Enable Animations
            </span>
          </div>
          <div
            className={`relative w-16 h-8 rounded-full cursor-pointer ${themeClasses.accent}`}
            onClick={handleToggleAnimation}
          >
            <motion.div
              className={`absolute top-1 w-6 h-6 rounded-full shadow-md ${themeClasses.toggleHandle}`}
              animate={{ x: styles.animationsEnabled ? "2rem" : "0.25rem" }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {styles.animationsEnabled && (
            <>
              {/* Duration Control */}
              <motion.div
                key="duration"
                variants={itemVariants}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border ${themeClasses.border}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <GiSandsOfTime className={`text-xl ${themeClasses.icon}`} />
                  <span className={`font-medium ${themeClasses.text}`}>
                    Animation Duration
                  </span>
                </div>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={styles.animationDuration}
                    onChange={handleDurationChange}
                    className={`w-full h-2 rounded-full ${themeClasses.accent}`}
                  />
                  <div className="flex justify-between text-sm">
                    <span className={themeClasses.text}>Speed</span>
                    <span className={`font-mono ${themeClasses.text}`}>
                      {styles.animationDuration}s
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Animation Type Selector */}
              <motion.div
                key="type"
                variants={itemVariants}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border ${themeClasses.border}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <GiSpinningBlades
                    className={`text-xl ${themeClasses.icon}`}
                  />
                  <span className={`font-medium ${themeClasses.text}`}>
                    Animation Style
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "easeInOutQuad",
                    "linear",
                    "easeInCubic",
                    "easeOutCubic",
                  ].map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTypeChange(type)}
                      className={`p-3 rounded-md text-sm font-medium transition-colors ${
                        styles.animationType === type
                          ? `${themeClasses.accent} text-white`
                          : `${themeClasses.border} border ${themeClasses.text} hover:bg-opacity-10`
                      }`}
                    >
                      {type
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace("ease ", "Ease ")}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AnimationSettings;
