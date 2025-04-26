import React, { useState } from "react";
import {
  FaFileCsv,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaDatabase,
  FaFileCode,
  FaPen,
} from "react-icons/fa";

const DataInputPanel = ({
  chartType,
  setChartType,
  chartVariant,
  setChartVariant,
  inputMethod,
  setInputMethod,
  mainTitle,
  setMainTitle,
  xLabel,
  setXLabel,
  yLabel,
  setYLabel,
  labels = [],
  setLabels,
  datasets,
  setDatasets,
  activeDatasetId,
  handleFileUpload,
  jsonData,
  setJsonData,
  handleJsonData,
  databaseLink,
  setDatabaseLink,
  handleDatabaseFetch,
  error,
  isDarkMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredChart, setHoveredChart] = useState(null);

  // Helper function to generate random colors
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Helper function to darken a color
  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return `#${(
      0x1000000 +
      (R < 0 ? 0 : R) * 0x10000 +
      (G < 0 ? 0 : G) * 0x100 +
      (B < 0 ? 0 : B)
    )
      .toString(16)
      .slice(1)}`;
  };

  // Handle manual data changes with color management
  const handleManualDataChange = (newData) => {
    const newDatasets = datasets.map((dataset) => {
      if (dataset.id === activeDatasetId) {
        const isIndividualColors = Array.isArray(dataset.backgroundColor);
        let newColors = dataset.backgroundColor;

        if (isIndividualColors) {
          // If we're using individual colors, adjust the array length
          const currentLength = newColors.length;
          const newLength = newData.length;

          if (newLength > currentLength) {
            // Add new random colors for new data points
            const additionalColors = Array(newLength - currentLength)
              .fill()
              .map(() => getRandomColor());
            newColors = [...newColors, ...additionalColors];
          } else if (newLength < currentLength) {
            // Remove extra colors
            newColors = newColors.slice(0, newLength);
          }
        }

        return {
          ...dataset,
          data: newData,
          backgroundColor: newColors,
          borderColor: isIndividualColors
            ? newColors.map((color) => darkenColor(color, 20))
            : dataset.borderColor,
        };
      }
      return dataset;
    });

    setDatasets(newDatasets);
  };

  // SVG Icons for each chart type with animations
  const chartIcons = {
    bar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-10 w-10 ${
          hoveredChart === "bar" ? "animate-barGrow" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#3B82F6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 21h18M6 18v-6m4 6v-12m4 12v-8m4 8v-4"
          className={hoveredChart === "bar" ? "animate-barRise" : ""}
        />
      </svg>
    ),
    line: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#10B981"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 15l4-4 3 3 5-5m0 0l3-3"
          className={hoveredChart === "line" ? "animate-lineDraw" : ""}
        />
        <circle
          cx="3"
          cy="15"
          r="1.5"
          fill="#10B981"
          className={hoveredChart === "line" ? "animate-pulse" : ""}
        />
        <circle
          cx="7"
          cy="11"
          r="1.5"
          fill="#10B981"
          className={hoveredChart === "line" ? "animate-pulse" : ""}
        />
        <circle
          cx="10"
          cy="14"
          r="1.5"
          fill="#10B981"
          className={hoveredChart === "line" ? "animate-pulse" : ""}
        />
        <circle
          cx="15"
          cy="9"
          r="1.5"
          fill="#10B981"
          className={hoveredChart === "line" ? "animate-pulse" : ""}
        />
        <circle
          cx="18"
          cy="6"
          r="1.5"
          fill="#10B981"
          className={hoveredChart === "line" ? "animate-pulse" : ""}
        />
      </svg>
    ),
    pie: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-10 w-10 ${
          hoveredChart === "pie" ? "animate-spinSlow" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#F59E0B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 12L12 3M12 12L19.5 19.5M12 12L3 12"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#8B5CF6"
          strokeWidth={1.5}
          strokeDasharray="20 100"
          className={hoveredChart === "pie" ? "animate-pieSlice" : ""}
        />
      </svg>
    ),
    doughnut: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#EC4899"
          strokeWidth={1.5}
          strokeDasharray="60 100"
          className={hoveredChart === "doughnut" ? "animate-pieSlice" : ""}
        />
        <circle
          cx="12"
          cy="12"
          r="5"
          stroke="#F59E0B"
          strokeWidth={1.5}
          strokeDasharray="30 100"
          className={
            hoveredChart === "doughnut" ? "animate-pieSliceReverse" : ""
          }
        />
      </svg>
    ),
    polarArea: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#8B5CF6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
          className={hoveredChart === "polarArea" ? "animate-pulse" : ""}
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="#3B82F6"
          className={hoveredChart === "polarArea" ? "animate-ping" : ""}
        />
      </svg>
    ),
    radar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#10B981"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"
          className={hoveredChart === "radar" ? "animate-spinSlow" : ""}
        />
        <path
          stroke="#EC4899"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 12l5.66 5.66M12 12L6.34 6.34M12 12l5.66-5.66M12 12L6.34 17.66"
          className={hoveredChart === "radar" ? "animate-pulse" : ""}
        />
      </svg>
    ),
    multiSeriesArea: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#3B82F6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 17l4-4 3 3 5-5m0 0l4-4"
          className={
            hoveredChart === "multiSeriesArea" ? "animate-lineDraw" : ""
          }
        />
        <path
          stroke="#10B981"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 13l4-4 3 3 5-5m0 0l4-4"
          className={
            hoveredChart === "multiSeriesArea" ? "animate-lineDrawDelay" : ""
          }
        />
      </svg>
    ),
    scatter: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="5"
          cy="5"
          r="2"
          fill="#F59E0B"
          className={hoveredChart === "scatter" ? "animate-bounce" : ""}
        />
        <circle
          cx="12"
          cy="15"
          r="2"
          fill="#EC4899"
          className={hoveredChart === "scatter" ? "animate-bounceDelay1" : ""}
        />
        <circle
          cx="19"
          cy="8"
          r="2"
          fill="#8B5CF6"
          className={hoveredChart === "scatter" ? "animate-bounceDelay2" : ""}
        />
        <circle
          cx="8"
          cy="18"
          r="2"
          fill="#3B82F6"
          className={hoveredChart === "scatter" ? "animate-bounceDelay3" : ""}
        />
        <circle
          cx="15"
          cy="12"
          r="2"
          fill="#10B981"
          className={hoveredChart === "scatter" ? "animate-bounceDelay4" : ""}
        />
      </svg>
    ),
    horizontalBar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-10 w-10 ${
          hoveredChart === "horizontalBar" ? "animate-barGrow" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#8B5CF6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12h18M3 6h18M3 18h18"
          className={
            hoveredChart === "horizontalBar" ? "animate-barExpand" : ""
          }
        />
      </svg>
    ),
    barWithLine: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#3B82F6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 21h18M6 18v-6m4 6v-12m4 12v-8m4 8v-4"
          className={hoveredChart === "barWithLine" ? "animate-barRise" : ""}
        />
        <path
          stroke="#EC4899"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 15l4-4 3 3 5-5m0 0l3-3"
          className={hoveredChart === "barWithLine" ? "animate-lineDraw" : ""}
        />
      </svg>
    ),
    lineScatterHybrid: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#10B981"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 15l4-4 3 3 5-5m0 0l3-3"
          className={
            hoveredChart === "lineScatterHybrid" ? "animate-lineDraw" : ""
          }
        />
        <circle
          cx="5"
          cy="11"
          r="1.5"
          fill="#F59E0B"
          className={hoveredChart === "lineScatterHybrid" ? "animate-ping" : ""}
        />
        <circle
          cx="12"
          cy="8"
          r="1.5"
          fill="#8B5CF6"
          className={
            hoveredChart === "lineScatterHybrid" ? "animate-pingDelay1" : ""
          }
        />
        <circle
          cx="19"
          cy="5"
          r="1.5"
          fill="#EC4899"
          className={
            hoveredChart === "lineScatterHybrid" ? "animate-pingDelay2" : ""
          }
        />
      </svg>
    ),
    stackedBar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-10 w-10 ${
          hoveredChart === "stackedBar" ? "animate-barGrow" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#3B82F6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 21h18M6 18v-6m4 6v-12m4 12v-8m4 8v-4"
          className={hoveredChart === "stackedBar" ? "animate-barStack" : ""}
        />
        <path
          stroke="#10B981"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M6 12h4v6H6zm8-8h4v14h-4z"
          className={
            hoveredChart === "stackedBar" ? "animate-barStackDelay" : ""
          }
        />
      </svg>
    ),
  };

  // Chart types with descriptions
  const chartTypes = [
    { id: "bar", name: "Bar Chart", desc: "Vertical bars showing quantities" },
    {
      id: "line",
      name: "Line Chart",
      desc: "Points connected by lines showing trends",
    },
    {
      id: "pie",
      name: "Pie Chart",
      desc: "Circular chart divided into sectors",
    },
    {
      id: "doughnut",
      name: "Doughnut",
      desc: "Pie chart with a center cutout",
    },
    {
      id: "polarArea",
      name: "Polar Area",
      desc: "Radial chart with equal angles",
    },
    {
      id: "radar",
      name: "Radar Chart",
      desc: "Multivariate data on radial axes",
    },
    {
      id: "multiSeriesArea",
      name: "Multi-Series Area",
      desc: "Stacked area charts",
    },
    {
      id: "scatter",
      name: "Scatter Plot",
      desc: "Points showing relationships",
    },
    {
      id: "horizontalBar",
      name: "Horizontal Bar",
      desc: "Horizontal bar chart",
    },
    {
      id: "barWithLine",
      name: "Bar with Line",
      desc: "Combination bar and line chart",
    },
    {
      id: "lineScatterHybrid",
      name: "Line-Scatter Hybrid",
      desc: "Combined line and scatter plot",
    },
    {
      id: "stackedBar",
      name: "Stacked Bar",
      desc: "Bars stacked on top of each other",
    },
  ];

  const handleChartTypeChange = (type) => {
    if (["horizontalBar", "stackedBar", "barWithLine"].includes(type)) {
      setChartType("bar");
      setChartVariant(
        type === "horizontalBar"
          ? "horizontal"
          : type === "stackedBar"
          ? "stacked"
          : "combo"
      );
    } else if (["multiSeriesArea", "lineScatterHybrid"].includes(type)) {
      setChartType("line");
      setChartVariant(type === "multiSeriesArea" ? "stacked" : "hybrid");
    } else {
      setChartType(type);
      setChartVariant("standard");
    }
    setIsExpanded(false);
  };

  // Safe array handling with fallbacks
  const safeLabels = Array.isArray(labels) ? labels : [];
  const activeDataset =
    datasets.find((dataset) => dataset.id === activeDatasetId) || {};
  const safeDataValues = Array.isArray(activeDataset.data)
    ? activeDataset.data
    : [];

  return (
    <div
      className="space-y-6 p-1 rounded-xl transition-all duration-300 relative"
      style={{
        backgroundColor: isDarkMode
          ? "rgba(31, 41, 55, 0.8)"
          : "rgba(243, 244, 246, 0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* CSS Animations */}
      <style>{`
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes barGrow {
          0% {
            transform: scaleY(0.8);
          }
          50% {
            transform: scaleY(1.1);
          }
          100% {
            transform: scaleY(1);
          }
        }
        @keyframes barRise {
          0% {
            transform: translateY(10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes barExpand {
          0% {
            transform: scaleX(0.5);
          }
          100% {
            transform: scaleX(1);
          }
        }
        @keyframes barStack {
          0% {
            transform: translateY(5px);
          }
          50% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes barStackDelay {
          0%,
          40% {
            transform: translateY(5px);
          }
          70% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes lineDraw {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 100;
          }
        }
        @keyframes lineDrawDelay {
          0%,
          30% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 100;
          }
        }
        @keyframes pieSlice {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 20, 100;
          }
        }
        @keyframes pieSliceReverse {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 30, 100;
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes bounceDelay1 {
          0%,
          20% {
            transform: translateY(0);
          }
          70% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes bounceDelay2 {
          0%,
          40% {
            transform: translateY(0);
          }
          90% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes bounceDelay3 {
          0%,
          60% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-10px);
          }
        }
        @keyframes bounceDelay4 {
          0%,
          80% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-10px);
          }
        }
        @keyframes ping {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes pingDelay1 {
          0%,
          20% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          90%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes pingDelay2 {
          0%,
          40% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-spinSlow {
          animation: spinSlow 2s linear infinite;
        }
        .animate-barGrow {
          animation: barGrow 0.5s ease-out;
        }
        .animate-barRise {
          animation: barRise 0.5s ease-out;
        }
        .animate-barExpand {
          animation: barExpand 0.5s ease-out;
        }
        .animate-barStack {
          animation: barStack 0.6s ease-out;
        }
        .animate-barStackDelay {
          animation: barStackDelay 0.8s ease-out;
        }
        .animate-lineDraw {
          animation: lineDraw 1s ease-out forwards;
        }
        .animate-lineDrawDelay {
          animation: lineDrawDelay 1.2s ease-out forwards;
        }
        .animate-pieSlice {
          animation: pieSlice 1s ease-out forwards;
        }
        .animate-pieSliceReverse {
          animation: pieSliceReverse 1s ease-out forwards;
        }
        .animate-bounce {
          animation: bounce 0.6s ease infinite;
        }
        .animate-bounceDelay1 {
          animation: bounceDelay1 0.8s ease infinite;
        }
        .animate-bounceDelay2 {
          animation: bounceDelay2 1s ease infinite;
        }
        .animate-bounceDelay3 {
          animation: bounceDelay3 1.2s ease infinite;
        }
        .animate-bounceDelay4 {
          animation: bounceDelay4 1.4s ease infinite;
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pingDelay1 {
          animation: pingDelay1 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pingDelay2 {
          animation: pingDelay2 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Data Configuration
      </h2>

      {/* Chart Type Selection */}
      <div className="mb-6 relative">
        <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
          Chart Type
        </label>
        <div
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800/90 hover:bg-gray-700/90 text-gray-100 border-gray-700"
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          } shadow-sm`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                {chartIcons[chartType] || chartIcons.bar}
              </div>
              <span className="font-medium">
                {chartTypes.find((t) => t.id === chartType)?.name ||
                  "Select Chart Type"}
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {isExpanded && (
          <div className="absolute z-10 mt-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3 border rounded-lg shadow-lg bg-white dark:bg-gray-800">
            {chartTypes.map((type) => (
              <div
                key={type.id}
                className={`group relative flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  chartType === type.id
                    ? "bg-indigo-500 text-white shadow-lg"
                    : `${
                        isDarkMode
                          ? "bg-gray-800/90 hover:bg-gray-700 text-gray-100 border-gray-700"
                          : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                      } hover:shadow-md`
                }`}
                onClick={() => handleChartTypeChange(type.id)}
                onMouseEnter={() => setHoveredChart(type.id)}
                onMouseLeave={() => setHoveredChart(null)}
              >
                <div className="transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  {chartIcons[type.id]}
                </div>
                <span className="mt-2 text-sm font-medium text-center">
                  {type.name}
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                  {type.desc}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
          Data Input Method
        </label>
        <div className="flex flex-nowrap overflow-x-auto pb-2 gap-2">
          {["manual", "csv", "json", "database"].map((method) => (
            <button
              key={method}
              onClick={() => setInputMethod(method)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 flex items-center ${
                inputMethod === method
                  ? "bg-indigo-500 text-white shadow-md"
                  : `${
                      isDarkMode
                        ? "bg-gray-800/90 hover:bg-gray-700 text-gray-100"
                        : "bg-white hover:bg-gray-100 text-gray-700"
                    } shadow-sm`
              }`}
            >
              {method === "manual" && <FaPen className="h-4 w-4 mr-1" />}
              {method === "csv" && <FaFileCsv className="h-4 w-4 mr-1" />}
              {method === "json" && <FaFileCode className="h-4 w-4 mr-1" />}
              {method === "database" && <FaDatabase className="h-4 w-4 mr-1" />}
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Titles and Labels */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
            Chart Title
          </label>
          <input
            type="text"
            value={mainTitle}
            onChange={(e) => setMainTitle(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              isDarkMode
                ? "bg-gray-800/90 text-gray-100 border-gray-700 hover:border-indigo-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-indigo-500"
            } shadow-sm`}
            placeholder="Enter chart title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
              X Axis Label
            </label>
            <input
              type="text"
              value={xLabel}
              onChange={(e) => setXLabel(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-800/90 text-gray-100 border-gray-700 hover:border-indigo-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-indigo-500"
              } shadow-sm`}
              placeholder="X axis label"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
              Y Axis Label
            </label>
            <input
              type="text"
              value={yLabel}
              onChange={(e) => setYLabel(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-800/90 text-gray-100 border-gray-700 hover:border-indigo-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-indigo-500"
              } shadow-sm`}
              placeholder="Y axis label"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Input Sections */}
      <div className="transition-all duration-300">
        {/* Manual Input */}
        {inputMethod === "manual" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                X Values (comma separated)
              </label>
              <input
                type="text"
                value={safeLabels.join(", ")}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  if (rawValue.slice(-1) !== ",") {
                    setLabels(
                      rawValue
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s !== "")
                    );
                  } else {
                    setLabels([...safeLabels, ""]);
                  }
                }}
                onBlur={() => {
                  if (safeLabels[safeLabels.length - 1] === "") {
                    setLabels(safeLabels.slice(0, -1));
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-gray-800/90 text-gray-100 border-gray-700"
                    : "bg-white text-gray-700 border-gray-300"
                } shadow-sm`}
                placeholder="e.g., Jan, Feb, Mar, Apr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                Y Values (comma separated)
              </label>
              <input
                type="text"
                value={safeDataValues.join(",")}
                onChange={(e) => {
                  const newValues = e.target.value
                    .split(",")
                    .map((n) => Number(n.trim()))
                    .filter((n) => !isNaN(n));
                  handleManualDataChange(newValues);
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-gray-800/90 text-gray-100 border-gray-700"
                    : "bg-white text-gray-700 border-gray-300"
                } shadow-sm`}
                placeholder="e.g., 10, 20, 30, 40"
              />
            </div>
          </div>
        )}

        {/* CSV Upload */}
        {inputMethod === "csv" && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Upload CSV File
            </label>
            <div
              className={`flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                isDarkMode
                  ? "border-gray-700 hover:border-indigo-500 bg-gray-800/90"
                  : "border-gray-300 hover:border-indigo-500 bg-white"
              }`}
            >
              <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mb-3 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CSV files only (MAX. 2MB)
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* JSON Input */}
        {inputMethod === "json" && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Enter JSON Data
            </label>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-800/90 text-gray-100 border-gray-700 font-mono"
                  : "bg-white text-gray-700 border-gray-300 font-mono"
              } shadow-sm`}
              rows="6"
              placeholder={`Paste your JSON data here\nExample:\n{\n  "labels": ["Jan", "Feb", "Mar"],\n  "datasets": [{\n    "label": "Sales",\n    "data": [12, 19, 3]\n  }]\n}`}
            />
            <button
              onClick={handleJsonData}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Parse JSON Data
            </button>
          </div>
        )}

        {/* Database Fetch */}
        {inputMethod === "database" && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Database Connection
            </label>
            <div className="flex">
              <input
                type="text"
                value={databaseLink}
                onChange={(e) => setDatabaseLink(e.target.value)}
                className={`flex-grow px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-gray-800/90 text-gray-100 border-gray-700"
                    : "bg-white text-gray-700 border-gray-300"
                } shadow-sm`}
                placeholder="Enter database API endpoint"
              />
              <button
                onClick={handleDatabaseFetch}
                className="px-4 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
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
                Fetch
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Note: Ensure your API endpoint returns data in the correct format
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          className={`p-3 text-sm rounded-lg ${
            isDarkMode
              ? "bg-red-900/50 text-red-100"
              : "bg-red-100 text-red-800"
          }`}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default DataInputPanel;
