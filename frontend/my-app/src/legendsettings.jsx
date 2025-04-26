import React, { useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const LegendSettings = ({ styles, handleStyleChange, isDarkMode }) => {
  const defaultStyles = {
    legendPadding: 8,
    legendFontSize: 12,
    legendFontColor: "#3B82F6",
  };

  const theme = isDarkMode
    ? {
        bg: "bg-gray-900",
        cardBg: "bg-gray-800",
        text: "text-gray-100",
        border: "border-gray-700",
        hover: "hover:bg-gray-700",
        active: "bg-gray-700",
        slider: "from-blue-400 to-purple-500",
      }
    : {
        bg: "bg-gray-50",
        cardBg: "bg-white",
        text: "text-gray-800",
        border: "border-gray-200",
        hover: "hover:bg-gray-50",
        active: "bg-gray-100",
        slider: "from-blue-500 to-purple-600",
      };

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    });
  }, []);

  // Custom SVG elements
  const ArrowsIcon = () => (
    <span className="text-2xl" style={{ transform: "rotate(45deg)" }}>
      ↔
    </span>
  );

  const FontColorIcon = () => (
    <div className="relative flex items-center justify-center w-6 h-6">
      <span className="text-xl font-bold">A</span>
      <div className="absolute bottom-0 w-full h-1 bg-current rounded-full" />
    </div>
  );

  // Position options with unique keys
  const positionOptions = [
    { id: "pos-top", value: "top", label: "Top" },
    { id: "pos-right", value: "right", label: "Right" },
    { id: "pos-bottom", value: "bottom", label: "Bottom" },
    { id: "pos-left", value: "left", label: "Left" },
  ];

  // Size controls with unique keys
  const sizeControls = [
    {
      id: "size-padding",
      label: "Padding",
      prop: "legendPadding",
      min: 0,
      max: 20,
      step: 1,
    },
    {
      id: "size-font",
      label: "Font Size",
      prop: "legendFontSize",
      min: 8,
      max: 24,
      step: 1,
    },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={controls}
      className={`p-6 rounded-2xl shadow-xl ${theme.cardBg} ${theme.border} border transition-colors duration-300`}
    >
      <AnimatePresence>
        {/* Header */}
        <motion.div
          key="header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center mb-8"
        >
          <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>
            Legend Settings
          </h2>
          <motion.div
            key="header-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        </motion.div>

        {/* Toggle Section - Advanced Bar Design */}
        <motion.div
          key="toggle-section"
          className={`p-4 rounded-xl ${theme.border} border mb-6`}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-semibold ${theme.text}`}>
                Legend Visibility
              </h3>
              <p className={`text-sm ${theme.text} opacity-70`}>
                Toggle the legend display
              </p>
            </div>
            <div
              className={`relative w-20 h-10 rounded-full p-1 cursor-pointer transition-colors ${
                styles.legendDisplay
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : `${theme.bg} ${theme.border} border`
              }`}
              onClick={() =>
                handleStyleChange("legendDisplay", !styles.legendDisplay)
              }
            >
              <motion.div
                className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-lg`}
                animate={{ x: styles.legendDisplay ? "2.5rem" : "0.25rem" }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <span
                className={`absolute top-2 left-2 text-xs font-medium ${
                  styles.legendDisplay ? "text-white" : theme.text
                }`}
              >
                {styles.legendDisplay ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </motion.div>

        {styles.legendDisplay && (
          <motion.div
            key="settings-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-8"
          >
            {/* Position Selector */}
            <motion.div
              key="position-selector"
              className={`p-4 rounded-xl ${theme.border} border`}
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <ArrowsIcon />
                <h3 className={`font-semibold ${theme.text}`}>Position</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {positionOptions.map(({ id, value, label }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                      styles.legendPosition === value
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                        : `${theme.hover} ${theme.text} hover:shadow-md`
                    }`}
                    onClick={() => handleStyleChange("legendPosition", value)}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Color Picker */}
            <motion.div
              key="color-picker"
              className={`p-4 rounded-xl ${theme.border} border`}
              initial={{ x: -10 }}
              animate={{ x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <FontColorIcon />
                <h3 className={`font-semibold ${theme.text}`}>Font Color</h3>
              </div>
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                >
                  <input
                    type="color"
                    value={
                      styles.legendFontColor || defaultStyles.legendFontColor
                    }
                    onChange={(e) =>
                      handleStyleChange("legendFontColor", e.target.value)
                    }
                    className="w-12 h-12 rounded-xl border-2 cursor-pointer opacity-0 absolute"
                  />
                  <div
                    className="w-12 h-12 rounded-xl border-2 shadow-md"
                    style={{ backgroundColor: styles.legendFontColor }}
                  />
                  <div className="absolute inset-0 border-2 border-white/30 rounded-xl pointer-events-none" />
                </motion.div>
                <div className="flex-1">
                  <p className={`text-xs font-mono ${theme.text} opacity-70`}>
                    {styles.legendFontColor}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Size Controls */}
            <motion.div
              key="size-controls"
              className={`p-4 rounded-xl ${theme.border} border`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className={`font-semibold ${theme.text} mb-6`}>
                Size Controls
              </h3>
              <div className="space-y-6">
                {sizeControls.map(({ id, label, prop, min, max, step }) => (
                  <div key={id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`${theme.text}`}>
                        <span className="text-sm font-medium">{label}</span>
                      </span>
                      <span className={`text-sm font-mono ${theme.text}`}>
                        {styles[prop] || defaultStyles[prop]}px
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={Number(styles[prop] || defaultStyles[prop])}
                        onChange={(e) =>
                          handleStyleChange(prop, Number(e.target.value))
                        }
                        className={`w-full h-2 bg-gradient-to-r ${theme.slider} rounded-full appearance-none cursor-pointer`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LegendSettings;
