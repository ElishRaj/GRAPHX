import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GraphXAPIDocumentation = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeExample, setActiveExample] = useState("javascript");
  const [copied, setCopied] = useState(null);
  const [payload, setPayload] = useState({
    xvalues: ["January", "February", "March", "April"],
    yvalues: [10, 20, 30, 40],
    graphType: "bar",
    title: "Sales Data",
    colorScheme: "default",
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Format code blocks with proper indentation
  const formatCode = (code) => {
    return code.split("\n").map((line, i) => (
      <div key={i} style={{ display: "flex", minHeight: "1.2em" }}>
        <span style={{ whiteSpace: "pre", fontFamily: "monospace" }}>
          {line}
        </span>
      </div>
    ));
  };

  const examples = {
    javascript: {
      label: "JavaScript",
      code: `const payload = {
  xvalues: ["January", "February", "March", "April"],
  yvalues: [10, 20, 30, 40],
  graphType: "bar",
  title: "Quarterly Sales",
  options: {
    responsive: true,
    colorScheme: "vibrant"
  }
};

fetch("http://localhost:30000/ap/generate-graph", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify(payload)
})
  .then(response => response.json())
  .then(data => {
    // Display the graph in your app
    document.getElementById('graph-container').innerHTML = data.graph;
  })
  .catch(error => console.error("Error:", error));`,
    },
    python: {
      label: "Python",
      code: `import requests

payload = {
  "xvalues": ["January", "February", "March", "April"],
  "yvalues": [10, 20, 30, 40],
  "graphType": "bar",
  "title": "Quarterly Sales",
  "options": {
    "responsive": True,
    "colorScheme": "vibrant"
  }
}

headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.post(
  "http://localhost:30000/ap/generate-graph",
  json=payload,
  headers=headers
)

# Save the SVG to a file
with open("graph.svg", "w") as f:
    f.write(response.json()["graph"])`,
    },
    curl: {
      label: "cURL",
      code: `curl -X POSThttp://localhost:30000/ap/generate-graph \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "xvalues": ["January", "February", "March", "April"],
    "yvalues": [10, 20, 30, 40],
    "graphType": "bar",
    "title": "Quarterly Sales",
    "options": {
      "responsive": true,
      "colorScheme": "vibrant"
    }
  }'`,
    },
  };

  const graphTypes = [
    { id: "bar", label: "Bar Chart", icon: "📊" },
    { id: "line", label: "Line Graph", icon: "📈" },
    { id: "pie", label: "Pie Chart", icon: "🥧" },
    { id: "scatter", label: "Scatter Plot", icon: "✖️" },
    { id: "area", label: "Area Chart", icon: "🔶" },
  ];

  const colorSchemes = [
    {
      id: "default",
      label: "Default",
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
    },
    {
      id: "vibrant",
      label: "Vibrant",
      colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    },
    {
      id: "pastel",
      label: "Pastel",
      colors: ["#A2D2FF", "#FFAFCC", "#BDE0FE", "#CDB4DB", "#FFC8DD"],
    },
    {
      id: "mono",
      label: "Monochrome",
      colors: ["#6B7280", "#6B7280", "#6B7280", "#6B7280", "#6B7280"],
    },
  ];

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const updatePayload = (field, value) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "quickstart", label: "Quick Start" },
    { id: "reference", label: "API Reference" },
    { id: "playground", label: "Playground" },
  ];

  // Get current color scheme
  const getColors = () => {
    const scheme =
      colorSchemes.find((s) => s.id === payload.colorScheme) || colorSchemes[0];
    return scheme.colors;
  };

  // Render different chart types with animations
  const renderChart = () => {
    const { xvalues, yvalues, graphType } = payload;
    const maxY = Math.max(...yvalues, 1);
    const colors = getColors();

    return (
      <svg width="300" height="200" viewBox="0 0 300 200">
        {graphType === "bar" &&
          xvalues.map((_, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <rect
                x={30 + i * 70}
                y={180 - (yvalues[i] / maxY) * 150}
                width="40"
                height={(yvalues[i] / maxY) * 150}
                fill={colors[i % colors.length]}
                rx="2"
              />
              <text
                x={50 + i * 70}
                y="195"
                fontSize="10"
                textAnchor="middle"
                fill={isDarkMode ? "white" : "black"}
              >
                {xvalues[i]}
              </text>
            </motion.g>
          ))}

        {graphType === "line" && (
          <>
            <motion.path
              d={yvalues
                .map(
                  (val, i) =>
                    `${i === 0 ? "M" : "L"}${50 + i * 70},${
                      180 - (val / maxY) * 150
                    }`
                )
                .join(" ")}
              fill="none"
              stroke={colors[0]}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            {yvalues.map((val, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.5 }}
              >
                <circle
                  cx={50 + i * 70}
                  cy={180 - (val / maxY) * 150}
                  r="4"
                  fill={colors[0]}
                />
                <text
                  x={50 + i * 70}
                  y="195"
                  fontSize="10"
                  textAnchor="middle"
                  fill={isDarkMode ? "white" : "black"}
                >
                  {xvalues[i]}
                </text>
              </motion.g>
            ))}
          </>
        )}

        {graphType === "pie" && (
          <>
            {
              yvalues.reduce(
                (acc, val, i, arr) => {
                  const total = arr.reduce((sum, v) => sum + v, 0);
                  const startAngle = acc.currentAngle;
                  const angle = (val / total) * 360;
                  const endAngle = startAngle + angle;

                  const x1 =
                    150 + Math.cos(((startAngle - 90) * Math.PI) / 180) * 60;
                  const y1 =
                    100 + Math.sin(((startAngle - 90) * Math.PI) / 180) * 60;
                  const x2 =
                    150 + Math.cos(((endAngle - 90) * Math.PI) / 180) * 60;
                  const y2 =
                    100 + Math.sin(((endAngle - 90) * Math.PI) / 180) * 60;

                  const largeArc = angle > 180 ? 1 : 0;

                  acc.elements.push(
                    <motion.path
                      key={i}
                      d={`M150,100 L${x1},${y1} A60,60 0 ${largeArc},1 ${x2},${y2} Z`}
                      fill={colors[i % colors.length]}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                  );

                  // Add label at the middle of the slice
                  const midAngle = startAngle + angle / 2;
                  const labelX =
                    150 + Math.cos(((midAngle - 90) * Math.PI) / 180) * 30;
                  const labelY =
                    100 + Math.sin(((midAngle - 90) * Math.PI) / 180) * 30;

                  acc.elements.push(
                    <motion.text
                      key={`label-${i}`}
                      x={labelX}
                      y={labelY}
                      fontSize="10"
                      textAnchor="middle"
                      fill="white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 + 0.3 }}
                    >
                      {xvalues[i]}
                    </motion.text>
                  );

                  acc.currentAngle = endAngle;
                  return acc;
                },
                { elements: [], currentAngle: 0 }
              ).elements
            }
          </>
        )}

        {graphType === "scatter" &&
          xvalues.map((_, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <circle
                cx={50 + i * 70}
                cy={180 - (yvalues[i] / maxY) * 150}
                r="6"
                fill={colors[i % colors.length]}
              />
              <text
                x={50 + i * 70}
                y="195"
                fontSize="10"
                textAnchor="middle"
                fill={isDarkMode ? "white" : "black"}
              >
                {xvalues[i]}
              </text>
            </motion.g>
          ))}

        {graphType === "area" && (
          <>
            <motion.path
              d={`M50,180 ${yvalues
                .map((val, i) => `L${50 + i * 70},${180 - (val / maxY) * 150}`)
                .join(" ")} L${50 + (yvalues.length - 1) * 70},180 Z`}
              fill={colors[0]}
              fillOpacity="0.5"
              stroke={colors[0]}
              strokeWidth="2"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            {yvalues.map((val, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.5 }}
              >
                <circle
                  cx={50 + i * 70}
                  cy={180 - (val / maxY) * 150}
                  r="4"
                  fill={colors[0]}
                />
                <text
                  x={50 + i * 70}
                  y="195"
                  fontSize="10"
                  textAnchor="middle"
                  fill={isDarkMode ? "white" : "black"}
                >
                  {xvalues[i]}
                </text>
              </motion.g>
            ))}
          </>
        )}

        {/* Graph title */}
        <text
          x="150"
          y="20"
          fontSize="12"
          textAnchor="middle"
          fontWeight="bold"
          fill={isDarkMode ? "white" : "black"}
        >
          {payload.title}
        </text>
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
        color: isDarkMode ? "#f3f4f6" : "#111827",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginTop:'35px',
          
          padding: "3rem 1rem",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              background: "linear-gradient(to right, #9333ea, #3b82f6)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              display: "inline-block",
            }}
          >
            Graph-X API Documentation
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              maxWidth: "48rem",
              margin: "0 auto",
              opacity: 0.9,
            }}
          >
            Transform raw data into stunning, interactive visualizations with
            our powerful API. Generate charts in seconds with just a few lines
            of code.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              borderRadius: "0.75rem",
              padding: "0.375rem",
              backgroundColor: isDarkMode ? "#1f2937" : "#e5e7eb",
              boxShadow: isDarkMode
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.2)"
                : "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  transition: "all 0.2s",
                  backgroundColor:
                    activeTab === tab.id
                      ? isDarkMode
                        ? "#374151"
                        : "white"
                      : "transparent",
                  color:
                    activeTab === tab.id
                      ? isDarkMode
                        ? "white"
                        : "#111827"
                      : isDarkMode
                      ? "#d1d5db"
                      : "#4b5563",
                  boxShadow:
                    activeTab === tab.id && !isDarkMode
                      ? "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)"
                      : "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            borderRadius: "0.75rem",
            padding: "1.5rem",
            backgroundColor: isDarkMode ? "#1f2937" : "white",
            boxShadow: isDarkMode
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    marginBottom: "1.5rem",
                    color: isDarkMode ? "white" : "#111827",
                  }}
                >
                  API Overview
                </motion.h2>

                <div style={{ display: "grid", gap: "1.5rem" }}>
                  {/* Features Section - Now with 8 blocks */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                      border: isDarkMode
                        ? "1px solid #374151"
                        : "1px solid #e5e7eb",
                    }}
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                        color: isDarkMode ? "white" : "#111827",
                      }}
                    >
                      What is Graph-X API?
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        marginBottom: "1.5rem",
                        lineHeight: "1.6",
                        color: isDarkMode ? "#d1d5db" : "#4b5563",
                      }}
                    >
                      Graph-X API transforms raw data into beautiful,
                      interactive visualizations with a simple HTTP request.
                    </motion.p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      {[
                        {
                          icon: "⚡",
                          title: "Blazing Fast",
                          desc: "Render charts in under 100ms",
                          color: "#f59e0b",
                        },
                        {
                          icon: "🔄",
                          title: "Flexible",
                          desc: "10+ chart types with customization",
                          color: "#10b981",
                        },
                        {
                          icon: "🔒",
                          title: "Secure",
                          desc: "Enterprise-grade security",
                          color: "#3b82f6",
                        },
                        {
                          icon: "📱",
                          title: "Responsive",
                          desc: "Perfect on all devices",
                          color: "#8b5cf6",
                        },
                        {
                          icon: "🌐",
                          title: "Multi-Format",
                          desc: "SVG, PNG, JPEG outputs",
                          color: "#ec4899",
                        },
                        {
                          icon: "📊",
                          title: "Analytics",
                          desc: "Track engagement metrics",
                          color: "#6366f1",
                        },
                        // New blocks
                        {
                          icon: "🔗",
                          title: "Webhooks",
                          desc: "Real-time update notifications",
                          color: "#ef4444",
                        },
                        {
                          icon: "🧩",
                          title: "Plugins",
                          desc: "Extend with custom visualizations",
                          color: "#14b8a6",
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * i, duration: 0.5 }}
                          whileHover={{
                            y: -5,
                            boxShadow: isDarkMode
                              ? "0 10px 15px -3px rgba(0,0,0,0.2)"
                              : "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                          style={{
                            padding: "1.25rem",
                            borderRadius: "0.5rem",
                            backgroundColor: isDarkMode ? "#111827" : "white",
                            border: isDarkMode
                              ? "1px solid #374151"
                              : "1px solid #e5e7eb",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <div
                              style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "0.5rem",
                                backgroundColor: `${item.color}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: item.color,
                                fontSize: "1.25rem",
                              }}
                            >
                              {item.icon}
                            </div>
                            <div>
                              <h4
                                style={{
                                  fontWeight: "600",
                                  marginBottom: "0.25rem",
                                  color: isDarkMode ? "white" : "#111827",
                                }}
                              >
                                {item.title}
                              </h4>
                              <p
                                style={{
                                  fontSize: "0.875rem",
                                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                                }}
                              >
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Horizontal Steps with SVGs */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                      border: isDarkMode
                        ? "1px solid #374151"
                        : "1px solid #e5e7eb",
                      overflowX: "auto",
                    }}
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1.5rem",
                        color: isDarkMode ? "white" : "#111827",
                      }}
                    >
                      How It Works
                    </motion.h3>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        minWidth: "fit-content",
                        paddingBottom: "1rem",
                      }}
                    >
                      {[
                        {
                          icon: (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                fill="#3B82F6"
                              />
                              <path
                                d="M19 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4Z"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ),
                          title: "Register",
                          desc: "Get your API key",
                        },
                        {
                          icon: (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 17L12 21L16 17"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8 7L12 3L16 7"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 21V10"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ),
                          title: "Prepare",
                          desc: "Format your data",
                        },
                        {
                          icon: (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ),
                          title: "Request",
                          desc: "Call our API",
                        },
                        {
                          icon: (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 21C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7Z"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7 17L12 12L17 17"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 12V21"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ),
                          title: "Visualize",
                          desc: "Get your chart",
                        },
                      ].map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.15, duration: 0.5 }}
                          whileHover={{ scale: 1.05 }}
                          style={{
                            minWidth: "200px",
                            padding: "1.5rem",
                            borderRadius: "0.5rem",
                            backgroundColor: isDarkMode ? "#111827" : "white",
                            border: isDarkMode
                              ? "1px solid #374151"
                              : "1px solid #e5e7eb",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1rem",
                            textAlign: "center",
                          }}
                        >
                          <motion.div
                            animate={{
                              rotate: [0, 5, -5, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          >
                            {step.icon}
                          </motion.div>
                          <div>
                            <h4
                              style={{
                                fontWeight: "600",
                                marginBottom: "0.25rem",
                                color: isDarkMode ? "white" : "#111827",
                              }}
                            >
                              {step.title}
                            </h4>
                            <p
                              style={{
                                fontSize: "0.875rem",
                                color: isDarkMode ? "#9ca3af" : "#6b7280",
                              }}
                            >
                              {step.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* API Reference Section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "1.5rem",
                    }}
                  >
                    {/* Endpoint Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      whileHover={{ y: -3 }}
                      style={{
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                        border: isDarkMode
                          ? "1px solid #374151"
                          : "1px solid #e5e7eb",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          marginBottom: "1rem",
                          color: isDarkMode ? "white" : "#111827",
                        }}
                      >
                        API Endpoint
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          borderRadius: "0.5rem",
                          backgroundColor: isDarkMode ? "#111827" : "#1e40af",
                          color: "white",
                          fontFamily: "monospace",
                          marginBottom: "1rem",
                        }}
                      >
                        <code>POST http://localhost:30000/ap/generate-graph</code>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            copyToClipboard(
                              "POST http://localhost:30000/ap/generate-graph",
                              "endpoint"
                            )
                          }
                          style={{
                            padding: "0.375rem 0.875rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            backgroundColor: isDarkMode ? "#1e40af" : "#1e3a8a",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {copied === "endpoint" ? "✅ Copied!" : "📋 Copy"}
                        </motion.button>
                      </div>
                      <div
                        style={{
                          color: isDarkMode ? "#9ca3af" : "#6b7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        <p style={{ marginBottom: "0.5rem" }}>
                          Required headers:
                        </p>
                        <div
                          style={{
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            backgroundColor: isDarkMode ? "#111827" : "#e5e7eb",
                            fontFamily: "monospace",
                            fontSize: "0.875rem",
                            color: isDarkMode ? "#e5e7eb" : "#111827",
                          }}
                        >
                          Authorization: Bearer YOUR_API_KEY
                          <br />
                          Content-Type: application/json
                        </div>
                      </div>
                    </motion.div>

                    {/* Response Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      whileHover={{ y: -3 }}
                      style={{
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                        border: isDarkMode
                          ? "1px solid #374151"
                          : "1px solid #e5e7eb",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          marginBottom: "1rem",
                          color: isDarkMode ? "white" : "#111827",
                        }}
                      >
                        Example Response
                      </h3>
                      <div style={{ position: "relative" }}>
                        <pre
                          style={{
                            padding: "1.5rem",
                            borderRadius: "0.5rem",
                            backgroundColor: isDarkMode ? "#111827" : "#f3f4f6",
                            color: isDarkMode ? "#f3f4f6" : "#111827",
                            fontFamily: "monospace",
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                            fontSize: "0.875rem",
                            lineHeight: "1.5",
                          }}
                        >
                          {`{
  "success": true,
  "data": {
    "graph": "<svg...>...</svg>",
    "format": "svg",
    "width": 1200,
    "height": 800
  },
  "meta": {
    "renderTime": "32ms",
    "cache": "HIT"
  }
}`}
                        </pre>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            copyToClipboard(
                              `{
  "success": true,
  "data": {
    "graph": "<svg...>...</svg>",
    "format": "svg",
    "width": 1200,
    "height": 800
  },
  "meta": {
    "renderTime": "32ms",
    "cache": "HIT"
  }
}`,
                              "response"
                            )
                          }
                          style={{
                            position: "absolute",
                            top: "0.75rem",
                            right: "0.75rem",
                            padding: "0.375rem 0.875rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            backgroundColor: isDarkMode ? "#1e40af" : "#1e3a8a",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {copied === "response" ? "✅ Copied!" : "📋 Copy"}
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "quickstart" && (
              <motion.div
                key="quickstart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    marginBottom: "1.5rem",
                    color: isDarkMode ? "white" : "#111827",
                  }}
                >
                  Quick Start Guide
                </h2>

                <div style={{ display: "grid", gap: "2.5rem" }}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                      boxShadow: isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      1. Request Format
                    </h3>
                    <p style={{ marginBottom: "1.5rem", lineHeight: "1.6" }}>
                      Send a POST request with a JSON payload containing your
                      data and customization options. Here's the complete
                      request structure:
                    </p>

                    <div
                      style={{ position: "relative", marginBottom: "1.5rem" }}
                    >
                      <pre
                        style={{
                          padding: "1.5rem",
                          borderRadius: "0.5rem",
                          backgroundColor: isDarkMode ? "#111827" : "#f8fafc",
                          color: isDarkMode ? "#f3f4f6" : "#111827",
                          fontFamily: "monospace",
                          overflowX: "auto",
                          boxShadow: isDarkMode
                            ? "inset 0 2px 4px 0 rgba(0,0,0,0.1)"
                            : "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
                        }}
                      >
                        {JSON.stringify(
                          {
                            xvalues: ["Label 1", "Label 2", "Label 3"],
                            yvalues: [10, 20, 30],
                            graphType: "bar",
                            title: "My Chart",
                            subtitle: "Quarterly Results",
                            options: {
                              colorScheme: "vibrant",
                              responsive: true,
                              showLegend: true,
                              animation: true,
                              borderWidth: 2,
                              borderRadius: 4,
                              theme: "light", // or "dark"
                            },
                          },
                          null,
                          2
                        )}
                      </pre>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(
                              {
                                xvalues: ["Label 1", "Label 2", "Label 3"],
                                yvalues: [10, 20, 30],
                                graphType: "bar",
                                title: "My Chart",
                                subtitle: "Quarterly Results",
                                options: {
                                  colorScheme: "vibrant",
                                  responsive: true,
                                  showLegend: true,
                                  animation: true,
                                  borderWidth: 2,
                                  borderRadius: 4,
                                  theme: "light",
                                },
                              },
                              null,
                              2
                            ),
                            "request"
                          )
                        }
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          right: "0.75rem",
                          padding: "0.375rem 0.875rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          backgroundColor: isDarkMode ? "#111827" : "#1f2937",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {copied === "request" ? "✅ Copied!" : "📋 Copy"}
                      </motion.button>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <h4
                          style={{ fontWeight: "600", marginBottom: "0.5rem" }}
                        >
                          Required Fields
                        </h4>
                        <ul
                          style={{
                            fontSize: "0.875rem",
                            paddingLeft: "1.25rem",
                            lineHeight: "1.6",
                          }}
                        >
                          <li>
                            <code>xvalues</code>: Array of labels
                          </li>
                          <li>
                            <code>yvalues</code>: Array of numeric values
                          </li>
                          <li>
                            <code>graphType</code>: Chart type (bar, line, etc.)
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{ fontWeight: "600", marginBottom: "0.5rem" }}
                        >
                          Optional Fields
                        </h4>
                        <ul
                          style={{
                            fontSize: "0.875rem",
                            paddingLeft: "1.25rem",
                            lineHeight: "1.6",
                          }}
                        >
                          <li>
                            <code>title</code>: Chart title
                          </li>
                          <li>
                            <code>subtitle</code>: Chart subtitle
                          </li>
                          <li>
                            <code>options</code>: Customization object
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                      boxShadow: isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      2. Choose Your Language
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {Object.keys(examples).map((key) => (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveExample(key)}
                          style={{
                            padding: "0.5rem 1.25rem",
                            borderRadius: "0.5rem",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            backgroundColor:
                              activeExample === key
                                ? isDarkMode
                                  ? "#2563eb"
                                  : "#bfdbfe"
                                : isDarkMode
                                ? "#4b5563"
                                : "#e5e7eb",
                            color:
                              activeExample === key
                                ? isDarkMode
                                  ? "white"
                                  : "#1e40af"
                                : isDarkMode
                                ? "#d1d5db"
                                : "#4b5563",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {examples[key].label}
                        </motion.button>
                      ))}
                    </div>

                    <div style={{ position: "relative" }}>
                      <pre
                        style={{
                          padding: "1.5rem",
                          borderRadius: "0.5rem",
                          backgroundColor: isDarkMode ? "#111827" : "#f8fafc",
                          color: isDarkMode ? "#f3f4f6" : "#111827",
                          fontFamily: "monospace",
                          overflowX: "auto",
                          boxShadow: isDarkMode
                            ? "inset 0 2px 4px 0 rgba(0,0,0,0.1)"
                            : "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
                        }}
                      >
                        {formatCode(examples[activeExample].code)}
                      </pre>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyToClipboard(
                            examples[activeExample].code,
                            "example"
                          )
                        }
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          right: "0.75rem",
                          padding: "0.375rem 0.875rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          backgroundColor: isDarkMode ? "#111827" : "#1f2937",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {copied === "example" ? "✅ Copied!" : "📋 Copy"}
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                      boxShadow: isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      3. Integrate with Your Website
                    </h3>
                    <p style={{ marginBottom: "1.5rem", lineHeight: "1.6" }}>
                      After receiving the graph data, you can display it in your
                      website or application. Here are examples for different
                      platforms:
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "1.5rem",
                      }}
                    >
                      <div>
                        <h4
                          style={{ fontWeight: "600", marginBottom: "0.75rem" }}
                        >
                          HTML Integration
                        </h4>
                        <div style={{ position: "relative" }}>
                          <pre
                            style={{
                              padding: "1.5rem",
                              borderRadius: "0.5rem",
                              backgroundColor: isDarkMode
                                ? "#111827"
                                : "#f8fafc",
                              color: isDarkMode ? "#f3f4f6" : "#111827",
                              fontFamily: "monospace",
                              overflowX: "auto",
                              boxShadow: isDarkMode
                                ? "inset 0 2px 4px 0 rgba(0,0,0,0.1)"
                                : "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
                            }}
                          >
                            {formatCode(`<!-- Place this where you want the chart -->
<div id="graph-container"></div>

<script>
  fetch("http://localhost:30000/ap/generate-graph", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
    body: JSON.stringify({
      xvalues: ["Q1", "Q2", "Q3", "Q4"],
      yvalues: [120, 150, 180, 90],
      graphType: "bar"
    })
  })
    .then(response => response.json())
    .then(data => {
      // Insert the SVG into your page
      document.getElementById('graph-container').innerHTML = data.graph;
      
      // Optional: Add interactivity
      document.querySelectorAll('#graph-container svg .bar').forEach(bar => {
        bar.addEventListener('click', () => {
          alert('Bar clicked!');
        });
      });
    })
    .catch(error => console.error("Error:", error));
</script>`)}
                          </pre>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              copyToClipboard(
                                `<!-- Place this where you want the chart -->
<div id="graph-container"></div>

<script>
  fetch("http://localhost:30000/ap/generate-graph", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
    body: JSON.stringify({
      xvalues: ["Q1", "Q2", "Q3", "Q4"],
      yvalues: [120, 150, 180, 90],
      graphType: "bar"
    })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('graph-container').innerHTML = data.graph;
    })
    .catch(error => console.error("Error:", error));
</script>`,
                                "html"
                              )
                            }
                            style={{
                              position: "absolute",
                              top: "0.75rem",
                              right: "0.75rem",
                              padding: "0.375rem 0.875rem",
                              borderRadius: "0.375rem",
                              fontSize: "0.875rem",
                              backgroundColor: isDarkMode
                                ? "#111827"
                                : "#1f2937",
                              color: "white",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {copied === "html" ? "✅ Copied!" : "📋 Copy"}
                          </motion.button>
                        </div>
                      </div>

                      <div>
                        <h4
                          style={{ fontWeight: "600", marginBottom: "0.75rem" }}
                        >
                          React Integration
                        </h4>
                        <div style={{ position: "relative" }}>
                          <pre
                            style={{
                              padding: "1.5rem",
                              borderRadius: "0.5rem",
                              backgroundColor: isDarkMode
                                ? "#111827"
                                : "#f8fafc",
                              color: isDarkMode ? "#f3f4f6" : "#111827",
                              fontFamily: "monospace",
                              overflowX: "auto",
                              boxShadow: isDarkMode
                                ? "inset 0 2px 4px 0 rgba(0,0,0,0.1)"
                                : "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
                            }}
                          >
                            {formatCode(`import React, { useState, useEffect } from 'react';

function GraphDisplay() {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch(
          "http://localhost:30000/ap/generate-graph",
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": "Bearer YOUR_API_KEY"
            },
            body: JSON.stringify({
              xvalues: ["Q1", "Q2", "Q3", "Q4"],
              yvalues: [120, 150, 180, 90],
              graphType: "bar"
            })
          }
        );
        const data = await response.json();
        setGraph(data.graph);
      } catch (error) {
        console.error("Error fetching graph:", error);
      }
    };

    fetchGraph();
  }, []);

  return (
    <div className="graph-container">
      {graph ? (
        <div dangerouslySetInnerHTML={{ __html: graph }} />
      ) : (
        <div className="loading">Loading chart...</div>
      )}
    </div>
  );
}

export default GraphDisplay;`)}
                          </pre>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              copyToClipboard(
                                `import React, { useState, useEffect } from 'react';

function GraphDisplay() {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch(
          "http://localhost:30000/ap/generate-graph",
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": "Bearer YOUR_API_KEY"
            },
            body: JSON.stringify({
              xvalues: ["Q1", "Q2", "Q3", "Q4"],
              yvalues: [120, 150, 180, 90],
              graphType: "bar"
            })
          }
        );
        const data = await response.json();
        setGraph(data.graph);
      } catch (error) {
        console.error("Error fetching graph:", error);
      }
    };

    fetchGraph();
  }, []);

  return (
    <div className="graph-container">
      {graph ? (
        <div dangerouslySetInnerHTML={{ __html: graph }} />
      ) : (
        <div className="loading">Loading chart...</div>
      )}
    </div>
  );
}

export default GraphDisplay;`,
                                "react"
                              )
                            }
                            style={{
                              position: "absolute",
                              top: "0.75rem",
                              right: "0.75rem",
                              padding: "0.375rem 0.875rem",
                              borderRadius: "0.375rem",
                              fontSize: "0.875rem",
                              backgroundColor: isDarkMode
                                ? "#111827"
                                : "#1f2937",
                              color: "white",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {copied === "react" ? "✅ Copied!" : "📋 Copy"}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "reference" && (
              <motion.div
                key="reference"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    marginBottom: "1.5rem",
                    color: isDarkMode ? "white" : "#111827",
                  }}
                >
                  API Reference
                </h2>

                <div style={{ display: "grid", gap: "2rem" }}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                      boxShadow: isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      Request Parameters
                    </h3>

                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "0.875rem",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: isDarkMode
                                ? "#4b5563"
                                : "#e5e7eb",
                              textAlign: "left",
                            }}
                          >
                            <th style={{ padding: "0.75rem 1rem" }}>
                              Parameter
                            </th>
                            <th style={{ padding: "0.75rem 1rem" }}>Type</th>
                            <th style={{ padding: "0.75rem 1rem" }}>
                              Required
                            </th>
                            <th style={{ padding: "0.75rem 1rem" }}>
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              param: "xvalues",
                              type: "Array<string>",
                              required: "Yes",
                              description:
                                "Labels for the X-axis or categories",
                            },
                            {
                              param: "yvalues",
                              type: "Array<number>",
                              required: "Yes",
                              description: "Numerical values for the Y-axis",
                            },
                            {
                              param: "graphType",
                              type: "string",
                              required: "Yes",
                              description:
                                "Type of graph (bar, line, pie, etc.)",
                            },
                            {
                              param: "title",
                              type: "string",
                              required: "No",
                              description: "Title displayed above the chart",
                            },
                            {
                              param: "subtitle",
                              type: "string",
                              required: "No",
                              description: "Subtitle displayed below the title",
                            },
                            {
                              param: "options.colorScheme",
                              type: "string",
                              required: "No",
                              description:
                                "Color palette (default, vibrant, pastel, mono)",
                            },
                            {
                              param: "options.responsive",
                              type: "boolean",
                              required: "No",
                              description:
                                "Make chart responsive (default: true)",
                            },
                            {
                              param: "options.animation",
                              type: "boolean",
                              required: "No",
                              description:
                                "Enable/disable animations (default: true)",
                            },
                            {
                              param: "options.theme",
                              type: "string",
                              required: "No",
                              description:
                                "light or dark theme (default: light)",
                            },
                          ].map((row, i) => (
                            <tr
                              key={i}
                              style={{
                                borderBottom: `1px solid ${
                                  isDarkMode ? "#4b5563" : "#e5e7eb"
                                }`,
                              }}
                            >
                              <td
                                style={{
                                  padding: "0.75rem 1rem",
                                  fontFamily: "monospace",
                                  color: isDarkMode ? "#3b82f6" : "#2563eb",
                                }}
                              >
                                {row.param}
                              </td>
                              <td
                                style={{
                                  padding: "0.75rem 1rem",
                                  fontFamily: "monospace",
                                }}
                              >
                                {row.type}
                              </td>
                              <td style={{ padding: "0.75rem 1rem" }}>
                                {row.required}
                              </td>
                              <td style={{ padding: "0.75rem 1rem" }}>
                                {row.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                      boxShadow: isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      Response Format
                    </h3>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        Successful Response (200 OK)
                      </h4>
                      <div style={{ position: "relative" }}>
                        <pre
                          style={{
                            padding: "1.5rem",
                            borderRadius: "0.5rem",
                            backgroundColor: isDarkMode ? "#111827" : "#f8fafc",
                            color: isDarkMode ? "#f3f4f6" : "#111827",
                            fontFamily: "monospace",
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                            boxShadow: isDarkMode
                              ? "inset 0 2px 4px 0 rgba(0,0,0,0.1)"
                              : "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
                          }}
                        >
                          {`{
  "success": true,
  "graph": "<svg ...>...</svg>",
  "format": "svg",
  "width": 800,
  "height": 600,
  "metadata": {
    "generatedAt": "2025-04-03T12:00:00Z",
    "renderTime": "45ms",
    "cacheHit": true,
    "size": "12.5KB"
  }
}`}
                        </pre>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            copyToClipboard(
                              `{
  "success": true,
  "graph": "<svg ...>...</svg>",
  "format": "svg",
  "width": 800,
  "height": 600,
  "metadata": {
    "generatedAt": "2025-04-03T12:00:00Z",
    "renderTime": "45ms",
    "cacheHit": true,
    "size": "12.5KB"
  }
}`,
                              "success-response"
                            )
                          }
                          style={{
                            position: "absolute",
                            top: "0.75rem",
                            right: "0.75rem",
                            padding: "0.375rem 0.875rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            backgroundColor: isDarkMode ? "#111827" : "#1f2937",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {copied === "success-response"
                            ? "✅ Copied!"
                            : "📋 Copy"}
                        </motion.button>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        Error Response (4xx/5xx)
                      </h4>
                      <div style={{ position: "relative" }}>
                        <pre
                          style={{
                            padding: "1.5rem",
                            borderRadius: "0.5rem",
                            backgroundColor: isDarkMode ? "#111827" : "#f8fafc",
                            color: isDarkMode ? "#f3f4f6" : "#111827",
                            fontFamily: "monospace",
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                            boxShadow: isDarkMode
                              ? "inset 0 2px 4px 0 rgba(0,0,0,0.1)"
                              : "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
                          }}
                        >
                          {`{
  "success": false,
  "error": {
    "code": "invalid_payload",
    "message": "xvalues and yvalues must be arrays of the same length",
    "details": {
      "xvalues_length": 3,
      "yvalues_length": 4
    }
  },
  "metadata": {
    "timestamp": "2025-04-03T12:00:00Z",
    "requestId": "req_123456789"
  }
}`}
                        </pre>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            copyToClipboard(
                              `{
  "success": false,
  "error": {
    "code": "invalid_payload",
    "message": "xvalues and yvalues must be arrays of the same length",
    "details": {
      "xvalues_length": 3,
      "yvalues_length": 4
    }
  },
  "metadata": {
    "timestamp": "2025-04-03T12:00:00Z",
    "requestId": "req_123456789"
  }
}`,
                              "error-response"
                            )
                          }
                          style={{
                            position: "absolute",
                            top: "0.75rem",
                            right: "0.75rem",
                            padding: "0.375rem 0.875rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            backgroundColor: isDarkMode ? "#111827" : "#1f2937",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {copied === "error-response"
                            ? "✅ Copied!"
                            : "📋 Copy"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                      boxShadow: isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      Error Codes
                    </h3>

                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "0.875rem",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: isDarkMode
                                ? "#4b5563"
                                : "#e5e7eb",
                              textAlign: "left",
                            }}
                          >
                            <th style={{ padding: "0.75rem 1rem" }}>Code</th>
                            <th style={{ padding: "0.75rem 1rem" }}>
                              HTTP Status
                            </th>
                            <th style={{ padding: "0.75rem 1rem" }}>
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              code: "invalid_payload",
                              status: "400 Bad Request",
                              description:
                                "Request payload is malformed or invalid",
                            },
                            {
                              code: "unauthorized",
                              status: "401 Unauthorized",
                              description: "Missing or invalid API key",
                            },
                            {
                              code: "forbidden",
                              status: "403 Forbidden",
                              description:
                                "API key valid but not authorized for this action",
                            },
                            {
                              code: "data_mismatch",
                              status: "400 Bad Request",
                              description:
                                "xvalues and yvalues arrays have different lengths",
                            },
                            {
                              code: "invalid_graph_type",
                              status: "400 Bad Request",
                              description:
                                "Specified graphType is not supported",
                            },
                            {
                              code: "rate_limit_exceeded",
                              status: "429 Too Many Requests",
                              description: "API rate limit exceeded",
                            },
                            {
                              code: "server_error",
                              status: "500 Internal Server Error",
                              description: "Unexpected server error",
                            },
                          ].map((row, i) => (
                            <tr
                              key={i}
                              style={{
                                borderBottom: `1px solid ${
                                  isDarkMode ? "#4b5563" : "#e5e7eb"
                                }`,
                              }}
                            >
                              <td
                                style={{
                                  padding: "0.75rem 1rem",
                                  fontFamily: "monospace",
                                  color: isDarkMode ? "#ef4444" : "#dc2626",
                                }}
                              >
                                {row.code}
                              </td>
                              <td
                                style={{
                                  padding: "0.75rem 1rem",
                                  fontFamily: "monospace",
                                }}
                              >
                                {row.status}
                              </td>
                              <td style={{ padding: "0.75rem 1rem" }}>
                                {row.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "playground" && (
              <motion.div
                key="playground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    marginBottom: "1.5rem",
                    color: isDarkMode ? "white" : "#111827",
                  }}
                >
                  API Playground
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                  }}
                >
                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                      boxShadow: isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      Configure Your Graph
                    </h3>

                    <div style={{ display: "grid", gap: "1.25rem" }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontWeight: "500",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Graph Type
                        </label>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          {graphTypes.map((type) => (
                            <motion.button
                              key={type.id}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                updatePayload("graphType", type.id)
                              }
                              style={{
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                backgroundColor:
                                  payload.graphType === type.id
                                    ? isDarkMode
                                      ? "#2563eb"
                                      : "#bfdbfe"
                                    : isDarkMode
                                    ? "#4b5563"
                                    : "#e5e7eb",
                                color:
                                  payload.graphType === type.id
                                    ? isDarkMode
                                      ? "white"
                                      : "#1e40af"
                                    : isDarkMode
                                    ? "#f3f4f6"
                                    : "#111827",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontWeight: "500",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Chart Title
                        </label>
                        <input
                          type="text"
                          value={payload.title}
                          onChange={(e) =>
                            updatePayload("title", e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: `1px solid ${
                              isDarkMode ? "#4b5563" : "#d1d5db"
                            }`,
                            backgroundColor: isDarkMode ? "#374151" : "white",
                            color: isDarkMode ? "#f3f4f6" : "#111827",
                          }}
                          placeholder="Enter chart title"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontWeight: "500",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Color Scheme
                        </label>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          {colorSchemes.map((scheme) => (
                            <motion.button
                              key={scheme.id}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                updatePayload("colorScheme", scheme.id)
                              }
                              style={{
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                backgroundColor:
                                  payload.colorScheme === scheme.id
                                    ? isDarkMode
                                      ? "#2563eb"
                                      : "#bfdbfe"
                                    : isDarkMode
                                    ? "#4b5563"
                                    : "#e5e7eb",
                                color:
                                  payload.colorScheme === scheme.id
                                    ? isDarkMode
                                      ? "white"
                                      : "#1e40af"
                                    : isDarkMode
                                    ? "#f3f4f6"
                                    : "#111827",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              {scheme.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontWeight: "500",
                            marginBottom: "0.5rem",
                          }}
                        >
                          X-Axis Labels
                        </label>
                        <input
                          type="text"
                          value={payload.xvalues.join(",")}
                          onChange={(e) =>
                            updatePayload("xvalues", e.target.value.split(","))
                          }
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: `1px solid ${
                              isDarkMode ? "#4b5563" : "#d1d5db"
                            }`,
                            backgroundColor: isDarkMode ? "#374151" : "white",
                            color: isDarkMode ? "#f3f4f6" : "#111827",
                          }}
                          placeholder="Enter comma-separated labels (e.g., Jan,Feb,Mar)"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontWeight: "500",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Y-Axis Values
                        </label>
                        <input
                          type="text"
                          value={payload.yvalues.join(",")}
                          onChange={(e) =>
                            updatePayload(
                              "yvalues",
                              e.target.value.split(",").map(Number)
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: `1px solid ${
                              isDarkMode ? "#4b5563" : "#d1d5db"
                            }`,
                            backgroundColor: isDarkMode ? "#374151" : "white",
                            color: isDarkMode ? "#f3f4f6" : "#111827",
                          }}
                          placeholder="Enter comma-separated numbers (e.g., 10,20,30)"
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "0.5rem" }}>
                        Generated Request Payload
                      </h4>
                      <div style={{ position: "relative" }}>
                        <pre
                          style={{
                            padding: "1.5rem",
                            borderRadius: "0.5rem",
                            backgroundColor: isDarkMode ? "#111827" : "#f8fafc",
                            color: isDarkMode ? "#f3f4f6" : "#111827",
                            fontFamily: "monospace",
                            overflowX: "auto",
                            boxShadow: isDarkMode
                              ? "inset 0 2px 4px 0 rgba(0,0,0,0.1)"
                              : "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
                          }}
                        >
                          {JSON.stringify(
                            {
                              ...payload,
                              options: {
                                colorScheme: payload.colorScheme,
                                responsive: true,
                                animation: true,
                              },
                            },
                            null,
                            2
                          )}
                        </pre>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(
                                {
                                  ...payload,
                                  options: {
                                    colorScheme: payload.colorScheme,
                                    responsive: true,
                                    animation: true,
                                  },
                                },
                                null,
                                2
                              ),
                              "playground"
                            )
                          }
                          style={{
                            position: "absolute",
                            top: "0.75rem",
                            right: "0.75rem",
                            padding: "0.375rem 0.875rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            backgroundColor: isDarkMode ? "#111827" : "#1f2937",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {copied === "playground" ? "✅ Copied!" : "📋 Copy"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                      boxShadow: isDarkMode
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.375rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      Live Preview
                    </h3>

                    <div
                      style={{
                        padding: "1.5rem",
                        borderRadius: "0.5rem",
                        backgroundColor: isDarkMode ? "#1f2937" : "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "400px",
                        boxShadow: isDarkMode
                          ? "inset 0 2px 4px 0 rgba(0,0,0,0.1)"
                          : "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "500",
                          marginBottom: "1rem",
                          color: isDarkMode ? "white" : "#111827",
                        }}
                      >
                        {payload.title || "Untitled Chart"}
                      </div>
                      <motion.div
                        key={`${payload.graphType}-${payload.colorScheme}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          width: "100%",
                          height: "16rem",
                          backgroundColor: isDarkMode ? "#111827" : "white",
                          borderRadius: "0.375rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {renderChart()}
                      </motion.div>
                      <div
                        style={{
                          marginTop: "1rem",
                          fontSize: "0.875rem",
                          color: isDarkMode ? "#9ca3af" : "#6b7280",
                          textAlign: "center",
                        }}
                      >
                        <p>
                          Note: This is a simplified preview. The actual API
                          will
                        </p>
                        <p>
                          return a fully styled, interactive chart with
                          animations.
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <h4 style={{ fontWeight: "500", marginBottom: "0.5rem" }}>
                        Try It Out
                      </h4>
                      <p style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
                        Copy the payload above and test it with our API
                        endpoint:
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          borderRadius: "0.375rem",
                          backgroundColor: isDarkMode ? "#111827" : "#1f2937",
                          color: "white",
                          fontFamily: "monospace",
                          fontSize: "0.875rem",
                        }}
                      >
                        <code>
                          POST http://localhost:30000/ap/generate-graph
                        </code>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            copyToClipboard(
                              "http://localhost:30000/ap/generate-graph",
                              "playground-endpoint"
                            )
                          }
                          style={{
                            marginLeft: "1rem",
                            padding: "0.375rem 0.875rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            backgroundColor: isDarkMode ? "#1f2937" : "#374151",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {copied === "playground-endpoint"
                            ? "✅ Copied!"
                            : "📋 Copy"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: "3rem",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            backgroundColor: isDarkMode ? "#1f2937" : "#e5e7eb",
            textAlign: "center",
            fontSize: "0.875rem",
            color: isDarkMode ? "#9ca3af" : "#6b7280",
          }}
        >
          <p>Graph-X API v1.0 • Documentation last updated: April 2025</p>
          <p style={{ marginTop: "0.5rem" }}>
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@graph-x.com"
              style={{
                color: isDarkMode ? "#3b82f6" : "#2563eb",
                textDecoration: "underline",
              }}
            >
              support@graph-x.com
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GraphXAPIDocumentation;
