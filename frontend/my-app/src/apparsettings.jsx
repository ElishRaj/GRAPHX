import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GeneralSettings = ({
  styles,
  handleStyleChange,
  isDarkMode,
  generateRandomColors,
}) => {
  const borderDashOptions = [
    { label: "Solid", value: "solid", array: [] },
    { label: "Dashed", value: "dashed", array: [5, 5] },
    { label: "Dotted", value: "dotted", array: [2, 2] },
    { label: "DashDot", value: "dashdot", array: [5, 3, 2, 3] },
  ];

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl p-1 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
    >
      <div className="flex items-center justify-between p-3">
        <h3
          className={`text-lg font-medium ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Chart Styling
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
          }`}
          aria-label={isExpanded ? "Collapse settings" : "Expand settings"}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 p-2">
              {/* Color Generator */}
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-white shadow-sm"
                }`}
              >
                <div className="flex flex-col space-y-3">
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Color Scheme
                  </span>
                  <button
                    onClick={() => generateRandomColors("individual")}
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                      isDarkMode
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Randomize Colors</span>
                  </button>
                </div>
              </div>

              {/* Style Controls */}
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-white shadow-sm"
                }`}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className={`block text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Border Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {borderDashOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleStyleChange("borderDash", option.array)
                          }
                          className={`py-2 text-xs rounded-md transition-all ${
                            JSON.stringify(styles.borderDash) ===
                            JSON.stringify(option.array)
                              ? isDarkMode
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-500 text-white"
                              : isDarkMode
                              ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`block text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStyleChange("mainAxis", "x")}
                        className={`py-2 text-xs rounded-md transition-all ${
                          styles.mainAxis === "x"
                            ? isDarkMode
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-500 text-white"
                            : isDarkMode
                            ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Vertical
                      </button>
                      <button
                        onClick={() => handleStyleChange("mainAxis", "y")}
                        className={`py-2 text-xs rounded-md transition-all ${
                          styles.mainAxis === "y"
                            ? isDarkMode
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-500 text-white"
                            : isDarkMode
                            ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Horizontal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChartSettings = ({
  styles,
  handleStyleChange,
  isDarkMode,
  chartType,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3
          className={`text-xl font-semibold ${
            isDarkMode ? "text-yellow-400" : "text-gray-800"
          }`}
        >
          Chart Options
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className={`w-5 h-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-xl p-4 ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Border Width
                  </label>
                  <span
                    className={`text-xs font-mono ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {styles.borderWidth}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={styles.borderWidth}
                  onChange={(e) =>
                    handleStyleChange("borderWidth", e.target.value)
                  }
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(to right, #8B5CF6 ${
                          styles.borderWidth * 10
                        }%, #4B5563 ${styles.borderWidth * 10}%)`
                      : `linear-gradient(to right, #4F46E5 ${
                          styles.borderWidth * 10
                        }%, #E5E7EB ${styles.borderWidth * 10}%)`,
                  }}
                />
              </motion.div>

              {chartType === "bar" && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-xl p-4 ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Bar Width
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {styles.barWidth}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={styles.barWidth}
                    onChange={(e) =>
                      handleStyleChange("barWidth", e.target.value)
                    }
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}
                    style={{
                      background: isDarkMode
                        ? `linear-gradient(to right, #10B981 ${styles.barWidth}%, #4B5563 ${styles.barWidth}%)`
                        : `linear-gradient(to right, #10B981 ${styles.barWidth}%, #E5E7EB ${styles.barWidth}%)`,
                    }}
                  />
                </motion.div>
              )}

              {chartType === "line" && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-xl p-4 ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Line Tension
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {styles.tension}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={styles.tension}
                    onChange={(e) =>
                      handleStyleChange("tension", e.target.value)
                    }
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}
                    style={{
                      background: isDarkMode
                        ? `linear-gradient(to right, #EF4444 ${
                            styles.tension * 100
                          }%, #4B5563 ${styles.tension * 100}%)`
                        : `linear-gradient(to right, #EF4444 ${
                            styles.tension * 100
                          }%, #E5E7EB ${styles.tension * 100}%)`,
                    }}
                  />
                </motion.div>
              )}

              {(chartType === "line" || chartType === "scatter") && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-xl p-4 ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Point Radius
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {styles.pointRadius}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={styles.pointRadius}
                    onChange={(e) =>
                      handleStyleChange("pointRadius", e.target.value)
                    }
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}
                    style={{
                      background: isDarkMode
                        ? `linear-gradient(to right, #3B82F6 ${
                            styles.pointRadius * 10
                          }%, #4B5563 ${styles.pointRadius * 10}%)`
                        : `linear-gradient(to right, #3B82F6 ${
                            styles.pointRadius * 10
                          }%, #E5E7EB ${styles.pointRadius * 10}%)`,
                    }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChartProperties = ({
  styles,
  handleStyleChange,
  isDarkMode,
  chartType,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (["pie", "doughnut", "donut"].includes(chartType)) {
    return null;
  }

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3
          className={`text-xl font-semibold ${
            isDarkMode ? "text-yellow-400" : "text-gray-800"
          }`}
        >
          Chart Properties
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className={`w-5 h-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-xl p-4 ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Y‑Axis Minimum
                </label>
                <input
                  type="number"
                  value={styles.yAxisMin}
                  onChange={(e) =>
                    handleStyleChange("yAxisMin", e.target.value)
                  }
                  placeholder="Auto"
                  className={`w-full p-2 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-xl p-4 ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Y‑Axis Maximum
                </label>
                <input
                  type="number"
                  value={styles.yAxisMax}
                  onChange={(e) =>
                    handleStyleChange("yAxisMax", e.target.value)
                  }
                  placeholder="Auto"
                  className={`w-full p-2 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </motion.div>
            </div>
            <p
              className={`text-xs mt-2 italic ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Leave blank for automatic scaling based on your data
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AdvancedChartOptions = ({
  chartType,
  styles,
  handleStyleChange,
  isDarkMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!["pie", "doughnut", "donut"].includes(chartType)) {
    return null;
  }

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3
          className={`text-xl font-semibold ${
            isDarkMode ? "text-yellow-400" : "text-gray-800"
          }`}
        >
          Advanced Options
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className={`w-5 h-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-xl p-4 ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Cutout (%)
                  </label>
                  <span
                    className={`text-xs font-mono ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {styles.cutout}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={styles.cutout}
                  onChange={(e) => handleStyleChange("cutout", e.target.value)}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(to right, #FBBF24 ${styles.cutout}%, #4B5563 ${styles.cutout}%)`
                      : `linear-gradient(to right, #FBBF24 ${styles.cutout}%, #E5E7EB ${styles.cutout}%)`,
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-xl p-4 ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Rotation
                  </label>
                  <span
                    className={`text-xs font-mono ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {styles.rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={styles.rotation}
                  onChange={(e) =>
                    handleStyleChange("rotation", e.target.value)
                  }
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(to right, #8B5CF6 ${
                          ((parseInt(styles.rotation) + 180) / 360) * 100
                        }%, #4B5563 ${
                          ((parseInt(styles.rotation) + 180) / 360) * 100
                        }%)`
                      : `linear-gradient(to right, #4F46E5 ${
                          ((parseInt(styles.rotation) + 180) / 360) * 100
                        }%, #E5E7EB ${
                          ((parseInt(styles.rotation) + 180) / 360) * 100
                        }%)`,
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-xl p-4 ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Circumference
                  </label>
                  <span
                    className={`text-xs font-mono ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {styles.circumference}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={styles.circumference}
                  onChange={(e) =>
                    handleStyleChange("circumference", e.target.value)
                  }
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(to right, #EF4444 ${
                          (styles.circumference / 360) * 100
                        }%, #4B5563 ${(styles.circumference / 360) * 100}%)`
                      : `linear-gradient(to right, #EF4444 ${
                          (styles.circumference / 360) * 100
                        }%, #E5E7EB ${(styles.circumference / 360) * 100}%)`,
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-xl p-4 ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Border Radius
                  </label>
                  <span
                    className={`text-xs font-mono ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {styles.borderRadius}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={styles.borderRadius}
                  onChange={(e) =>
                    handleStyleChange("borderRadius", e.target.value)
                  }
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(to right, #3B82F6 ${
                          (styles.borderRadius / 20) * 100
                        }%, #4B5563 ${(styles.borderRadius / 20) * 100}%)`
                      : `linear-gradient(to right, #3B82F6 ${
                          (styles.borderRadius / 20) * 100
                        }%, #E5E7EB ${(styles.borderRadius / 20) * 100}%)`,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AppearanceSettings = ({
  chartType,
  styles,
  handleStyleChange,
  isDarkMode,
  generateRandomColors,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-4xl mx-auto p-6 rounded-2xl shadow-xl ${
        isDarkMode
          ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700"
          : "bg-white/90 backdrop-blur-sm border border-gray-200"
      }`}
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`text-3xl font-bold text-center mb-8 bg-clip-text ${
          isDarkMode
            ? "text-transparent bg-gradient-to-r from-yellow-400 to-amber-500"
            : "text-transparent bg-gradient-to-r from-blue-600 to-indigo-700"
        }`}
      >
        Appearance Settings
      </motion.h2>  

      <div className="space-y-6">
        <GeneralSettings
          styles={styles}
          handleStyleChange={handleStyleChange}
          isDarkMode={isDarkMode}
          generateRandomColors={generateRandomColors}
        />

        <ChartSettings
          chartType={chartType}
          styles={styles}
          handleStyleChange={handleStyleChange}
          isDarkMode={isDarkMode}
        />

        <ChartProperties
          chartType={chartType}
          styles={styles}
          handleStyleChange={handleStyleChange}
          isDarkMode={isDarkMode}
        />

        <AdvancedChartOptions
          chartType={chartType}
          styles={styles}
          handleStyleChange={handleStyleChange}
          isDarkMode={isDarkMode}
        />
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;
