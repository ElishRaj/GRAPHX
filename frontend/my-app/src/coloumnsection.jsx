import React, { useState, useEffect } from "react";
import {
  FaFileCsv,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaPlus,
  FaArrowRight,
  FaTimes,
  FaTrash,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ColumnSelectionModal = ({
  isOpen,
  onClose,
  csvData,
  onApply,
  isDarkMode,
}) => {
  const [selectedColumns, setSelectedColumns] = useState({ x: "", y: "" });
  const [chartType, setChartType] = useState("bar");
  const [additionalSelections, setAdditionalSelections] = useState([]);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [datasetName, setDatasetName] = useState("Dataset");

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setSelectedColumns({ x: "", y: "" });
      setChartType("bar");
      setAdditionalSelections([]);
      setError("");
      setEditingIndex(null);
      setDatasetName("Dataset");
    } else {
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const suggestChartType = (xCol, yCol) => {
    if (!xCol || !yCol) return "bar";

    try {
      const xValues = csvData.data.map((item) => item[xCol]);
      const yValues = csvData.data
        .map((item) => Number(item[yCol]))
        .filter((val) => !isNaN(val));

      const uniqueXValues = [...new Set(xValues)].length;
      const isYNumerical = yValues.length === csvData.data.length;

      if (!isYNumerical) return "pie";
      if (uniqueXValues > 10) return "line";
      if (uniqueXValues <= 5) return "pie";
      return "bar";
    } catch {
      return "bar";
    }
  };

  const handleColumnChange = (axis, value) => {
    const newSelection = { ...selectedColumns, [axis]: value };
    setSelectedColumns(newSelection);

    if (newSelection.x && newSelection.y) {
      setChartType(suggestChartType(newSelection.x, newSelection.y));
    }
  };

  const validateSelection = () => {
    if (!selectedColumns.x || !selectedColumns.y) {
      setError("Please select both X and Y columns");
      return false;
    }

    try {
      const yValues = csvData.data.map((item) =>
        Number(item[selectedColumns.y])
      );
      if (yValues.some(isNaN)) {
        setError("Y axis column must contain numeric values");
        return false;
      }
      return true;
    } catch (err) {
      setError("Error validating data");
      return false;
    }
  };

  const handleAddSelection = () => {
    if (!validateSelection()) return;

    const selection = {
      ...selectedColumns,
      chartType,
      name: datasetName || `Dataset ${additionalSelections.length + 1}`,
      labels: csvData.data.map((item) => item[selectedColumns.x]),
      data: csvData.data.map((item) => Number(item[selectedColumns.y])),
    };

    if (editingIndex !== null) {
      // Update existing selection
      const updatedSelections = [...additionalSelections];
      updatedSelections[editingIndex] = selection;
      setAdditionalSelections(updatedSelections);
      setEditingIndex(null);
    } else {
      // Add new selection
      setAdditionalSelections((prev) => [...prev, selection]);
    }

    setSelectedColumns({ x: "", y: "" });
    setDatasetName("Dataset");
    setChartType("bar");
    setError("");
  };

  const handleFinalSubmit = () => {
    if (editingIndex !== null) {
      if (!validateSelection()) return;
      handleAddSelection();
    }

    // Always include the current selection if it exists
    let finalSelections = [...additionalSelections];
    if (selectedColumns.x && selectedColumns.y) {
      finalSelections.push({
        ...selectedColumns,
        chartType,
        name: datasetName || `Dataset ${finalSelections.length + 1}`,
        labels: csvData.data.map((item) => item[selectedColumns.x]),
        data: csvData.data.map((item) => Number(item[selectedColumns.y])),
      });
    }

    if (finalSelections.length === 0) {
      setError("Please add at least one dataset");
      return;
    }

    onApply(finalSelections);
    onClose();
  };

  const handleDeleteSelection = (index) => {
    setAdditionalSelections((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setSelectedColumns({ x: "", y: "" });
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleEditSelection = (index) => {
    const selection = additionalSelections[index];
    setSelectedColumns({
      x: selection.x,
      y: selection.y,
    });
    setChartType(selection.chartType);
    setDatasetName(selection.name);
    setEditingIndex(index);
  };

  const getChartIcon = (type) => {
    switch (type) {
      case "bar":
        return <FaChartBar className="mr-1" />;
      case "line":
        return <FaChartLine className="mr-1" />;
      case "pie":
        return <FaChartPie className="mr-1" />;
      default:
        return <FaChartBar className="mr-1" />;
    }
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 500 },
    },
    exit: { y: 50, opacity: 0 },
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.3 }}
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            className="relative w-full max-w-2xl mx-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className={`relative rounded-xl overflow-hidden transform transition-all
                ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-800"
                }
                shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] 
                ring-1 ${isDarkMode ? "ring-gray-700" : "ring-gray-200"}`}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between p-6"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(to right, #1e40af, #1e3a8a)"
                    : "linear-gradient(to right, #3b82f6, #2563eb)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                }}
              >
                <div className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <FaFileCsv className="mr-3 text-xl text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white">
                    CSV Column Selection
                  </h2>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-1 text-white rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-lg" />
                </motion.button>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Dataset Name */}
                  {selectedColumns.x && selectedColumns.y && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Dataset Name
                      </label>
                      <input
                        type="text"
                        value={datasetName}
                        onChange={(e) => setDatasetName(e.target.value)}
                        className={`w-full p-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                          ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500 focus:ring-blue-500/50"
                              : "bg-white border-gray-300 text-gray-900 hover:border-gray-400 focus:ring-blue-500/30"
                          }`}
                        placeholder="Enter dataset name"
                      />
                    </motion.div>
                  )}

                  {/* Column Selection */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        X Axis Column
                      </label>
                      <select
                        value={selectedColumns.x}
                        onChange={(e) =>
                          handleColumnChange("x", e.target.value)
                        }
                        className={`w-full p-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                          ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500 focus:ring-blue-500/50"
                              : "bg-white border-gray-300 text-gray-900 hover:border-gray-400 focus:ring-blue-500/30"
                          }`}
                      >
                        <option value="">Select column</option>
                        {csvData.headers.map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Y Axis Column
                      </label>
                      <select
                        value={selectedColumns.y}
                        onChange={(e) =>
                          handleColumnChange("y", e.target.value)
                        }
                        className={`w-full p-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                          ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white hover:border-gray-500 focus:ring-blue-500/50"
                              : "bg-white border-gray-300 text-gray-900 hover:border-gray-400 focus:ring-blue-500/30"
                          }`}
                      >
                        <option value="">Select column</option>
                        {csvData.headers
                          .filter((header) => header !== selectedColumns.x)
                          .map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                      </select>
                    </div>
                  </motion.div>

                  {/* Chart Type Selection */}
                  {selectedColumns.x && selectedColumns.y && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Chart Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["bar", "line", "pie"].map((type) => (
                          <motion.button
                            key={type}
                            onClick={() => setChartType(type)}
                            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all
                              ${
                                chartType === type
                                  ? isDarkMode
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-blue-500 text-white shadow-md"
                                  : isDarkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {getChartIcon(type)}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      className={`p-3 text-sm rounded-lg ${
                        isDarkMode
                          ? "bg-red-900/50 text-red-100"
                          : "bg-red-100 text-red-800"
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Selected Datasets */}
                  {additionalSelections.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3
                        className={`mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Selected Datasets
                      </h3>
                      <div className="space-y-2">
                        {additionalSelections.map((selection, index) => (
                          <motion.div
                            key={index}
                            className={`p-3 rounded-lg flex justify-between items-center transition-all group
                              ${
                                isDarkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }
                              ${
                                editingIndex === index
                                  ? isDarkMode
                                    ? "ring-2 ring-blue-500"
                                    : "ring-2 ring-blue-400"
                                  : ""
                              }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{
                              scale: 1.02,
                              boxShadow: isDarkMode
                                ? "0 4px 10px rgba(0, 0, 0, 0.3)"
                                : "0 4px 10px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div className="flex items-center">
                              <span className="font-medium mr-2">
                                {selection.name}:
                              </span>
                              <span className="text-sm opacity-80">
                                {selection.x} → {selection.y}
                                <span className="ml-2">
                                  ({selection.chartType})
                                </span>
                              </span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                onClick={() => handleEditSelection(index)}
                                className={`p-2 rounded-full ${
                                  isDarkMode
                                    ? "hover:bg-gray-500"
                                    : "hover:bg-gray-300"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Edit"
                              >
                                <FaEdit
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-blue-300"
                                      : "text-blue-600"
                                  }`}
                                />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteSelection(index)}
                                className={`p-2 rounded-full ${
                                  isDarkMode
                                    ? "hover:bg-gray-500"
                                    : "hover:bg-gray-300"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Delete"
                              >
                                <FaTrash
                                  className={`text-sm ${
                                    isDarkMode ? "text-red-300" : "text-red-600"
                                  }`}
                                />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-between mt-8">
                  <motion.button
                    onClick={onClose}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
                      ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>

                  <div className="flex gap-2">
                    {selectedColumns.x && selectedColumns.y && (
                      <motion.button
                        onClick={handleAddSelection}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          editingIndex !== null
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                        whileHover={{
                          scale: 1.05,
                          boxShadow:
                            editingIndex !== null
                              ? "0 4px 10px rgba(16, 185, 129, 0.4)"
                              : "0 4px 10px rgba(124, 58, 237, 0.4)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {editingIndex !== null ? (
                          <>
                            <FaCheck className="mr-1" /> Update
                          </>
                        ) : (
                          <>
                            <FaPlus className="mr-1" /> Add Dataset
                          </>
                        )}
                      </motion.button>
                    )}

                    <motion.button
                      onClick={handleFinalSubmit}
                      disabled={
                        additionalSelections.length === 0 &&
                        (!selectedColumns.x || !selectedColumns.y)
                      }
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all
                        ${
                          additionalSelections.length === 0 &&
                          (!selectedColumns.x || !selectedColumns.y)
                            ? isDarkMode
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : isDarkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      whileHover={{
                        scale:
                          additionalSelections.length === 0 &&
                          (!selectedColumns.x || !selectedColumns.y)
                            ? 1
                            : 1.05,
                        boxShadow:
                          additionalSelections.length === 0 &&
                          (!selectedColumns.x || !selectedColumns.y)
                            ? "none"
                            : "0 4px 10px rgba(59, 130, 246, 0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply All
                      <FaArrowRight className="ml-1" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColumnSelectionModal;
