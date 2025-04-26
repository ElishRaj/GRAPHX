import React, { useState } from "react";
import { Chart } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Filler,
  LineController,
  Legend,
  Title
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DisplayChart = ({
  chartType,
  data,
  options,
  isDarkMode,
  premier }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleGenerate = () => {
    navigate("/generate", {
      state: {
        chartType,
        premier:premier,
        chartData: data,
        chartOptions: options,
      },
    });
  };

  // Default chart options with dark mode support
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...(options?.plugins || {}),
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "#fff" : "#333",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: isDarkMode
          ? "rgba(0,0,0,0.8)"
          : "rgba(255,255,255,0.9)",
        titleColor: isDarkMode ? "#fff" : "#333",
        bodyColor: isDarkMode ? "#fff" : "#333",
        borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      ...(options?.scales || {}),
      x: {
        grid: {
          display: true,
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: true,
          borderColor: isDarkMode
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 0, 0, 0.2)",
        },
        ticks: {
          color: isDarkMode ? "#fff" : "#333",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: true,
          borderColor: isDarkMode
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 0, 0, 0.2)",
        },
        ticks: {
          color: isDarkMode ? "#fff" : "#333",
          font: {
            size: 12,
          },
          callback: function (value) {
            return value;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
    ...options,
  };

  return (
    <div
      className={`shadow-lg p-6 rounded-xl transition-all duration-700 ease-in-out ${
        isDarkMode ? "bg-[#1E293B] text-white" : "bg-white text-black"
      }`}
      style={{
        position: "fixed",
        top: isExpanded ? 0 : "100px",
        left: isExpanded ? 0 : "580px",
        width: isExpanded ? "100vw" : "60.66%",
        height: isExpanded ? "100vh" : "580px",
        zIndex: 49,
        transformOrigin: "top left",
        overflow: "hidden",
      }}
    >
      {/* Expand/Collapse Button */}
      <button
        onClick={toggleExpand}
        className={`absolute top-4 left-4 p-2 rounded transform hover:scale-105 transition duration-300 ${
          isDarkMode
            ? "bg-[#374151] text-white hover:bg-[#475569]"
            : "bg-gray-100 text-black hover:bg-gray-200"
        }`}
        title={isExpanded ? "Collapse" : "Expand"}
      >
        {isExpanded ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 12H5M12 19l-7-7 7-7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        )}
      </button>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className={`absolute top-4 right-4 font-bold py-2 px-4 rounded transform hover:scale-105 transition duration-300 ${
          isDarkMode
            ? "bg-[#2563EB] text-white hover:bg-[#1E40AF]"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Generate
      </button>

      {/* Chart Container */}
      <div
        className={`mt-12 h-full overflow-auto scrollbar-thin ${
          isDarkMode
            ? "scrollbar-thumb-gray-500 scrollbar-track-gray-800"
            : "scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        } transition-all duration-500`}
      >
        {data ? (
          <Chart type={chartType} data={data} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg">
              {isDarkMode
                ? "No chart data available"
                : "No chart data available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayChart;
