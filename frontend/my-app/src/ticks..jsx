import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TicksSettings = ({ styles, handleStyleChange, isDarkMode }) => {
  const defaultStyles = {
    xTicksColor: "#FF0000",
    yTicksColor: "#0000FF",
    ticksFontSize: 12,
    ticksFontFamily: "Arial, sans-serif",
    ticksFontStyle: "normal",
  };

  const [sliderValue, setSliderValue] = useState(
    styles.ticksFontSize || defaultStyles.ticksFontSize
  );

  useEffect(() => {
    setSliderValue(styles.ticksFontSize || defaultStyles.ticksFontSize);
  }, [styles.ticksFontSize]);

  const theme = isDarkMode
    ? {
        bg: "bg-gray-900",
        cardBg: "bg-gray-800",
        text: "text-gray-100",
        border: "border-gray-700",
        inputBg: "bg-gray-700",
        buttonBg: "bg-teal-600 hover:bg-teal-700",
        underline: "bg-purple-400",
        rangeTrack: "bg-gray-600",
        rangeThumb: "#10B981",
        rangeProgress: "#34D399",
      }
    : {
        bg: "bg-gray-50",
        cardBg: "bg-white",
        text: "text-gray-800",
        border: "border-gray-200",
        inputBg: "bg-gray-100",
        buttonBg: "bg-teal-500 hover:bg-teal-600",
        underline: "bg-indigo-500",
        rangeTrack: "bg-gray-300",
        rangeThumb: "#10B981",
        rangeProgress: "#34D399",
      };

  const containerVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { y: 50, opacity: 0 },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const headingVariants = {
    hidden: {
      y: -20,
      opacity: 0,
      rotate: -2,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
  };

  const underlineVariants = {
    hidden: {
      width: 0,
      opacity: 0,
    },
    visible: {
      width: "60%",
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      width: "70%",
      transition: { duration: 0.3 },
    },
    tap: {
      width: "50%",
      transition: { duration: 0.2 },
    },
  };

  const handleReset = () => {
    Object.entries(defaultStyles).forEach(([key, value]) => {
      handleStyleChange(key, value);
    });
  };

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);
    handleStyleChange("ticksFontSize", value);
  };

  const progressPercentage = ((sliderValue - 8) / 16) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className={`w-full max-w-md p-6 rounded-xl shadow-lg ${theme.cardBg} ${theme.border} border`}
      >
        <motion.div className="flex flex-col items-center mb-8">
          <motion.h2
            variants={headingVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`text-2xl font-bold ${theme.text} mb-3 text-center relative`}
          >
            Ticks Appearance
            <motion.div
              variants={underlineVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              className={`h-1 ${theme.underline} rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 origin-center`}
              style={{
                height: "2px",
              }}
            />
          </motion.h2>
        </motion.div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <h3
              className={`text-sm font-semibold ${theme.text} uppercase tracking-wider`}
            >
              Colors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm ${theme.text} mb-1`}>
                  X Axis
                </label>
                <div className="flex items-center space-x-2">
                  <motion.input
                    type="color"
                    value={styles.xTicksColor || defaultStyles.xTicksColor}
                    onChange={(e) =>
                      handleStyleChange("xTicksColor", e.target.value)
                    }
                    className="w-8 h-8 rounded cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <span className={`text-xs ${theme.text}`}>
                    {styles.xTicksColor || defaultStyles.xTicksColor}
                  </span>
                </div>
              </div>

              <div>
                <label className={`block text-sm ${theme.text} mb-1`}>
                  Y Axis
                </label>
                <div className="flex items-center space-x-2">
                  <motion.input
                    type="color"
                    value={styles.yTicksColor || defaultStyles.yTicksColor}
                    onChange={(e) =>
                      handleStyleChange("yTicksColor", e.target.value)
                    }
                    className="w-8 h-8 rounded cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <span className={`text-xs ${theme.text}`}>
                    {styles.yTicksColor || defaultStyles.yTicksColor}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3
              className={`text-sm font-semibold ${theme.text} uppercase tracking-wider`}
            >
              Font
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm ${theme.text} mb-1`}>
                  Size
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-full h-8 flex items-center">
                    <div
                      className={`absolute h-2 w-full rounded-full ${theme.rangeTrack}`}
                    ></div>
                    <div
                      className="absolute h-2 rounded-full"
                      style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: theme.rangeProgress,
                      }}
                    ></div>
                    <div
                      className="absolute h-4 w-4 rounded-full transform -translate-x-1/2 z-10"
                      style={{
                        left: `${progressPercentage}%`,
                        backgroundColor: theme.rangeThumb,
                      }}
                    ></div>
                    <input
                      type="range"
                      min="8"
                      max="24"
                      value={sliderValue}
                      onChange={handleSliderChange}
                      className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                    />
                  </div>
                  <span className={`text-xs w-10 text-center ${theme.text}`}>
                    {sliderValue}px
                  </span>
                </div>
              </div>

              <div>
                <label className={`block text-sm ${theme.text} mb-1`}>
                  Family
                </label>
                <motion.select
                  value={
                    styles.ticksFontFamily || defaultStyles.ticksFontFamily
                  }
                  onChange={(e) =>
                    handleStyleChange("ticksFontFamily", e.target.value)
                  }
                  className={`w-full p-2 text-sm rounded-lg ${theme.inputBg} ${theme.text} ${theme.border} border`}
                  whileHover={{ scale: 1.01 }}
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="Times New Roman, serif">
                    Times New Roman
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Courier New, monospace">Courier New</option>
                </motion.select>
              </div>

              <div>
                <label className={`block text-sm ${theme.text} mb-1`}>
                  Style
                </label>
                <motion.select
                  value={styles.ticksFontStyle || defaultStyles.ticksFontStyle}
                  onChange={(e) =>
                    handleStyleChange("ticksFontStyle", e.target.value)
                  }
                  className={`w-full p-2 text-sm rounded-lg ${theme.inputBg} ${theme.text} ${theme.border} border`}
                  whileHover={{ scale: 1.01 }}
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                  <option value="bold">Bold</option>
                </motion.select>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              onClick={handleReset}
              className={`w-full py-2 px-4 rounded-lg text-white ${theme.buttonBg} transition-colors`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset to Defaults
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TicksSettings;
