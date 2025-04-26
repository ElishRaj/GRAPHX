import React, { useEffect, useRef, useState } from "react";

const StepsComponent = ({ isDarkMode }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle dark mode changes
  useEffect(() => {
    if (containerRef.current) {
      const textElements = containerRef.current.querySelectorAll(
        "h1, h2, h3, h4, p, span, li"
      );
      if (isDarkMode) {
        containerRef.current.style.backgroundColor = "#111827";
        textElements.forEach((element) => {
          element.style.color = "#ffffff";
        });
      } else {
        containerRef.current.style.backgroundColor = "#ffffff";
        textElements.forEach((element) => {
          element.style.color = "#000000";
        });
      }
    }
  }, [isDarkMode]);

  // Intersection Observer for line animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Trigger line animation when component is visible
  useEffect(() => {
    if (isVisible) {
      const lines = document.querySelectorAll(".line");
      lines.forEach((line, index) => {
        line.style.animation = `drawLine 1s ${index * 0.5}s forwards`;
      });
    }
  }, [isVisible]);

  return (
    <>
      <style>
        {`
          @keyframes drawLine {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          .line { transform-origin: left; transform: scaleX(0); }
        `}
      </style>

      <section
        ref={containerRef}
        className="flex items-center justify-center min-h-screen bg-gray-50 py-12 sm:py-16 lg:py-20 xl:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest">
              How It Works
            </p>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Visualize Your Data in 4 Simple Steps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-normal lg:text-xl lg:leading-8">
              Create stunning, animated charts and graphs effortlessly
            </p>
          </div>
          <ul className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-10 sm:mt-16 lg:mt-20 lg:max-w-5xl lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-600 group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                ),
                title: "Add Your Data",
                description:
                  "Upload CSV, Excel, or JSON files. Organize your datasets for visualization.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-600 group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                    />
                  </svg>
                ),
                title: "Select Properties",
                description:
                  "Choose chart type and configure axes, labels, and data mappings.",
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 group-hover:text-white"
                  >
                    <path
                      d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12C22 9.79086 17.5228 8 12 8C6.47715 8 2 9.79086 2 12M22 12C22 14.2091 17.5228 16 12 16C6.47715 16 2 14.2091 2 12M12 22C6.47715 22 2 17.5228 2 12M12 22C14.2091 22 16 17.5228 16 12C16 6.47715 14.2091 2 12 2M12 22C9.79086 22 8 17.5228 8 12C8 6.47715 9.79086 2 12 2M2 12C2 6.47715 6.47715 2 12 2"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "Customize Styles",
                description:
                  "Adjust colors, fonts, and animations to match your brand identity.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-600 group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                    />
                  </svg>
                ),
                title: "Export & Share",
                description:
                  "Download in PNG, SVG, or PDF formats. Share insights effortlessly.",
              },
            ].map((step, index) => (
              <li
                key={index}
                className="flex-start group relative flex lg:flex-col"
              >
                {index < 3 && (
                  <span
                    className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)] line"
                    aria-hidden="true"
                  />
                )}
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 transition-all duration-200 group-hover:border-gray-900 group-hover:bg-gray-900">
                  {step.icon}
                </div>
                <div className="ml-6 lg:ml-0 lg:mt-10">
                  <h3 className="text-xl font-bold before:mb-2 before:block before:font-mono before:text-sm">
                    {step.title}
                  </h3>
                  <h4 className="mt-2 text-base">{step.description}</h4>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default StepsComponent;
