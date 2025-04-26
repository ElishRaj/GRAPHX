import React, { useState, useEffect } from "react";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";

const TooltipSettings = ({ styles, handleStyleChange, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState("Appearance");

  // Ensure default values for styles
  const defaultStyles = {
    tooltipBackground: "#1f2937",
    tooltipBorderColor: "#374151",
    tooltipFontColor: "#ffffff",
    tooltipBorderWidth: 1,
    tooltipCornerRadius: 4,
    tooltipCaretPadding: 5,
    tooltipPositionMode: "average",
    fadeInDuration: 0.5, // Default value for fadeInDuration
    fadeOutDuration: 0.5, // Default value for fadeOutDuration
    tooltipFontSize: 14, // Default font size in pixels
  };

  // Merge provided styles with defaults
  const mergedStyles = { ...defaultStyles, ...styles };

  // Dynamically update colors based on isDarkMode
  const colors = isDarkMode
    ? {
        bg: "bg-gray-900", // Dark mode background
        text: "text-gray-200", // Dark mode text
        cardBg: "bg-gray-800", // Dark mode card background
        sliderThumb: "bg-cyan-500", // Dark mode slider thumb
        dropdownBg: "bg-gray-800 text-gray-200", // Dark mode dropdown background
      }
    : {
        bg: "bg-gray-100", // Light mode background
        text: "text-gray-800", // Light mode text
        cardBg: "bg-white", // Light mode card background
        sliderThumb: "bg-indigo-400", // Light mode slider thumb
        dropdownBg: "bg-gray-100 text-gray-800", // Light mode dropdown background
      };

  const tabs = ["Appearance", "Position", "Animation"];

  const tabContent = {
    Appearance: [
      { label: "Background", key: "tooltipBackground", type: "color" },
      { label: "Border Color", key: "tooltipBorderColor", type: "color" },
      { label: "Font Color", key: "tooltipFontColor", type: "color" },
      { label: "Font Size", key: "tooltipFontSize", min: 10, max: 24 }, // Font size range
      { label: "Border Width", key: "tooltipBorderWidth", min: 0, max: 10 },
      { label: "Corner Radius", key: "tooltipCornerRadius", min: 0, max: 20 },
    ],
    Position: [
      {
        label: "Caret Padding",
        key: "tooltipCaretPadding",
        min: 0,
        max: 10,
      },
      {
        label: "Position Mode",
        key: "tooltipPositionMode",
        type: "select",
        options: ["average", "nearest"],
      },
    ],
    Animation: [
      { label: "Fade In Duration", key: "fadeInDuration", min: 0.1, max: 5 },
      { label: "Fade Out Duration", key: "fadeOutDuration", min: 0.1, max: 5 },
    ],
  };

  // Function to update the range input fill background
  const updateRangeFill = (event) => {
    const rangeInput = event.target;
    const value =
      ((rangeInput.value - rangeInput.min) /
        (rangeInput.max - rangeInput.min)) *
      100;
    rangeInput.style.background = `linear-gradient(to right, ${
      isDarkMode ? "#06b6d4" : "#6366f1"
    } ${value}%, ${isDarkMode ? "#374151" : "#e5e7eb"} ${value}%)`;
  };

  return (
    <motion.div
      className={`p-8 rounded-2xl shadow-xl transition-all duration-500 lg:w-[99%] mx-auto ${colors.bg}`}
    >
      {/* Main Heading */}
      <motion.div className="mb-6 text-center">
        <h1 className={`text-3xl font-bold tracking-wide ${colors.text}`}>
          Tooltip Settings
        </h1>
        <motion.div
          className={`h-1 w-16 mx-auto mt-2 rounded-full ${
            isDarkMode ? "bg-cyan-600" : "bg-indigo-500"
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="mb-6 flex justify-center gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? isDarkMode
                  ? "bg-cyan-600 text-white"
                  : "bg-indigo-500 text-white"
                : colors.cardBg
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        className={`p-6 rounded-lg shadow-md ${colors.cardBg}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {activeTab === "Appearance" && (
          <div className="space-y-6">
            {/* Color Inputs */}
            <div className="flex justify-between">
              {tabContent[activeTab].slice(0, 3).map(({ label, key }) => (
                <div
                  key={key}
                  className="flex flex-col items-center text-center"
                >
                  <label className={`text-sm font-medium mb-2 ${colors.text}`}>
                    {label}
                  </label>
                  <input
                    type="color"
                    value={mergedStyles[key]}
                    onChange={(e) => handleStyleChange(key, e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Sliders for Font Size, Border Width, and Corner Radius */}
            {tabContent[activeTab].slice(3).map(({ label, key, min, max }) => (
              <div key={key} className="flex flex-col items-center text-center">
                <label className={`text-sm font-medium mb-2 ${colors.text}`}>
                  {label}
                </label>
                <div className="relative w-full">
                  {/* Current Value */}
                  <span
                    className={`absolute -top-6 text-sm font-semibold ${colors.text}`}
                  >
                    {mergedStyles[key]}
                    {key === "tooltipFontSize" ? "px" : "px"}
                  </span>
                  {/* Range Input */}
                  <input
                    type="range"
                    value={mergedStyles[key]}
                    min={min}
                    max={max}
                    onChange={(e) => {
                      handleStyleChange(key, Number(e.target.value));
                      updateRangeFill(e);
                    }}
                    onInput={updateRangeFill} // Update fill on input
                    className="w-full h-2 rounded-lg cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${
                        isDarkMode ? "#06b6d4" : "#6366f1"
                      } ${((mergedStyles[key] - min) / (max - min)) * 100}%, ${
                        isDarkMode ? "#374151" : "#e5e7eb"
                      } ${((mergedStyles[key] - min) / (max - min)) * 100}%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Position" && (
          <div className="grid grid-cols-1 gap-6">
            {tabContent[activeTab].map(
              ({ label, key, type, min, max, options }) => (
                <div
                  key={key}
                  className="flex flex-col items-center text-center"
                >
                  <label className={`text-sm font-medium mb-2 ${colors.text}`}>
                    {label}
                  </label>
                  {type === "select" && (
                    <select
                      value={mergedStyles[key]}
                      onChange={(e) => handleStyleChange(key, e.target.value)}
                      className={`w-full p-2 rounded-lg ${colors.dropdownBg}`}
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {!type && (
                    <div className="relative w-full">
                      <span
                        className={`absolute -top-6 text-sm font-semibold ${colors.text}`}
                      >
                        {mergedStyles[key]}px
                      </span>
                      <input
                        type="range"
                        value={mergedStyles[key]}
                        min={min}
                        max={max}
                        onChange={(e) => {
                          handleStyleChange(key, Number(e.target.value));
                          updateRangeFill(e);
                        }}
                        onInput={updateRangeFill} // Update fill on input
                        className="w-full h-2 rounded-lg cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${
                            isDarkMode ? "#06b6d4" : "#6366f1"
                          } ${
                            ((mergedStyles[key] - min) / (max - min)) * 100
                          }%, ${isDarkMode ? "#374151" : "#e5e7eb"} ${
                            ((mergedStyles[key] - min) / (max - min)) * 100
                          }%)`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {activeTab === "Animation" && (
          <div className="grid grid-cols-1 gap-6">
            {tabContent[activeTab].map(({ label, key, min, max }) => (
              <div key={key} className="flex flex-col items-center text-center">
                <label className={`text-sm font-medium mb-2 ${colors.text}`}>
                  {label}
                </label>
                <div className="relative w-full">
                  {/* Current Value */}
                  <span
                    className={`absolute -top-6 text-sm font-semibold ${colors.text}`}
                  >
                    {mergedStyles[key]}s
                  </span>
                  {/* Range Input */}
                  <input
                    type="range"
                    value={mergedStyles[key]}
                    min={min}
                    max={max}
                    onChange={(e) => {
                      handleStyleChange(key, Number(e.target.value));
                      updateRangeFill(e);
                    }}
                    onInput={updateRangeFill} // Update fill on input
                    className="w-full h-2 rounded-lg cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${
                        isDarkMode ? "#06b6d4" : "#6366f1"
                      } ${((mergedStyles[key] - min) / (max - min)) * 100}%, ${
                        isDarkMode ? "#374151" : "#e5e7eb"
                      } ${((mergedStyles[key] - min) / (max - min)) * 100}%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TooltipSettings;
