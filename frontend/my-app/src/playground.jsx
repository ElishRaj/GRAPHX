import { motion, AnimatePresence } from "framer-motion";

const graphTypes = [
  { id: "line", label: "Line", icon: "📈" },
  { id: "bar", label: "Bar", icon: "📊" },
  { id: "pie", label: "Pie", icon: "🥧" },
  { id: "area", label: "Area", icon: "🔽" },
];

const colorSchemes = [
  { id: "blue", label: "Blue" },
  { id: "green", label: "Green" },
  { id: "red", label: "Red" },
  { id: "purple", label: "Purple" },
  { id: "multi", label: "Multi" },
];

const APIPlayground = ({
  activeTab,
  isDarkMode,
  payload,
  updatePayload,
  copied,
  copyToClipboard,
  renderChart,
}) => {
  return (
    <AnimatePresence mode="wait">
      {activeTab === "playground" && (
        <motion.div
          key="playground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {/* Configuration Panel */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
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
                </motion.div>

                <div style={{ display: "grid", gap: "1.25rem" }}>
                  {/* Graph Type Selection */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
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
                          onClick={() => updatePayload("graphType", type.id)}
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
                  </motion.div>

                  {/* Chart Title */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.3 }}
                  >
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
                      onChange={(e) => updatePayload("title", e.target.value)}
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
                  </motion.div>

                  {/* Color Scheme */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
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
                  </motion.div>

                  {/* X-Axis Labels */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75, duration: 0.3 }}
                  >
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
                  </motion.div>

                  {/* Y-Axis Values */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
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
                  </motion.div>
                </div>

                {/* Generated Request Payload */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                  style={{ marginTop: "1.5rem" }}
                >
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
                </motion.div>
              </motion.div>

              {/* Live Preview Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "500",
                      marginBottom: "1rem",
                      color: isDarkMode ? "white" : "#111827",
                    }}
                  >
                    {payload.title || "Untitled Chart"}
                  </motion.div>

                  <motion.div
                    key={`${payload.graphType}-${payload.colorScheme}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                    }}
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

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                    style={{
                      marginTop: "1rem",
                      fontSize: "0.875rem",
                      color: isDarkMode ? "#9ca3af" : "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    <p>
                      Note: This is a simplified preview. The actual API will
                    </p>
                    <p>
                      return a fully styled, interactive chart with animations.
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                  style={{ marginTop: "1.5rem" }}
                >
                  <h4 style={{ fontWeight: "500", marginBottom: "0.5rem" }}>
                    Try It Out
                  </h4>
                  <p style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
                    Copy the payload above and test it with our API endpoint:
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.3 }}
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
                    <code>POST http://localhost:30000/ap/generate-graph</code>
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
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default APIPlayground;
