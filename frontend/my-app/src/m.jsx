import React, { useState, useMemo, useEffect } from "react";
import { Chart as ChartJS, Filler, registerables } from "chart.js";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import NavigationBar from "./NavigationBar";
import DataInputPanel from "./Datainput";
import DisplayChart from "./dipalychart";
import LegendSettings from "./legendsettings";
import AppearanceSettings from "./apparsettings";
import AnimationSettings from "./animationssetting";
import GridSettings from "./gridsetting";
import TextSettings from "./textfont";
import TooltipSettings from "./tooltip";
import TicksSettings from "./ticks.";
import ColumnSelectionModal from "./coloumnsection";

// Register Chart.js components with Filler plugin
ChartJS.register(Filler, ...registerables);

const Workspace = ({ isDarkMode, premier }) => {
  const location = useLocation();
  const {
    initialData,
    chartType: initialChartType,
    chartVariant,
    modelId,
    chartOptions: initialChartOptions,
    borderSettings = {},
  } = location.state || {};

  // Track if we've modified anything from the initial state
  const [hasModified, setHasModified] = useState(false);

  // Chart configuration state
  const [activeCustomization, setActiveCustomization] =
    useState("dataSettings");
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [activeDatasetId, setActiveDatasetId] = useState(null);
  const [chartType, setChartType] = useState(initialChartType || "bar");
  const [currentVariant, setCurrentVariant] = useState(
    chartVariant || "standard"
  );

  // Data state
  const [mainTitle, setMainTitle] = useState(
    initialChartOptions?.plugins?.title?.text || "My Chart"
  );
  const [xLabel, setXLabel] = useState(
    initialChartOptions?.scales?.x?.title?.text || "X Axis"
  );
  const [yLabel, setYLabel] = useState(
    initialChartOptions?.scales?.y?.title?.text || "Y Axis"
  );

  // Data input methods state
  const [inputMethod, setInputMethod] = useState("manual");
  const [jsonData, setJsonData] = useState("");
  const [databaseLink, setDatabaseLink] = useState("");
  const [error, setError] = useState("");

  // CSV Import state
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [uploadedCSV, setUploadedCSV] = useState(null);

  // Helper functions for color generation
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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

  // Generate random colors for datasets or individual bars
  const generateRandomColors = (mode = "dataset") => {
    setDatasets((prevDatasets) => {
      return prevDatasets.map((dataset) => {
        if (mode === "individual") {
          // Generate an array of colors for each data point
          const backgroundColors = dataset.data.map(() => getRandomColor());
          const borderColors = backgroundColors.map((color) =>
            darkenColor(color, 20)
          );

          return {
            ...dataset,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          };
        } else {
          // For dataset mode - one color for all bars
          const backgroundColor = getRandomColor();
          const borderColor = darkenColor(backgroundColor, 20);

          return {
            ...dataset,
            backgroundColor,
            borderColor,
          };
        }
      });
    });
    setHasModified(true);
  };

  // Initialize datasets
  const [datasets, setDatasets] = useState(() => {
    if (initialData?.datasets && !hasModified) {
      return initialData.datasets.map((dataset, index) => ({
        id: uuidv4(),
        labels: initialData.labels || ["Jan", "Feb", "Mar", "Apr", "May"],
        data: dataset.data,
        chartType: dataset.type || initialChartType || "bar",
        xColumn: "",
        yColumn: "",
        name: dataset.label || `Dataset ${index + 1}`,
        backgroundColor: dataset.backgroundColor || getRandomColor(),
        borderColor:
          dataset.borderColor ||
          darkenColor(dataset.backgroundColor || getRandomColor(), 20),
        borderWidth: dataset.borderWidth || 2,
      }));
    }
    return [
      {
        id: uuidv4(),
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        data: [65, 59, 80, 81, 56],
        chartType: initialChartType || "bar",
        xColumn: "",
        yColumn: "",
        name: "Dataset 1",
        backgroundColor: getRandomColor(),
        borderColor: darkenColor(getRandomColor(), 20),
        borderWidth: 2,
      },
    ];
  });

  // Styles configuration with border settings from location
  const [styles, setStyles] = useState(() => ({
    backgroundColor: getRandomColor(),
    borderColor: borderSettings.color || "#ffffff",
    borderWidth: borderSettings.width || 2,
    borderStyle: borderSettings.style || "solid",
    borderDash: borderSettings.dash || [],
    barWidth: 40,
    tension: 0.4,
    cutout: modelId === 3 ? 0 : modelId === 4 ? "50%" : 50,
    rotation: -90,
    circumference: 360,
    yAxisMin: "",
    yAxisMax: "",
    fontColor: isDarkMode ? "#ffffff" : "#374151",
    fontFamily: "Inter",
    titleFontSize: 20,
    axisFontSize: 14,
    animationsEnabled: true,
    animationDuration: 1,
    animationType: "easeInOutQuad",
    borderRadius: 8,
    pointRadius: 4,
    pointHoverRadius: 6,
    showGridX: true,
    showGridY: true,
    gridColor: isDarkMode ? "#4b5563" : "#374151",
    gridLineWidth: 1,
    gridOpacity: 0.5,
    gridSpacing: 5,
    axisColor: isDarkMode ? "#9ca3af" : "#6b7280",
    axisLineWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    legendDisplay: true,
    legendPosition: "top",
    legendPadding: 8,
    legendFontSize: 12,
    legendFontColor: "#3B82F6",
    tooltipBackground: isDarkMode ? "#1f2937" : "#ffffff",
    tooltipBorderColor: isDarkMode ? "#374151" : "#e5e7eb",
    tooltipBorderWidth: 1,
    tooltipCornerRadius: 4,
    tooltipFontColor: isDarkMode ? "#ffffff" : "#111827",
    tooltipFontSize: 14,
    textStyles: {
      title: {
        fontSize: initialChartOptions?.plugins?.title?.font?.size || 20,
        family: initialChartOptions?.plugins?.title?.font?.family || "Arial",
        weight: initialChartOptions?.plugins?.title?.font?.weight || "normal",
        style: initialChartOptions?.plugins?.title?.font?.style || "normal",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      xlab: {
        fontSize: initialChartOptions?.scales?.x?.title?.font?.size || 14,
        family: initialChartOptions?.scales?.x?.title?.font?.family || "Arial",
        weight: initialChartOptions?.scales?.x?.title?.font?.weight || "normal",
        style: initialChartOptions?.scales?.x?.title?.font?.style || "normal",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      ylab: {
        fontSize: initialChartOptions?.scales?.y?.title?.font?.size || 14,
        family: initialChartOptions?.scales?.y?.title?.font?.family || "Arial",
        weight: initialChartOptions?.scales?.y?.title?.font?.weight || "normal",
        style: initialChartOptions?.scales?.y?.title?.font?.style || "normal",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
    },
    ticksStyles: {
      xTicksColor: isDarkMode ? "#ffffff" : "#FF0000",
      yTicksColor: isDarkMode ? "#ffffff" : "#0000FF",
      ticksFontSize: 12,
      ticksFontFamily: "Arial, sans-serif",
      ticksFontStyle: "normal",
    },
    chartBorder: {
      display: borderSettings.display !== false,
      color: borderSettings.color || (isDarkMode ? "#4b5563" : "#e5e7eb"),
      width: borderSettings.width || 1,
      style: borderSettings.style || "solid",
      radius: borderSettings.radius || 8,
    },
  }));

  // Set initial active dataset
  useEffect(() => {
    if (datasets.length > 0 && !activeDatasetId) {
      setActiveDatasetId(datasets[0].id);
    }
  }, [datasets, activeDatasetId]);

  // Get active dataset
  const activeDataset = useMemo(() => {
    return (
      datasets.find((dataset) => dataset.id === activeDatasetId) || datasets[0]
    );
  }, [datasets, activeDatasetId]);

  // Handle nested style changes and mark as modified
  const handleStyleChange = (propertyPath, value) => {
    if (!hasModified) setHasModified(true);

    setStyles((prev) => {
      const newStyles = JSON.parse(JSON.stringify(prev));
      const path = propertyPath.split(".");

      let current = newStyles;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newStyles;
    });
  };

  // Force re-render when animation settings change
  const chartKey = useMemo(() => {
    return `${chartType}-${styles.animationType}-${styles.animationDuration}-${styles.animationsEnabled}`;
  }, [
    chartType,
    styles.animationType,
    styles.animationDuration,
    styles.animationsEnabled,
  ]);

  // Handle dark mode changes
  useEffect(() => {
    setStyles((prev) => ({
      ...prev,
      fontColor: isDarkMode ? "#ffffff" : "#374151",
      gridColor: isDarkMode ? "#4b5563" : "#374151",
      axisColor: isDarkMode ? "#9ca3af" : "#6b7280",
      tooltipBackground: isDarkMode ? "#1f2937" : "#ffffff",
      tooltipBorderColor: isDarkMode ? "#374151" : "#e5e7eb",
      tooltipFontColor: isDarkMode ? "#ffffff" : "#111827",
      textStyles: {
        title: {
          ...prev.textStyles.title,
          color: isDarkMode ? "#ffffff" : "#000000",
        },
        xlab: {
          ...prev.textStyles.xlab,
          color: isDarkMode ? "#ffffff" : "#000000",
        },
        ylab: {
          ...prev.textStyles.ylab,
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      ticksStyles: {
        ...prev.ticksStyles,
        xTicksColor: isDarkMode ? "#ffffff" : "#FF0000",
        yTicksColor: isDarkMode ? "#ffffff" : "#0000FF",
      },
      chartBorder: {
        ...prev.chartBorder,
        color: isDarkMode ? "#4b5563" : "#e5e7eb",
      },
    }));
  }, [isDarkMode]);

  // Reset all settings to default when modifying from initial state
  const resetToDefaults = () => {
    if (hasModified) return;

    setMainTitle("My Chart");
    setXLabel("X Axis");
    setYLabel("Y Axis");
    setChartType("bar");
    setCurrentVariant("standard");
    setDatasets([
      {
        id: uuidv4(),
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        data: [65, 59, 80, 81, 56],
        chartType: "bar",
        xColumn: "",
        yColumn: "",
        name: "Dataset 1",
        backgroundColor: getRandomColor(),
        borderColor: darkenColor(getRandomColor(), 20),
        borderWidth: 2,
      },
    ]);
    setHasModified(true);
  };

  // Modified setChartType handler
  const handleChartTypeChange = (type) => {
    resetToDefaults();

    // Update all datasets to use the new chart type
    setDatasets((prevDatasets) =>
      prevDatasets.map((dataset) => ({
        ...dataset,
        chartType: type,
        // Reset some properties that might be incompatible with the new chart type
        borderWidth:
          type === "line" || type === "scatter" ? 2 : dataset.borderWidth,
        tension: type === "line" ? 0.4 : 0,
        fill: type === "area" ? true : false,
        pointRadius: type === "scatter" ? 8 : dataset.pointRadius,
      }))
    );

    setChartType(type);
  };

  // Handle manual data changes with color array adjustment
  const handleManualDataChange = (newData) => {
    setDatasets((prevDatasets) => {
      return prevDatasets.map((dataset) => {
        if (dataset.id === activeDatasetId) {
          const isIndividualColors = Array.isArray(dataset.backgroundColor);
          let newBackgroundColors = dataset.backgroundColor;
          let newBorderColors = dataset.borderColor;

          if (isIndividualColors) {
            // If we're using individual colors, adjust the array length
            const currentLength = newBackgroundColors.length;
            const newLength = newData.length;

            if (newLength > currentLength) {
              // Add new random colors for new data points
              const additionalColors = Array(newLength - currentLength)
                .fill()
                .map(() => getRandomColor());
              newBackgroundColors = [
                ...newBackgroundColors,
                ...additionalColors,
              ];
              newBorderColors = [
                ...newBorderColors,
                ...additionalColors.map((color) => darkenColor(color, 20)),
              ];
            } else if (newLength < currentLength) {
              // Remove extra colors
              newBackgroundColors = newBackgroundColors.slice(0, newLength);
              newBorderColors = newBorderColors.slice(0, newLength);
            }
          }

          return {
            ...dataset,
            data: newData,
            backgroundColor: newBackgroundColors,
            borderColor: newBorderColors,
          };
        }
        return dataset;
      });
    });
  };

  // Data handling functions
  const handleFileUpload = (e) => {
    resetToDefaults();
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          setError("CSV file must contain header and data rows");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim());
        const dataRows = lines.slice(1).map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim() || "";
            return obj;
          }, {});
        });

        setUploadedCSV({ headers, data: dataRows });
        setShowCSVModal(true);
        setError("");
      } catch (err) {
        setError("Error processing CSV file");
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsText(file);
  };

  const handleJsonData = () => {
    resetToDefaults();
    try {
      const parsedData = JSON.parse(jsonData);
      if (!Array.isArray(parsedData)) {
        throw new Error("JSON must be an array");
      }

      if (parsedData.length === 0) {
        throw new Error("JSON array is empty");
      }

      const keys = Object.keys(parsedData[0] || {});
      if (keys.length === 0) {
        throw new Error("No valid data columns found");
      }

      setUploadedCSV({ data: parsedData, headers: keys });
      setShowCSVModal(true);
      setError("");
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleDatabaseFetch = async () => {
    resetToDefaults();
    try {
      if (!databaseLink) {
        throw new Error("Please enter a database URL");
      }

      const response = await fetch(databaseLink);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format - expected array");
      }

      if (data.length === 0) {
        throw new Error("No data returned from database");
      }

      const keys = Object.keys(data[0] || {});
      if (keys.length === 0) {
        throw new Error("No valid data columns found");
      }

      setUploadedCSV({ data, headers: keys });
      setShowCSVModal(true);
      setError("");
    } catch (err) {
      setError(`Fetch error: ${err.message}`);
    }
  };

  // Handle CSV data application
  const handleCSVApply = (selections) => {
    const newDatasets = selections.map((selection, index) => ({
      id: uuidv4(),
      labels: selection.labels,
      data: selection.data,
      chartType: selection.chartType,
      xColumn: selection.x,
      yColumn: selection.y,
      name: selection.name || `Dataset ${index + 1}`,
      backgroundColor: Array.isArray(selection.data)
        ? selection.data.map(() => getRandomColor())
        : getRandomColor(),
      borderColor: Array.isArray(selection.data)
        ? selection.data.map(() => darkenColor(getRandomColor(), 20))
        : darkenColor(getRandomColor(), 20),
      borderWidth: 2,
    }));

    setDatasets(newDatasets);
    setShowCSVModal(false);
    setHasModified(true);

    if (newDatasets.length > 0) {
      setActiveDatasetId(newDatasets[0].id);
      setChartType(newDatasets[0].chartType);
    }
  };

  // Update active dataset and mark as modified
  const updateActiveDataset = (updates) => {
    if (!hasModified) resetToDefaults();

    setDatasets((prev) =>
      prev.map((dataset) =>
        dataset.id === activeDatasetId ? { ...dataset, ...updates } : dataset
      )
    );
  };

  // Chart data configuration
  const data = useMemo(() => {
    // For combo charts (modelId 10)
    if (modelId === 10 && datasets.length >= 2) {
      return {
        labels: datasets[0]?.labels || [],
        datasets: datasets.map((dataset, index) => {
          const isIndividualColors = Array.isArray(dataset.backgroundColor);

          return {
            label: dataset.name || `Dataset ${index + 1}`,
            data: dataset.data,
            type: index === datasets.length - 1 ? "line" : "bar",
            backgroundColor: isIndividualColors
              ? dataset.backgroundColor
              : index === datasets.length - 1
              ? "transparent"
              : dataset.backgroundColor,
            borderColor: isIndividualColors
              ? dataset.borderColor
              : dataset.borderColor,
            borderWidth: dataset.borderWidth || styles.borderWidth,
            borderDash: index === datasets.length - 1 ? [5, 5] : [],
            borderRadius: styles.borderRadius,
            tension: styles.tension,
            pointRadius: styles.pointRadius,
            pointHoverRadius: styles.pointHoverRadius,
          };
        }),
      };
    }

    // For hybrid charts (modelId 12)
    if (modelId === 12 && datasets.length >= 2) {
      return {
        labels: datasets[0]?.labels || [],
        datasets: [
          {
            ...datasets[0],
            type: "line",
            borderColor: styles.borderColor,
            backgroundColor: "transparent",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
          },
          {
            ...datasets[1],
            type: "scatter",
            backgroundColor: "#F59E0B",
            borderColor: "#D97706",
            borderWidth: 2,
            pointRadius: 8,
          },
        ],
      };
    }

    // For stacked bars (modelId 11)
    if (modelId === 11) {
      return {
        labels: datasets[0]?.labels || [],
        datasets: datasets.map((dataset, index) => {
          const isIndividualColors = Array.isArray(dataset.backgroundColor);

          return {
            label: dataset.name || `Dataset ${index + 1}`,
            data: dataset.data,
            type: "bar",
            backgroundColor: isIndividualColors
              ? dataset.backgroundColor
              : dataset.backgroundColor,
            borderColor: isIndividualColors
              ? dataset.borderColor
              : dataset.borderColor,
            borderWidth: dataset.borderWidth || styles.borderWidth,
            borderRadius: styles.borderRadius,
          };
        }),
      };
    }

    // For area charts (modelId 7)
    if (modelId === 7) {
      return {
        labels: datasets[0]?.labels || [],
        datasets: datasets.map((dataset, index) => {
          const isIndividualColors = Array.isArray(dataset.backgroundColor);

          return {
            label: dataset.name || `Dataset ${index + 1}`,
            data: dataset.data,
            type: "line",
            backgroundColor: isIndividualColors
              ? dataset.backgroundColor
              : dataset.backgroundColor,
            borderColor: isIndividualColors
              ? dataset.borderColor
              : dataset.borderColor,
            borderWidth: dataset.borderWidth || styles.borderWidth,
            tension: styles.tension,
            fill: true,
            pointRadius: styles.pointRadius,
            pointHoverRadius: styles.pointHoverRadius,
          };
        }),
      };
    }

    // Default case for other chart types
    const baseData = {
      labels: datasets[0]?.labels || [],
      datasets: datasets.map((dataset, index) => {
        const isIndividualColors = Array.isArray(dataset.backgroundColor);

        return {
          label: dataset.name || `Dataset ${index + 1}`,
          data: dataset.data,
          type: dataset.chartType || chartType,
          backgroundColor: isIndividualColors
            ? dataset.backgroundColor
            : dataset.backgroundColor,
          borderColor: isIndividualColors
            ? dataset.borderColor
            : dataset.borderColor,
          borderWidth: dataset.borderWidth || styles.borderWidth,
          borderDash: styles.borderDash,
          borderRadius: styles.borderRadius,
          tension: styles.tension,
          pointRadius: styles.pointRadius,
          pointHoverRadius: styles.pointHoverRadius,
          barPercentage:
            (dataset.chartType || chartType) === "bar"
              ? styles.barWidth / 100
              : undefined,
        };
      }),
    };

    // Handle different variants
    switch (currentVariant) {
      case "horizontal":
        return {
          ...baseData,
          datasets: baseData.datasets.map((dataset) => ({
            ...dataset,
            indexAxis: "y",
          })),
        };
      case "stacked":
        return {
          ...baseData,
          datasets: baseData.datasets.map((dataset) => ({
            ...dataset,
            stack: "stack",
          })),
        };
      default:
        return baseData;
    }
  }, [datasets, styles, chartType, currentVariant, modelId]);

  // Chart options configuration with border settings
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      ...(!hasModified ? initialChartOptions : {}),
      indexAxis: currentVariant === "horizontal" ? "y" : "x",
      layout: {
        padding: {
          top: styles.paddingTop,
          bottom: styles.paddingBottom,
          left: styles.paddingLeft,
          right: styles.paddingRight,
        },
      },
      animation: {
        duration: styles.animationsEnabled
          ? styles.animationDuration * 1000
          : 0,
        easing: styles.animationType,
      },
      plugins: {
        title: {
          display: true,
          text: mainTitle,
          font: {
            size: styles.textStyles.title.fontSize,
            family: styles.textStyles.title.family,
            weight: styles.textStyles.title.weight,
            style: styles.textStyles.title.style,
          },
          color: styles.textStyles.title.color,
        },
        legend: {
          display: styles.legendDisplay,
          position: styles.legendPosition,
          labels: {
            padding: styles.legendPadding,
            font: {
              size: styles.legendFontSize,
              family: styles.fontFamily,
            },
            color: styles.legendFontColor,
          },
        },
        tooltip: {
          backgroundColor: styles.tooltipBackground,
          borderColor: styles.tooltipBorderColor,
          borderWidth: styles.tooltipBorderWidth,
          cornerRadius: styles.tooltipCornerRadius,
          titleColor: styles.tooltipFontColor,
          bodyColor: styles.tooltipFontColor,
          titleFont: {
            size: styles.tooltipFontSize,
          },
          bodyFont: {
            size: styles.tooltipFontSize,
          },
          callbacks:
            modelId === 8
              ? {
                  label: (context) => {
                    const data = context.raw;
                    return `(${data.x}, ${data.y})`;
                  },
                }
              : undefined,
        },
        filler:
          modelId === 7
            ? {
                propagate: true,
              }
            : undefined,
      },
      scales: {
        x: {
          display: chartType !== "pie" && chartType !== "doughnut",
          stacked: currentVariant === "stacked" || modelId === 11,
          title: {
            display: true,
            text: xLabel,
            font: {
              size: styles.textStyles.xlab.fontSize,
              family: styles.textStyles.xlab.family,
              weight: styles.textStyles.xlab.weight,
              style: styles.textStyles.xlab.style,
            },
            color: styles.textStyles.xlab.color,
          },
          grid: {
            display: styles.showGridX,
            color: `rgba(${parseInt(
              styles.gridColor.slice(1, 3),
              16
            )}, ${parseInt(styles.gridColor.slice(3, 5), 16)}, ${parseInt(
              styles.gridColor.slice(5, 7),
              16
            )}, ${styles.gridOpacity})`,
            lineWidth: styles.gridLineWidth,
          },
          ticks: {
            color: styles.ticksStyles.xTicksColor,
            font: {
              size: styles.ticksStyles.ticksFontSize,
              family: styles.ticksStyles.ticksFontFamily,
              style: styles.ticksStyles.ticksFontStyle,
            },
          },
          border: {
            color: styles.axisColor,
            width: styles.axisLineWidth,
            dash: styles.borderDash,
          },
        },
        y: {
          display: chartType !== "pie" && chartType !== "doughnut",
          stacked: currentVariant === "stacked" || modelId === 11,
          title: {
            display: true,
            text: yLabel,
            font: {
              size: styles.textStyles.ylab.fontSize,
              family: styles.textStyles.ylab.family,
              weight: styles.textStyles.ylab.weight,
              style: styles.textStyles.ylab.style,
            },
            color: styles.textStyles.ylab.color,
          },
          grid: {
            display: styles.showGridY,
            color: `rgba(${parseInt(
              styles.gridColor.slice(1, 3),
              16
            )}, ${parseInt(styles.gridColor.slice(3, 5), 16)}, ${parseInt(
              styles.gridColor.slice(5, 7),
              16
            )}, ${styles.gridOpacity})`,
            lineWidth: styles.gridLineWidth,
          },
          ticks: {
            color: styles.ticksStyles.yTicksColor,
            font: {
              size: styles.ticksStyles.ticksFontSize,
              family: styles.ticksStyles.ticksFontFamily,
              style: styles.ticksStyles.ticksFontStyle,
            },
          },
          border: {
            color: styles.axisColor,
            width: styles.axisLineWidth,
            dash: styles.borderDash,
          },
          min: styles.yAxisMin || undefined,
          max: styles.yAxisMax || undefined,
        },
      },
      cutout: styles.cutout,
      rotation: styles.rotation,
      circumference: styles.circumference,
      elements: {
        bar: {
          borderWidth: styles.borderWidth,
          borderColor: styles.borderColor,
          borderSkipped: false,
        },
        line: {
          borderWidth: styles.borderWidth,
          borderColor: styles.borderColor,
        },
        point: {
          borderWidth: styles.borderWidth,
          borderColor: styles.borderColor,
        },
        arc: {
          borderWidth: styles.borderWidth,
          borderColor: styles.borderColor,
        },
      },
    }),
    [
      styles,
      mainTitle,
      xLabel,
      yLabel,
      chartType,
      currentVariant,
      modelId,
      initialChartOptions,
      hasModified,
    ]
  );

  return (
    <div
      className={`flex flex-col h-screen p-6 gap-6 mt-15  ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
      style={{
        border: styles.chartBorder.display
          ? `${styles.chartBorder.width}px ${styles.chartBorder.style} ${styles.chartBorder.color}`
          : "none",
        borderRadius: `${styles.chartBorder.radius}px`,
      }}
    >
      <NavigationBar
        activeCustomization={activeCustomization}
        handleNavClick={setActiveCustomization}
        isNavExpanded={isNavExpanded}
        setIsNavExpanded={setIsNavExpanded}
        isDarkMode={isDarkMode}
      />

      <div className="flex gap-6 flex-1 ml-20 h-auto">
        {/* Left Panel - Customization Options */}
        <div
          className={`w-1/3 rounded-xl p-6 shadow-sm transition-all duration-300 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
          style={{
            border: styles.chartBorder.display
              ? `${styles.chartBorder.width}px ${styles.chartBorder.style} ${styles.chartBorder.color}`
              : "none",
            borderRadius: `${styles.chartBorder.radius}px`,
          }}
        >
          {activeCustomization === "dataSettings" && (
            <DataInputPanel
              chartType={chartType}
              setChartType={handleChartTypeChange}
              chartVariant={currentVariant}
              setChartVariant={(variant) => {
                resetToDefaults();
                setCurrentVariant(variant);
              }}
              inputMethod={inputMethod}
              setInputMethod={setInputMethod}
              mainTitle={mainTitle}
              setMainTitle={(title) => {
                resetToDefaults();
                setMainTitle(title);
              }}
              xLabel={xLabel}
              setXLabel={(label) => {
                resetToDefaults();
                setXLabel(label);
              }}
              yLabel={yLabel}
              setYLabel={(label) => {
                resetToDefaults();
                setYLabel(label);
              }}
              labels={activeDataset?.labels || []}
              setLabels={(labels) => {
                resetToDefaults();
                updateActiveDataset({ labels });
              }}
              dataValues={activeDataset?.data || []}
              setDataValues={(data) => {
                handleManualDataChange(data);
              }}
              handleFileUpload={handleFileUpload}
              jsonData={jsonData}
              setJsonData={setJsonData}
              handleJsonData={handleJsonData}
              databaseLink={databaseLink}
              setDatabaseLink={setDatabaseLink}
              handleDatabaseFetch={handleDatabaseFetch}
              error={error}
              isDarkMode={isDarkMode}
              datasets={datasets}
              setDatasets={(newDatasets) => {
                resetToDefaults();
                setDatasets(newDatasets);
              }}
              activeDatasetId={activeDatasetId}
              setActiveDatasetId={setActiveDatasetId}
            />
          )}

          {activeCustomization === "legendManagement" && (
            <LegendSettings
              styles={styles}
              handleStyleChange={handleStyleChange}
              isDarkMode={isDarkMode}
            />
          )}

          {activeCustomization === "ticksSettings" && (
            <TicksSettings
              styles={styles.ticksStyles}
              handleStyleChange={(property, value) => {
                handleStyleChange(`ticksStyles.${property}`, value);
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {activeCustomization === "appearanceSettings" && (
            <AppearanceSettings
              styles={styles}
              chartType={chartType}
              handleStyleChange={handleStyleChange}
              isDarkMode={isDarkMode}
              generateRandomColors={generateRandomColors}
            />
          )}

          {activeCustomization === "tooltipSettings" && (
            <TooltipSettings
              styles={styles}
              handleStyleChange={handleStyleChange}
              isDarkMode={isDarkMode}
            />
          )}

          {activeCustomization === "gridConfiguration" && (
            <GridSettings
              styles={styles}
              handleStyleChange={handleStyleChange}
              isDarkMode={isDarkMode}
              premier={premier}
            />
          )}

          {activeCustomization === "fontSettings" && (
            <TextSettings
              styles={styles}
              handleStyleChange={handleStyleChange}
              isDarkMode={isDarkMode}
              premier={premier}
            />
          )}

          {activeCustomization === "animationOptions" && (
            <AnimationSettings
              styles={styles}
              handleStyleChange={handleStyleChange}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        {/* Right Panel - Chart Display */}
        <div className="flex-1">
          <DisplayChart
            key={chartKey}
            chartType={chartType}
            data={data}
            options={options}
            isDarkMode={isDarkMode}
            premier={premier}
          />
        </div>
      </div>

      {/* CSV Import Modal */}
      {showCSVModal && uploadedCSV && (
        <ColumnSelectionModal
          isOpen={showCSVModal}
          onClose={() => setShowCSVModal(false)}
          csvData={uploadedCSV}
          onApply={handleCSVApply}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default Workspace;
