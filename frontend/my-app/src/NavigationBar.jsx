import React from "react";

const navIcons = {
  dataSettings: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h7M3 14h7M3 18h7M14 4h7M14 8h7M14 12h7M14 16h7M14 20h7"
      />
    </svg>
  ),
  appearanceSettings: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6 16h12M9 20h6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  animationOptions: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14M12 5v14M5 5l14 14M5 19l14-14"
      />
    </svg>
  ),
  gridConfiguration: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24" // Fixed this line
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="4"
        width="5"
        height="5"
        stroke="currentColor"
        strokeWidth={2}
      />
      <rect
        x="15"
        y="4"
        width="5"
        height="5"
        stroke="currentColor"
        strokeWidth={2}
      />
      <rect
        x="4"
        y="15"
        width="5"
        height="5"
        stroke="currentColor"
        strokeWidth={2}
      />
      <rect
        x="15"
        y="15"
        width="5"
        height="5"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  ),
  legendManagement: (
    <svg
      className="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="4" rx="1" />
      <rect x="4" y="10" width="12" height="4" rx="1" />
      <rect x="4" y="16" width="8" height="4" rx="1" />
    </svg>
  ),
  fontSettings: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 20h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4l-5 16h10l-5-16z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  tooltipSettings: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m0-12l-4 4m4-4l4 4"
      />
    </svg>
  ),
  ticksSettings: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M4 4h16M4 20h16"
      />
    </svg>
  ),
};

const NavigationBar = ({
  activeCustomization,
  handleNavClick,
  isNavExpanded,
  setIsNavExpanded,
  isDarkMode,
}) => {
  return (
    <div
      className={`fixed left-0 top-18 h-full ${
        isDarkMode
          ? "bg-[#111827] border-[#374151]"
          : "bg-[#FFF6F3] border-[#E5E7EB]"
      } shadow-lg shadow-gray-400 border-r transition-all duration-300 ease-in-out ${
        isNavExpanded ? "w-64" : "w-16"
      }`}
      style={{ zIndex: 10 }}
      onMouseEnter={() => setIsNavExpanded(true)}
      onMouseLeave={() => setIsNavExpanded(false)}
    >
      <div className="flex flex-col space-y-4 mt-10">
        {[
          { id: "dataSettings", label: "Data Settings" },
          { id: "appearanceSettings", label: "Appearance" },
          { id: "fontSettings", label: "Font Settings" },
          { id: "gridConfiguration", label: "Grid Configurations" },
          { id: "legendManagement", label: "Legend Management" },
          { id: "animationOptions", label: "Animation Options" },
          { id: "tooltipSettings", label: "Tooltip Settings" },
          { id: "ticksSettings", label: "Ticks Settings" }, // New item added
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center ${
              isNavExpanded ? "justify-start px-4" : "justify-center"
            } py-2 rounded-lg transition-all duration-300 ${
              isNavExpanded
                ? isDarkMode
                  ? "hover:bg-[#374151]"
                  : "hover:bg-gray-100"
                : ""
            } ${
              activeCustomization === tab.id
                ? isDarkMode
                  ? "bg-[#1F2937] text-white"
                  : "bg-indigo-50 text-indigo-600"
                : isDarkMode
                ? "text-gray-400"
                : "text-gray-600"
            }`}
            onClick={() => handleNavClick(tab.id)}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 p-2 rounded-full transition-all duration-300 ${
                activeCustomization === tab.id
                  ? isDarkMode
                    ? "bg-[#374151] text-white"
                    : "bg-indigo-500 text-white"
                  : isDarkMode
                  ? "bg-[#1F2937] text-gray-400"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {navIcons[tab.id]}
            </div>
            {isNavExpanded && (
              <div
                className="overflow-hidden transition-all duration-300 ml-6"
                style={{ whiteSpace: "nowrap" }}
              >
                <span
                  className={`capitalize ${
                    activeCustomization === tab.id
                      ? isDarkMode
                        ? "font-semibold text-white"
                        : "font-semibold text-indigo-600"
                      : ""
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationBar;