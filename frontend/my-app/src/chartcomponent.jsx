import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Chart } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./auth";

import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ChartContainer = ({ isDarkMode }) => {
  const { isAuthenticated, userData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    chartType,
    chartData,
    chartOptions: initialChartOptions,
    premier,
  } = location.state || {};

  // State management
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isProcessing, setIsProcessing] = useState({
    export: false,
    print: false,
    save: false,
    edit: false,
  });
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);

  // Container border
  const [containerBorderColor, setContainerBorderColor] = useState("#3B82F6");
  const [containerBorderWidth, setContainerBorderWidth] = useState(2);

  // Axis borders
  const [axisBorderColor, setAxisBorderColor] = useState("#94a3b8");
  const [axisBorderWidth, setAxisBorderWidth] = useState(1);

  // Background
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  // Refs
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const editMenuRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Dynamically update chartOptions
  const chartOptions = useMemo(() => {
    return {
      ...initialChartOptions,
      scales: {
        x: {
          title: {
            display: true,
            text: initialChartOptions?.scales?.x?.title?.text || "X Axis",
            color: isDarkMode ? "#ffffff" : "#000000",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          grid: {
            color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            display: true,
          },
          ticks: {
            color: isDarkMode ? "#ffffff" : "#000000",
          },
          border: {
            color: axisBorderColor,
            width: axisBorderWidth,
          },
        },
        y: {
          title: {
            display: true,
            text: initialChartOptions?.scales?.y?.title?.text || "Y Axis",
            color: isDarkMode ? "#ffffff" : "#000000",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          grid: {
            color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            display: true,
          },
          ticks: {
            color: isDarkMode ? "#ffffff" : "#000000",
          },
          border: {
            color: axisBorderColor,
            width: axisBorderWidth,
          },
        },
      },
      elements: {
        line: {
          borderColor: axisBorderColor,
          borderWidth: axisBorderWidth,
        },
      },
    };
  }, [initialChartOptions, isDarkMode, axisBorderColor, axisBorderWidth]);

  // Show notification with animation
  const showNotification = (message, isSuccess = true) => {
    setNotification({
      message,
      isSuccess,
      id: Date.now(),
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Check premium status before allowing actions
  const checkPremium = () => {
    if (!premier) {
      setShowPremiumAlert(true);
      return false;
    }
    return true;
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const popups = [editMenuRef.current, exportMenuRef.current];

      if (!popups.some((ref) => ref?.contains(event.target))) {
        setShowEditMenu(false);
        setShowExportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Export handler with loading state
  const handleExport = async (format) => {
    try {
      if (format === "pdf" && !checkPremium()) return;

      setIsProcessing({ ...isProcessing, export: true });
      const container = containerRef.current;
      const canvas = await html2canvas(container, {
        backgroundColor: backgroundColor,
        useCORS: true,
        scale: 3,
      });

      const chartTitle =
        initialChartOptions?.plugins?.title?.text || `My ${chartType} Chart`;

      if (format === "png") {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${chartTitle}.png`;
        link.click();
        showNotification("Chart downloaded as PNG");
      } else if (format === "pdf") {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const pngImage = await pdfDoc.embedPng(canvas.toDataURL("image/png"));
        const { width, height } = pngImage.scale(1);
        page.setSize(width, height);
        page.drawImage(pngImage, { x: 0, y: 0, width, height });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${chartTitle}.pdf`;
        link.click();
        showNotification("Chart downloaded as PDF");
      }
    } catch (error) {
      console.error("Export failed:", error);
      showNotification("Error exporting chart", false);
    } finally {
      setIsProcessing({ ...isProcessing, export: false });
      setShowExportMenu(false);
    }
  };

  // Print handler with loading state
  const handlePrint = async () => {
    try {
      setIsProcessing({ ...isProcessing, print: true });
      const container = containerRef.current;
      const canvas = await html2canvas(container, {
        backgroundColor: backgroundColor,
        scale: 2,
        useCORS: true,
      });

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        showNotification("Please allow pop-ups for printing", false);
        return;
      }

      const img = new Image();
      img.src = canvas.toDataURL("image/png");

      img.onload = () => {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Chart - ${
                initialChartOptions?.plugins?.title?.text || "My Chart"
              }</title>
              <style>
                body { 
                  margin: 0; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh; 
                  background: ${backgroundColor} !important;
                }
                img { 
                  max-width: 100%; 
                  height: auto; 
                  background: ${backgroundColor};
                  border: ${containerBorderWidth}px solid ${containerBorderColor};
                  border-radius: 8px;
                  padding: 10px;
                }
              </style>
            </head>
            <body>
              <img src="${img.src}" />
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          showNotification("Print dialog opened");
        }, 500);
      };
    } catch (error) {
      console.error("Print failed:", error);
      showNotification("Error preparing print", false);
    } finally {
      setIsProcessing({ ...isProcessing, print: false });
    }
  };

  // Save handler with automatic naming
  const handleSave = async () => {
    try {
      setIsProcessing({ ...isProcessing, save: true });

      const chartTitle =
        initialChartOptions?.plugins?.title?.text ||
        `My ${chartType} Chart - ${new Date().toLocaleDateString()}`;

      const chartInstance = chartRef.current;

      const payload = {
        email: userData.email,
        chartDetails: {
          metadata: {
            name: chartTitle,
            savedAt: new Date().toISOString(),
            version: "1.0",
          },
          chartConfig: {
            type: chartType,
            data: chartData,
            options: initialChartOptions,
            customStyles: {
              backgroundColor,
              containerBorder: {
                color: containerBorderColor,
                width: containerBorderWidth,
              },
              axisBorder: {
                color: axisBorderColor,
                width: axisBorderWidth,
              },
            },
            state: chartInstance?.config || null,
          },
          rawData: {
            labels: chartData.labels,
            datasets: chartData.datasets.map((dataset) => ({
              ...dataset,
              label: dataset.label,
              data: dataset.data,
            })),
          },
        },
      };

      const response = await fetch("http://localhost:30000/chartRoutes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isAuthenticated && { Authorization: `Bearer ${userData.token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save chart");
      }

      showNotification(`Chart "${chartTitle}" saved successfully`, true);
    } catch (error) {
      console.error("Error saving chart:", error);
      showNotification(error.message || "Error saving chart", false);
    } finally {
      setIsProcessing({ ...isProcessing, save: false });
    }
  };

  // Loading spinner component
  const LoadingSpinner = ({ size = 4 }) => (
    <svg
      className={`animate-spin -ml-1 mr-2 h-${size} w-${size} text-white`}
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
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Animated Notification Popup */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
              notification.isSuccess
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center">
              {notification.isSuccess ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-2"
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
              )}
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Upgrade Popup */}
      <AnimatePresence>
        {showPremiumAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`p-6 rounded-lg max-w-md w-full mx-4 ${
                isDarkMode
                  ? "bg-gray-800/90 shadow-[0_0_15px_rgba(159,122,234,0.3)] hover:shadow-[0_0_30px_rgba(159,122,234,0.5)]"
                  : "bg-white/90 shadow-[0_0_15px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  Premium Feature
                </h3>
                <p
                  className={`mb-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  This feature is available in our premium plan. Upgrade now to
                  unlock all exclusive features!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPremiumAlert(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    Maybe Later
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                    onClick={() => navigate("/prices")}
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with subtle animation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 w-full p-4 z-40 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/workspace")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            Home
          </button>

          <div className="flex gap-2">
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
                disabled={isProcessing.export}
              >
                {isProcessing.export ? (
                  <>
                    <LoadingSpinner size={4} />
                    Exporting...
                  </>
                ) : (
                  "Export"
                )}
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    ref={exportMenuRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-12 right-0 w-48 rounded-lg shadow-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <button
                      onClick={() => handleExport("png")}
                      className={`block w-full px-4 py-2 text-left transition-colors duration-200 flex items-center ${
                        isDarkMode
                          ? "text-white hover:bg-gray-600"
                          : "text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      PNG
                    </button>
                    <button
                      onClick={() => handleExport("pdf")}
                      className={`block w-full px-4 py-2 text-left transition-colors duration-200 flex items-center ${
                        isDarkMode
                          ? "text-white hover:bg-gray-600"
                          : "text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      PDF
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
              disabled={isProcessing.print}
            >
              {isProcessing.print ? (
                <>
                  <LoadingSpinner size={4} />
                  Printing...
                </>
              ) : (
                "Print"
              )}
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
              disabled={isProcessing.save}
            >
              {isProcessing.save ? (
                <>
                  <LoadingSpinner size={4} />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>

            {/* Edit Menu */}
            <div className="relative" ref={editMenuRef}>
              <button
                onClick={() => {
                  if (!premier) {
                    setShowPremiumAlert(true);
                    return;
                  }
                  setShowEditMenu(!showEditMenu);
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
                disabled={isProcessing.edit}
              >
                Edit
              </button>
              <AnimatePresence>
                {showEditMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-12 right-0 w-48 p-4 rounded-lg shadow-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    {/* Background Color */}
                    <div className="mb-4">
                      <label
                        className={`block text-sm mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                    </div>

                    {/* Container Border */}
                    <div className="mb-4 border-t pt-4">
                      <label
                        className={`block text-sm mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Container Border Color
                      </label>
                      <input
                        type="color"
                        value={containerBorderColor}
                        onChange={(e) =>
                          setContainerBorderColor(e.target.value)
                        }
                        className="w-full h-10 rounded cursor-pointer"
                      />
                      <label
                        className={`block text-sm mb-2 mt-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Container Border Width
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={containerBorderWidth}
                        onChange={(e) =>
                          setContainerBorderWidth(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Axis Borders */}
                    <div className="mb-4 border-t pt-4">
                      <label
                        className={`block text-sm mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Axis Border Color
                      </label>
                      <input
                        type="color"
                        value={axisBorderColor}
                        onChange={(e) => setAxisBorderColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                      <label
                        className={`block text-sm mb-2 mt-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Axis Border Width
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={axisBorderWidth}
                        onChange={(e) =>
                          setAxisBorderWidth(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart Area */}
      <div className="container mx-auto pt-20 p-4 relative">
        <motion.div
          ref={containerRef}
          className="relative h-[600px]"
          style={{
            backgroundColor,
            border: `${containerBorderWidth}px solid ${containerBorderColor}`,
            borderRadius: "8px",
            padding: "10px",
            boxSizing: "border-box",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {chartData ? (
            <Chart
              ref={chartRef}
              type={chartType}
              data={chartData}
              options={chartOptions}
              key={`${backgroundColor}-${containerBorderColor}-${containerBorderWidth}-${axisBorderColor}-${axisBorderWidth}`}
            />
          ) : (
            <p
              className={`text-center ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No chart data available
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChartContainer;
