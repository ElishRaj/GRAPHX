import React, { useState, useCallback } from "react";
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
} from "chart.js";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Scatter,
} from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Filler
);

// Generate random data for each chart
const generateRandomData = (modelId) => {
  if (modelId === 7 || modelId === 8) {
    return Array.from({ length: 5 }, () => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    }));
  }
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
};

// Define chart names
const chartNames = [
  "Bar Chart",
  "Line Chart",
  "Pie Chart",
  "Doughnut Chart",
  "Radar Chart",
  "Polar Area Chart",
  "Multi-Series Area Chart",
  "Scatter Chart",
  "Horizontal Bar Chart",
  "Bar with Line Chart",
  "Stacked Bar Chart",
  "Line-Scatter Hybrid Chart",
];

// Premium models (7, 8, 10, 12)
const premiumModels = [7, 8, 10, 12];

// Chart Models Component
const ChartModels = React.memo(({ modelId, chartData, isDarkMode }) => {
  const gridColor = isDarkMode
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(0, 0, 0, 0.1)";
  const textColor = isDarkMode ? "white" : "black";

  const commonOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          padding: 10,
        },
      },
    },
  };

  const gridOptions = {
    ...commonOptions,
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, padding: 10, backdropColor: "transparent" },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, padding: 10, backdropColor: "transparent" },
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 8,
        hoverRadius: 12,
        hitRadius: 15,
      },
    },
  };

  const polarOptions = {
    ...commonOptions,
    scales: {
      r: {
        grid: { color: gridColor },
        ticks: { color: textColor, backdropColor: "rgba(0, 0, 0, 0)" },
      },
    },
  };

  // Render different chart types
  switch (modelId) {
    case 1:
      return (
        <div style={{ height: "300px" }}>
          <Bar data={chartData} options={gridOptions} />
        </div>
      );
    case 2: {
      const randomData = generateRandomData(7);
      const dataValues = [12, 19, 3, 5, 2];
      return (
        <div style={{ height: "300px" }}>
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Dataset 1",
                  data: dataValues,
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 2,
                  borderDash: [8, 4], // Proper borderDash configuration
                  tension: 0.1,
                },

                {
                  label: "Profit",
                  data: randomData.map((point) => point.x),
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderWidth: 5,
                  tension: 0.4,
                  borderDash: [5, 5],
                },
                {
                  label: "Expenses",
                  data: randomData.map((point) => point.y),
                  borderColor: "rgba(255, 206, 86, 1)",
                  backgroundColor: "rgba(255, 206, 86, 0.2)",
                  borderWidth: 6,
                  tension: 0.4,
                },
              ],
            }}
            options={gridOptions}
          />
        </div>
      );
    }
    case 3:
      return (
        <div style={{ height: "300px" }}>
          <Pie
            data={chartData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                legend: {
                  labels: {
                    color: textColor,
                  },
                },
              },
              cutout: 0, // Proper pie chart with no hole
            }}
          />
        </div>
      );
    case 4:
      return (
        <div style={{ height: "400px" }}>
          <Doughnut
            data={chartData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                legend: {
                  labels: {
                    color: textColor,
                  },
                },
              },
              cutout: "50%", // Proper doughnut chart
            }}
          />
        </div>
      );
    case 5:
      return (
        <div style={{ height: "400px" }}>
          <Radar data={chartData} options={polarOptions} />
        </div>
      );
    case 6:
      return (
        <div style={{ height: "400px" }}>
          <PolarArea data={chartData} options={polarOptions} />
        </div>
      );
    case 7: {
      const randomData = generateRandomData(7);
      return (
        <div style={{ height: "300px" }}>
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Dataset 1",
                  data: randomData.map(
                    (point) =>
                      point.x + Math.floor(Math.random() * (100 - 10 + 1)) + 10
                  ),
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(25, 99, 132, 0.5)", // Increased opacity
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true, // Proper area fill
                  borderDash: [15, 19],
                },
                {
                  label: "Profit",
                  data: randomData.map((point) => point.x),
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true,
                  borderDash: [5, 5],
                },
                {
                  label: "Expenses",
                  data: randomData.map((point) => point.y),
                  borderColor: "rgba(255, 206, 86, 1)",
                  backgroundColor: "rgba(255, 206, 86, 0.5)",
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            options={{
              ...gridOptions,
              plugins: {
                ...gridOptions.plugins,
                filler: {
                  propagate: true, // Proper area chart filling
                },
              },
            }}
          />
        </div>
      );
    }
    case 8: {
      const randomData = generateRandomData(8);
      const extraDots = generateRandomData(8);
      return (
        <div style={{ height: "300px" }}>
          <Scatter
            data={{
              datasets: [
                {
                  label: "Scatter Dataset 1",
                  data: randomData,
                  backgroundColor: "rgba(255, 99, 132, 0.6)",
                  borderColor: "rgba(255, 199, 132, 1)",
                  borderWidth: 4,
                  pointRadius: 20,
                  pointHoverRadius: 15,
                },
                {
                  label: "Extra Dots",
                  data: extraDots,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(154, 192, 135, 1)",
                  borderWidth: 4,
                  pointRadius: 20,
                  pointHoverRadius: 18,
                },
              ],
            }}
            options={{
              ...gridOptions,
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                  grid: { color: gridColor },
                  ticks: { color: textColor },
                },
                y: {
                  grid: { color: gridColor },
                  ticks: { color: textColor },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      );
    }
    case 9:
      return (
        <div style={{ height: "300px" }}>
          <Bar data={chartData} options={{ ...gridOptions, indexAxis: "y" }} />
        </div>
      );
    case 10:
      return (
        <div style={{ height: "300px" }}>
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [
                chartData.datasets[0],
                {
                  ...chartData.datasets[0],
                  type: "line",
                  label: "Revenue (Modified)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderWidth: 3,
                  tension: 0.4,
                  fill: false,
                  pointRadius: 5,
                  borderDash: [5, 5],
                  data: chartData.datasets[0].data.map((val) => val * 1.2),
                },
              ],
            }}
            options={{
              ...commonOptions,
              animation: {
                duration: 1000,
                easing: "easeInOutQuart",
              },
              scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor } },
                y: {
                  grid: { color: gridColor },
                  ticks: { color: textColor },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      );
    case 11:
      return (
        <div style={{ height: "300px" }}>
          <Bar
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May"],
              datasets: [
                {
                  ...chartData.datasets[0],
                  label: "Dataset 1",
                  data: chartData.datasets[0].data.map((val) => val * 1.2),
                  backgroundColor: "rgba(75,75,192,0.5)",
                  borderColor: "rgba(75,75,192,1)",
                  borderWidth: 1,
                },
                {
                  label: "Dataset 2",
                  data: chartData.datasets[0].data.map((val) => val * 1.2),
                  backgroundColor: "rgba(192,75,75,0.5)",
                  borderColor: "rgba(192,75,75,1)",
                  borderWidth: 1,
                },
                {
                  label: "Dataset 3",
                  data: chartData.datasets[0].data.map((val) => val * 1.2),
                  backgroundColor: "rgba(75,192,75,0.5)",
                  borderColor: "rgba(75,192,75,1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              ...gridOptions,
              scales: {
                x: {
                  stacked: true,
                  grid: { color: gridColor },
                  ticks: {
                    color: textColor,
                    padding: 10,
                    backdropColor: "transparent",
                  },
                },
                y: {
                  stacked: true,
                  grid: { color: gridColor },
                  ticks: {
                    color: textColor,
                    padding: 10,
                    backdropColor: "transparent",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      );
    case 12: {
      const randomData = generateRandomData(7);
      return (
        <div style={{ height: "300px", textAlign: "center" }}>
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Profit",
                  data: randomData.map((point) => point.x),
                  borderColor: "rgba(255, 199, 132, 1)",
                  borderWidth: 8,
                  tension: 0.4,
                  borderDash: [15, 5],
                },
                {
                  type: "scatter",
                  label: "Scatter Dataset",
                  data: generateRandomData(7),
                  backgroundColor: "rgba(192,75,75,0.6)",
                },
              ],
            }}
            options={{
              ...commonOptions,
              scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor } },
                y: {
                  grid: { color: gridColor },
                  ticks: { color: textColor },
                  beginAtZero: true,
                },
              },
              elements: {
                point: {
                  radius: 10,
                  hoverRadius: 20,
                  hitRadius: 15,
                  backgroundColor: "red",
                  borderColor: "pink",
                  borderWidth: 4,
                  pointStyle: "star",
                },
              },
            }}
          />
        </div>
      );
    }
    default:
      return <div>No Chart Available</div>;
  }
});

// Main VisualizeData Component
const VisualizeData = ({ isDarkMode, premier }) => {
  console.log(premier)
  const navigate = useNavigate();
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const initialData = Array.from({ length: 12 }, (_, index) => {
    const modelId = index + 1;
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: "Dataset",
          data: generateRandomData(modelId),
          backgroundColor: [
            "rgba(75,192,192,0.2)",
            "rgba(192,75,75,0.2)",
            "rgba(75,75,192,0.2)",
            "rgba(192,192,75,0.2)",
            "rgba(75,192,75,0.2)",
          ],
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };
  });

  const [chartsData, setChartsData] = useState(initialData);

  const handleHover = useCallback((index) => {
    setChartsData((prevData) => {
      const newData = [...prevData];
      const modelId = index + 1;
      newData[index] = {
        ...newData[index],
        datasets: newData[index].datasets.map((dataset, i) => {
          if (i === 0) {
            return {
              ...dataset,
              data: generateRandomData(modelId),
            };
          }
          return dataset;
        }),
      };
      return newData;
    });
  }, []);

  const handleChartClick = (chartData, modelId) => {
    setSelectedModel(modelId);

    // Check if the model is premium and user doesn't have premium access
    if (premiumModels.includes(modelId)) {
      if (!premier) {
        setShowPremiumAlert(true);
        return;
      }
    }

    const chartTypeMap = {
      1: "bar",
      2: "line",
      3: "pie",
      4: "doughnut",
      5: "radar",
      6: "polarArea",
      7: "line",
      8: "scatter",
      9: "bar",
      10: "bar",
      11: "bar",
      12: "line",
    };

    const chartVariants = {
      9: "horizontal",
      10: "combo",
      11: "stacked",
      12: "hybrid",
    };

    // Common style settings
    const gridColor = isDarkMode
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(0, 0, 0, 0.1)";
    const textColor = isDarkMode ? "white" : "black";

    const commonOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: textColor,
            padding: 10,
          },
        },
      },
    };

    const gridOptions = {
      ...commonOptions,
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            padding: 10,
            backdropColor: "transparent",
          },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            padding: 10,
            backdropColor: "transparent",
          },
          beginAtZero: true,
        },
      },
      elements: { point: { radius: 8, hoverRadius: 12, hitRadius: 15 } },
    };

    const polarOptions = {
      ...commonOptions,
      scales: {
        r: {
          grid: { color: gridColor },
          ticks: { color: textColor, backdropColor: "rgba(0, 0, 0, 0)" },
        },
      },
    };

    // Generate random data for dynamic charts
    const randomData = generateRandomData(7);
    const extraDots = generateRandomData(8);

    // Create specific data and options for each chart type
    let specificData = {};
    let specificOptions = {};

    switch (modelId) {
      case 1: // Bar Chart
        specificData = chartData;
        specificOptions = gridOptions;
        break;

      case 2: // Line Chart
        specificData = {
          labels: chartData.labels,
          datasets: [
            {
              data: randomData.map(
                (point) =>
                  point.x + Math.floor(Math.random() * (100 - 10 + 1)) + 10
              ),
              backgroundColor: "rgba(25, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 3,
              tension: 0.4,
              borderDash: [15, 19],
            },
            {
              label: "Profit",
              data: randomData.map((point) => point.x),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 5,
              tension: 0.4,
              borderDash: [5, 5],
            },
            {
              label: "Expenses",
              data: randomData.map((point) => point.y),
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 6,
              tension: 0.4,
            },
          ],
        };
        specificOptions = gridOptions;
        break;

      case 3: // Pie Chart
        specificData = chartData;
        specificOptions = {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          cutout: 0, // Proper pie chart
        };
        break;

      case 4: // Doughnut Chart
        specificData = chartData;
        specificOptions = {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          cutout: "50%", // Proper doughnut chart
        };
        break;

      case 5: // Radar Chart
        specificData = chartData;
        specificOptions = polarOptions;
        break;

      case 6: // Polar Area Chart
        specificData = chartData;
        specificOptions = polarOptions;
        break;

      case 7: // Multi-Series Area Chart
        specificData = {
          labels: chartData.labels,
          datasets: [
            {
              label: "Dataset 1",
              data: randomData.map(
                (point) =>
                  point.x + Math.floor(Math.random() * (100 - 10 + 1)) + 10
              ),
              backgroundColor: "rgba(25, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              borderDash: [15, 19],
            },
            {
              label: "Profit",
              data: randomData.map((point) => point.x),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              borderDash: [5, 5],
            },
            {
              label: "Expenses",
              data: randomData.map((point) => point.y),
              backgroundColor: "rgba(255, 206, 86, 0.5)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        };
        specificOptions = {
          ...gridOptions,
          plugins: {
            ...gridOptions.plugins,
            filler: {
              propagate: true,
            },
          },
        };
        break;

      case 8: // Scatter Chart
        specificData = {
          datasets: [
            {
              label: "Scatter Dataset 1",
              data: randomData,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 199, 132, 1)",
              borderWidth: 4,
              pointRadius: 20,
              pointHoverRadius: 15,
            },
            {
              label: "Extra Dots",
              data: extraDots,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(154, 192, 135, 1)",
              borderWidth: 4,
              pointRadius: 20,
              pointHoverRadius: 18,
            },
          ],
        };
        specificOptions = {
          ...gridOptions,
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              grid: { color: gridColor },
              ticks: { color: textColor },
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor },
              beginAtZero: true,
            },
          },
        };
        break;

      case 9: // Horizontal Bar Chart
        specificData = chartData;
        specificOptions = { ...gridOptions, indexAxis: "y" };
        break;

      case 10: // Bar with Line Chart
        specificData = {
          labels: chartData.labels,
          datasets: [
            chartData.datasets[0],
            {
              ...chartData.datasets[0],
              type: "line",
              label: "Revenue (Modified)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              pointRadius: 5,
              borderDash: [5, 5],
              data: chartData.datasets[0].data.map((val) => val * 1.2),
            },
          ],
        };
        specificOptions = {
          ...commonOptions,
          animation: {
            duration: 1000,
            easing: "easeInOutQuart",
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor },
              beginAtZero: true,
            },
          },
        };
        break;

      case 11: // Stacked Bar Chart
        specificData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            {
              ...chartData.datasets[0],
              label: "Dataset 1",
              data: chartData.datasets[0].data.map((val) => val * 1.2),
              backgroundColor: "rgba(75,75,192,0.5)",
              borderColor: "rgba(75,75,192,1)",
              borderWidth: 1,
            },
            {
              label: "Dataset 2",
              data: chartData.datasets[0].data.map((val) => val * 1.2),
              backgroundColor: "rgba(192,75,75,0.5)",
              borderColor: "rgba(192,75,75,1)",
              borderWidth: 1,
            },
            {
              label: "Dataset 3",
              data: chartData.datasets[0].data.map((val) => val * 1.2),
              backgroundColor: "rgba(75,192,75,0.5)",
              borderColor: "rgba(75,192,75,1)",
              borderWidth: 1,
            },
          ],
        };
        specificOptions = {
          ...gridOptions,
          scales: {
            x: {
              stacked: true,
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                padding: 10,
                backdropColor: "transparent",
              },
            },
            y: {
              stacked: true,
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                padding: 10,
                backdropColor: "transparent",
              },
              beginAtZero: true,
            },
          },
        };
        break;

      case 12: // Line-Scatter Hybrid Chart
        specificData = {
          labels: chartData.labels,
          datasets: [
            {
              label: "Profit",
              data: randomData.map((point) => point.x),
              backgroundColor: "rgba(255, 199, 132, 1)",
              borderColor: "rgba(255, 199, 132, 1)",
              borderWidth: 8,
              tension: 0.4,
              borderDash: [15, 5],
            },
            {
              type: "scatter",
              label: "Scatter Dataset",
              data: generateRandomData(7),
              backgroundColor: "rgba(192,75,75,0.6)",
            },
          ],
        };
        specificOptions = {
          ...commonOptions,
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor },
              beginAtZero: true,
            },
          },
          elements: {
            point: {
              radius: 10,
              hoverRadius: 20,
              hitRadius: 15,
              backgroundColor: "red",
              borderColor: "pink",
              borderWidth: 4,
              pointStyle: "star",
            },
          },
        };
        break;

      default:
        specificData = chartData;
        specificOptions = gridOptions;
    }

    navigate("/workspace", {
      state: {
        initialData: specificData,
        chartType: chartTypeMap[modelId],
        chartVariant: chartVariants[modelId] || "standard",
        modelId: modelId,
        chartOptions: specificOptions,
      },
    });
  };

  return (
    <div
      className={`w-full mx-auto px-4 py-8 transition-all duration-300 mt-[-20px] ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Premium Alert Modal */}
      {showPremiumAlert && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg max-w-md w-full mx-4 transition-all duration-500 ease-in-out ${
              isDarkMode
                ? "bg-gray-800/90 shadow-[0_0_15px_rgba(159,122,234,0.3)] hover:shadow-[0_0_30px_rgba(159,122,234,0.5)]"
                : "bg-white/90 shadow-[0_0_15px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
            } ${
              showPremiumAlert
                ? "animate-[fadeIn_0.3s_ease-in-out_forwards,scaleIn_0.3s_ease-in-out_forwards]"
                : "animate-[fadeOut_0.3s_ease-in-out_forwards,scaleOut_0.3s_ease-in-out_forwards]"
            }`}
            style={{
              animation: showPremiumAlert
                ? "fadeIn 0.3s ease-in-out forwards, scaleIn 0.3s ease-in-out forwards"
                : "fadeOut 0.3s ease-in-out forwards, scaleOut 0.3s ease-in-out forwards",
            }}
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
          </div>
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes fadeOut {
              from {
                opacity: 1;
              }
              to {
                opacity: 0;
              }
            }
            @keyframes scaleIn {
              from {
                transform: scale(0.95);
              }
              to {
                transform: scale(1);
              }
            }
            @keyframes scaleOut {
              from {
                transform: scale(1);
              }
              to {
                transform: scale(0.95);
              }
            }
          `}</style>
        </div>
      )}

      <div className="flex flex-col items-start md:items-center">
        <h1 className="text-left w-full text-5xl font-bold mb-4">
          Visualize Your Data
        </h1>
        <h2 className="text-center text-4xl font-semibold mb-8 text-purple-600 underline underline-offset-8 decoration-purple-400">
          Available Models
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {chartsData.map((chartData, index) => {
          const modelId = index + 1;
          const isPremium = premiumModels.includes(modelId);

          return (
            <div
              key={index}
              className="relative group border dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 mt-6"
              onMouseEnter={() => handleHover(index)}
              onClick={() => handleChartClick(chartData, modelId)}
            >
              {/* Golden star (appears only on hover for premium models) */}
              {isPremium && (
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400 drop-shadow-sm"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}

              {/* Chart name label */}
              <div className="absolute top-0 right-0 bg-white/80 dark:bg-gray-800/80 py-1 px-2 rounded-bl-md shadow-sm text-sm font-semibold text-gray-800 dark:text-gray-200">
                {chartNames[index]}
              </div>

              {/* Chart content */}
              <div className="p-2">
                <ChartModels
                  modelId={modelId}
                  chartData={chartData}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisualizeData;
