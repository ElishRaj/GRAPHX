import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";

// Register Chart.js components
Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement
);

const ChartWrapper = ({ graphData, isDarkMode, premier }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (canvasRef.current && graphData) {
      try {
        const textColor = isDarkMode ? "#e5e7eb" : "#374151";
        const gridColor = isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)";

        const ctx = canvasRef.current.getContext("2d");

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: graphData.chartDetails.chartConfig.type,
          data: graphData.chartDetails.chartConfig.data,
          options: {
            ...graphData.chartDetails.chartConfig.options,
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000,
              easing: "easeOutQuart",
            },
            plugins: {
              ...graphData.chartDetails.chartConfig.options.plugins,
              legend: {
                ...graphData.chartDetails.chartConfig.options.plugins?.legend,
                labels: {
                  color: textColor,
                },
              },
              tooltip: {
                ...graphData.chartDetails.chartConfig.options.plugins?.tooltip,
                titleColor: textColor,
                bodyColor: textColor,
              },
            },
            scales: {
              ...graphData.chartDetails.chartConfig.options.scales,
              x: {
                ...graphData.chartDetails.chartConfig.options.scales?.x,
                grid: {
                  ...graphData.chartDetails.chartConfig.options.scales?.x?.grid,
                  color: gridColor,
                },
                ticks: {
                  ...graphData.chartDetails.chartConfig.options.scales?.x
                    ?.ticks,
                  color: textColor,
                },
              },
              y: {
                ...graphData.chartDetails.chartConfig.options.scales?.y,
                grid: {
                  ...graphData.chartDetails.chartConfig.options.scales?.y?.grid,
                  color: gridColor,
                },
                ticks: {
                  ...graphData.chartDetails.chartConfig.options.scales?.y
                    ?.ticks,
                  color: textColor,
                },
              },
            },
          },
        });

        // Add watermark if not premier
        if (!premier) {
          const chart = chartInstance.current;
          const ctx = chart.ctx;

          // Save the current state
          ctx.save();

          // Set watermark properties
          ctx.globalAlpha = 0.2;
          ctx.font = "bold 48px Arial";
          ctx.fillStyle = isDarkMode ? "#e5e7eb" : "#374151";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Get chart center coordinates
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

          // Rotate the context if needed (optional)
          ctx.rotate((-20 * Math.PI) / 180);

          // Draw the watermark
          ctx.fillText("DataViz Free", centerX, centerY);

          // Restore the context
          ctx.restore();
        }
      } catch (error) {
        console.error("Chart rendering error:", error);
        const ctx = canvasRef.current.getContext("2d");
        ctx.fillStyle = isDarkMode ? "#e5e7eb" : "#374151";
        ctx.font = "16px Arial";
        ctx.fillText("Error rendering chart", 10, 50);
        if (error.message) {
          ctx.fillText(error.message, 10, 80);
        }
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [graphData, isDarkMode, premier]);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        data-chart-id={graphData?.serial}
      />
    </div>
  );
};

const PremiumPopup = ({ onClose, onUpgrade, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center  bg-opacity-30 backdrop-blur-sm">
      <div
        className={`relative p-8 rounded-2xl max-w-md w-full mx-4 ${
          isDarkMode ? "bg-gray-800/90" : "bg-white/90"
        } border ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        } shadow-xl`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h3
            className={`text-lg font-medium mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Premium Feature
          </h3>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Downloading without watermark is a premium feature. Upgrade to
            remove watermarks and unlock all premium features.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              Close
            </button>
            <button
              onClick={onUpgrade}
              className={`px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md`}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GraphManager = ({ isDarkMode, premier }) => {
  console.log("graphmanever",premier)
  const { isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();

  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animationState, setAnimationState] = useState("idle");
  const [notification, setNotification] = useState(null);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [graphToDownload, setGraphToDownload] = useState(null);
  const cardRefs = useRef({});
  const modalRef = useRef(null);
  const containerRef = useRef(null);
  const notificationTimeout = useRef(null);
  const scrollObserver = useRef(null);
  const animationFrameId = useRef(null);

  // Close icon component
  const CloseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Show notification
  const showNotification = (message, type = "success") => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }

    setNotification({ message, type });

    notificationTimeout.current = setTimeout(() => {
      setNotification(null);
      notificationTimeout.current = null;
    }, 3000);
  };

  // Fetch charts from API
  useEffect(() => {
    const fetchCharts = async () => {
      if (!isAuthenticated || !userData?.email) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:30000/chartRoutes/charts/${userData.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch charts");
        }
        const data = await response.json();
        console.log("Fetched charts data:", data);
        setGraphs(data.charts || []);
      } catch (err) {
        console.error("Error fetching charts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, [isAuthenticated, userData?.email]);

  // Initialize scroll animations
  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const containerTop = containerRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (containerTop < windowHeight && containerTop > -windowHeight) {
          const cards = containerRef.current.querySelectorAll(".chart-card");
          cards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;

            if (
              !card.classList.contains("animated") &&
              cardTop < windowHeight * 0.85
            ) {
              card.classList.add("animated", "animate-fade-in-up");
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }
          });
        }
      });
    };

    const initIntersectionObserver = () => {
      if (scrollObserver.current) {
        scrollObserver.current.disconnect();
      }

      scrollObserver.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const card = entry.target;
              if (!card.classList.contains("animated")) {
                card.classList.add("animated", "animate-fade-in-up");
              }
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        }
      );

      if (containerRef.current) {
        const cards = containerRef.current.querySelectorAll(".chart-card");
        cards.forEach((card) => {
          scrollObserver.current.observe(card);
        });
      }
    };

    const initializeVisibleCards = () => {
      if (!containerRef.current) return;

      const cards = containerRef.current.querySelectorAll(".chart-card");
      cards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (cardTop < windowHeight * 0.85) {
          card.classList.add("animate-fade-in-up", "animated");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    initIntersectionObserver();
    initializeVisibleCards();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollObserver.current) {
        scrollObserver.current.disconnect();
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
    };
  }, [graphs, viewMode, selectedGraph]);

  const handleCardClick = (graph) => {
    handleView(graph);
  };

  const handleView = (graph) => {
    setAnimationState("zooming-in");
    setSelectedGraph(graph);

    setTimeout(() => {
      setViewMode("single");
      setAnimationState("idle");
    }, 300);
  };

  const handleClose = () => {
    setAnimationState("zooming-out");

    setTimeout(() => {
      setViewMode("list");
      setSelectedGraph(null);
      setAnimationState("idle");
    }, 300);
  };

  const handleDelete = async (graphId) => {
    try {
      const response = await fetch(
        `http://localhost:30000/chartRoutes/delete/${userData.email}/${graphId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete chart");
      }

      setGraphs(graphs.filter((graph) => graph.serial !== graphId));
      if (selectedGraph?.serial === graphId) {
        handleClose();
      }

      showNotification("Chart deleted successfully!");
    } catch (err) {
      console.error("Error deleting chart:", err);
      showNotification("Failed to delete chart", "error");
    }
  };

  const handleDownload = (graphId) => {
    if (!premier) {
      setGraphToDownload(graphId);
      setShowPremiumPopup(true);
      return;
    }

    performDownload(graphId);
  };

  const performDownload = (graphId) => {
    try {
      // Find the chart canvas
      const chartCanvas = document.querySelector(
        `canvas[data-chart-id="${graphId}"]`
      );

      if (!chartCanvas) {
        throw new Error("Chart canvas not found");
      }

      // Create a temporary canvas
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      // Set same dimensions
      tempCanvas.width = chartCanvas.width;
      tempCanvas.height = chartCanvas.height;

      // Generate random pastel background
      const hue = Math.floor(Math.random() * 360);
      const bgColor = `hsl(${hue}, 80%, 90%)`;

      // Fill background
      tempCtx.fillStyle = bgColor;
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the chart
      tempCtx.drawImage(chartCanvas, 0, 0);

      // Add watermark if not premier
      if (!premier) {
        tempCtx.globalAlpha = 0.2;
        tempCtx.font = "bold 48px Arial";
        tempCtx.fillStyle = isDarkMode ? "#e5e7eb" : "#374151";
        tempCtx.textAlign = "center";
        tempCtx.textBaseline = "middle";
        tempCtx.fillText(
          "DataViz Free",
          tempCanvas.width / 2,
          tempCanvas.height / 2
        );
        tempCtx.globalAlpha = 1;
      }

      // Add footer watermark
      tempCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
      tempCtx.font = "16px Arial";
      tempCtx.textAlign = "center";
      tempCtx.fillText(
        "Created with DataViz",
        tempCanvas.width / 2,
        tempCanvas.height - 20
      );

      // Create download link
      const link = document.createElement("a");
      link.download = `chart-${graphId}-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      link.href = tempCanvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("Chart downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      showNotification("Failed to download chart", "error");
    }
  };

  const handleEdit = (graph) => {
    navigate("/workspace", {
      state: {
        chartType: graph.chartDetails.chartConfig.type,
        chartData: graph.chartDetails.chartConfig.data,
        chartOptions: graph.chartDetails.chartConfig.options,
        isEdit: true,
        chartId: graph.serial,
      },
    });
  };

  const handleUpgrade = () => {
    setShowPremiumPopup(false);
    navigate("/prices");
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p
            className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Loading your charts...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Error Loading Charts
          </h3>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white transition-colors`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (graphs.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center p-6 max-w-md mx-auto">
          <div
            className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            No Charts Found
          </h3>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            You haven't created any charts yet. Start by creating a new chart in
            the workspace.
          </p>
          <button
            onClick={() => navigate("/workspace")}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white transition-colors`}
          >
            Create New Chart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center justify-between space-x-4 transform transition-all duration-300 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
            style={{
              animation: "slideIn 0.3s ease-out forwards",
              maxWidth: "400px",
            }}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {showPremiumPopup && (
          <PremiumPopup
            onClose={() => {
              setShowPremiumPopup(false);
              setGraphToDownload(null);
            }}
            onUpgrade={handleUpgrade}
            isDarkMode={isDarkMode}
          />
        )}

        {viewMode === "list" ? (
          <div className="space-y-8" ref={containerRef}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 animate-gradient">
                My Saved Charts
              </h1>
              <p
                className={`text-lg transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                View and manage your saved data visualizations
              </p>
            </div>

            <div className="flex flex-col gap-12">
              {graphs.map((graph, index) => (
                <div
                  key={graph.serial}
                  data-graph-id={graph.serial}
                  ref={(el) => (cardRefs.current[graph.serial] = el)}
                  className={`
                    chart-card relative rounded-xl overflow-visible
                    ${isDarkMode ? "bg-gray-800" : "bg-white"}
                    ${
                      hoveredCard === graph.serial
                        ? "shadow-[0_10px_40px_-15px_rgba(99,102,241,0.5)] transform -translate-y-1"
                        : "shadow-lg"
                    }
                    hover:border-transparent
                    mt-16
                    cursor-pointer
                  `}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onMouseEnter={() => setHoveredCard(graph.serial)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleCardClick(graph)}
                >
                  <div className="absolute -top-8 left-0 right-0 flex justify-center">
                    <div
                      className={`
                        px-6 py-3 rounded-lg max-w-[90%]
                        ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}
                        border ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        }
                        shadow-md
                        transition-all duration-300
                      `}
                    >
                      <h2 className="text-lg font-bold text-center truncate">
                        {graph.chartDetails.metadata.name}
                      </h2>
                    </div>
                  </div>

                  <div className="h-[32rem] w-full px-6 py-8 pt-16">
                    <ChartWrapper
                      graphData={graph}
                      isDarkMode={isDarkMode}
                      premier={premier}
                    />
                  </div>

                  <div
                    className={`
                    absolute bottom-6 left-0 right-0 flex justify-center gap-3 
                    transition-all duration-300 
                    ${
                      hoveredCard === graph.serial
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }
                  `}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(graph);
                      }}
                      className={`
                        p-2 rounded-full text-white shadow-md
                        bg-gradient-to-br from-indigo-500 to-purple-500
                        hover:from-indigo-600 hover:to-purple-600
                        transition-all duration-300
                      `}
                      title="View"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(graph);
                      }}
                      className={`
                        p-2 rounded-full text-white shadow-md
                        bg-gradient-to-br from-yellow-500 to-amber-500
                        hover:from-yellow-600 hover:to-amber-600
                        transition-all duration-300
                      `}
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(graph.serial);
                      }}
                      className={`
                        p-2 rounded-full text-white shadow-md
                        bg-gradient-to-br from-pink-500 to-rose-500
                        hover:from-pink-600 hover:to-rose-600
                        transition-all duration-300
                      `}
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(graph.serial);
                      }}
                      className={`
                        p-2 rounded-full text-white shadow-md
                        bg-gradient-to-br from-green-500 to-emerald-500
                        hover:from-green-600 hover:to-emerald-600
                        transition-all duration-300
                      `}
                      title="Download"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={modalRef}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-15 backdrop-blur-sm transition-opacity duration-300 ${
              animationState === "zooming-in" ? "opacity-0" : "opacity-100"
            }`}
          >
            <div
              className={`relative w-full max-w-6xl h-full max-h-[90vh] rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-[0_25px_50px_-12px_rgba(99,102,241,0.25)] transition-all duration-300 ease-out ${
                animationState === "zooming-in"
                  ? "scale-95 opacity-0"
                  : animationState === "zooming-out"
                  ? "scale-95 opacity-0"
                  : "scale-100 opacity-100"
              }`}
              onDoubleClick={handleClose}
            >
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 z-10 p-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-lg"
                title="Close"
              >
                <CloseIcon />
              </button>

              <div className="h-full w-full p-6">
                <div className="mb-4 text-center">
                  <h2 className="text-2xl font-bold">
                    {selectedGraph?.chartDetails.metadata.name}
                  </h2>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Saved on{" "}
                    {new Date(
                      selectedGraph?.chartDetails.metadata.savedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="h-[calc(100%-80px)]">
                  <ChartWrapper
                    graphData={selectedGraph}
                    isDarkMode={isDarkMode}
                    premier={premier}
                  />
                </div>
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(selectedGraph);
                  }}
                  className={`
                    px-5 py-2.5 rounded-lg text-white flex items-center gap-2 
                    bg-gradient-to-br from-yellow-500 to-amber-500
                    hover:from-yellow-600 hover:to-amber-600
                    transition-all duration-300 shadow-md
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedGraph?.serial);
                  }}
                  className={`
                    px-5 py-2.5 rounded-lg text-white flex items-center gap-2 
                    bg-gradient-to-br from-pink-500 to-rose-500
                    hover:from-pink-600 hover:to-rose-600
                    transition-all duration-300 shadow-md
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(selectedGraph?.serial);
                  }}
                  className={`
                    px-5 py-2.5 rounded-lg text-white flex items-center gap-2 
                    bg-gradient-to-br from-green-500 to-emerald-500
                    hover:from-green-600 hover:to-emerald-600
                    transition-all duration-300 shadow-md
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphManager;
