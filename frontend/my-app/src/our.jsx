import React, { useEffect, useState, useRef } from "react";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";

const AchievementItem = ({ icon, value, label, isDarkMode }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, "")); // Extract numeric value
    const duration = 2000; // Animation duration in milliseconds
    const increment = end / (duration / 16); // Calculate increment per frame

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col justify-center items-center px-4 h-[126px] w-[100%] md:w-[281px] md:h-[192px] rounded-lg justify-self-center hover:scale-105 transition-transform duration-300 ${
        isDarkMode
          ? "bg-[#111827] border border-[#374151]" // Dark mode styles
          : "bg-[#FFF6F3] border border-[#E5E7EB]" // Light mode styles
      }`}
    >
      <div className="flex flex-row justify-center items-center">
        {icon}
        <p
          className={`font-bold text-3xl sm:text-4xl lg:text-5xl leading-9 ml-2 ${
            isDarkMode ? "text-white" : "text-primary"
          }`}
        >
          {count}+
        </p>
      </div>
      <p
        className={`font-medium text-base sm:text-lg leading-6 mt-3 md:mt-6 text-center ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {label}
      </p>
    </motion.div>
  );
};

const AchievementsSection = ({ isDarkMode }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      if (isDarkMode) {
        containerRef.current.style.backgroundColor = "#111827"; // Dark Mode Background
        containerRef.current.style.color = "#ffffff"; // Dark Mode Text
      } else {
        containerRef.current.style.backgroundColor = "#ffffff"; // Light Mode Background
        containerRef.current.style.color = "#000000"; // Light Mode Text
      }
    }
  }, [isDarkMode]);

  const achievements = [
    {
      icon: (
        <svg
          className="w-[35px] h-[35px] md:w-[50px] md:h-[50px]"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M39.37 18.432c0 3.058-.906 5.862-2.466 8.203a14.728 14.728 0 0 1-10.079 6.367c-.717.127-1.455.19-2.214.19-.759 0-1.497-.063-2.214-.19a14.728 14.728 0 0 1-10.078-6.368 14.692 14.692 0 0 1-2.467-8.202c0-8.16 6.6-14.76 14.76-14.76s14.759 6.6 14.759 14.76Z"
            stroke="#FF6D42"
            strokeWidth="3.473"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="m44.712 38.17-3.431.83a2.063 2.063 0 0 0-1.539 1.572l-.728 3.122c-.09.384-.281.734-.554 1.012a2.068 2.068 0 0 1-.992.564c-.375.09-.768.073-1.134-.052a2.078 2.078 0 0 1-.938-.653l-9.92-11.64-9.92 11.661a2.078 2.078 0 0 1-.938.653 2.038 2.038 0 0 1-1.134.052 2.067 2.067 0 0 1-.992-.563 2.137 2.137 0 0 1-.554-1.012l-.728-3.123a2.13 2.13 0 0 0-.55-1.01 2.06 2.06 0 0 0-.988-.562L6.24 38.19a2.073 2.073 0 0 1-.956-.533 2.14 2.14 0 0 1-.563-.953 2.175 2.175 0 0 1-.015-1.113c.091-.366.276-.7.536-.97l8.11-8.284a14.672 14.672 0 0 0 4.307 4.281 14.34 14.34 0 0 0 5.634 2.134 12.29 12.29 0 0 0 2.183.191c.749 0 1.477-.063 2.184-.19 4.138-.617 7.694-3.017 9.94-6.416l8.11 8.285c1.144 1.147.583 3.165-.998 3.547Zm-18.03-26.532 1.227 2.507c.167.34.603.68.998.743l2.226.383c1.414.233 1.747 1.296.727 2.336l-1.726 1.764c-.29.297-.457.87-.353 1.295l.499 2.188c.395 1.721-.5 2.4-1.996 1.487l-2.08-1.253a1.434 1.434 0 0 0-1.372 0l-2.08 1.253c-1.497.892-2.392.234-1.996-1.487l.499-2.188c.083-.403-.063-.998-.354-1.295l-1.726-1.764c-1.019-1.04-.686-2.081.728-2.336l2.225-.383c.375-.063.811-.403.977-.743l1.227-2.507c.604-1.36 1.685-1.36 2.35 0Z"
            stroke="#FF6D42"
            strokeWidth="3.473"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
      value: "75K+",
      label: "Daily Visits",
    },
    {
      icon: (
        <div className="flex items-center space-x-1">
          {[...Array(4)].map((_, i) => (
            <motion.svg
              key={i}
              className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] fill-current text-[#FF6D42] hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              whileHover={{ scale: 1.2 }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </motion.svg>
          ))}
          <motion.svg
            className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] fill-current text-[#FF6D42] hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={{ scale: 1.2 }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zM12 5.1v12.6l4.18 2.2-.8-4.66 3.39-3.3-4.69-.68L12 5.1z" />
          </motion.svg>
        </div>
      ),
      value: "5.0",
      label: "Average Rating",
    },
    {
      icon: (
        <svg
          className="w-[35px] h-[35px] md:w-[50px] md:h-[50px]"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            clipPath="url(#a)"
            stroke="#FF6D42"
            strokeWidth="3.473"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.811 39.091c-1.775-1.775-.598-5.505-1.5-7.69-.939-2.255-4.377-4.089-4.377-6.5 0-2.413 3.438-4.246 4.376-6.502.903-2.182-.274-5.914 1.501-7.69 1.776-1.775 5.508-.598 7.69-1.5 2.266-.939 4.09-4.377 6.501-4.377 2.412 0 4.246 3.438 6.501 4.376 2.185.903 5.915-.274 7.69 1.501 1.776 1.776.598 5.506 1.502 7.69.937 2.266 4.376 4.09 4.376 6.501 0 2.412-3.439 4.246-4.377 6.501-.903 2.185.274 5.915-1.5 7.69-1.776 1.776-5.506.598-7.69 1.501-2.256.938-4.09 4.377-6.502 4.377s-4.245-3.439-6.5-4.377c-2.183-.903-5.915.275-7.69-1.5Z"></path>
            <path d="m17.281 26.444 4.632 4.631L32.718 20.27"></path>
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M.3.2h49.4v49.4H.3z"></path>
            </clipPath>
          </defs>
        </svg>
      ),
      value: "8900+",
      label: "Sessions Completed",
    },
    {
      icon: (
        <svg
          className="w-[35px] h-[35px] md:w-[50px] md:h-[50px]"
          viewBox="0 0 51 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M45.571 12.006 27.046 30.531l-7.719-7.718L5.434 36.706"
            stroke="#FF6D42"
            strokeWidth="4.341"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M45.569 24.356v-12.35h-12.35"
            stroke="#FF6D42"
            strokeWidth="4.341"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
      value: "1.5M+",
      label: "Downloads",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="flex flex-col  py-10 transition-colors duration-300"
    >
      <p className="font-semibold text-3xl md:text-4xl text-center">
        Our Outstanding Achievements
      </p>
      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-y-5 lg:gap-y-0 gap-x-5 place-items-center w-full mx-auto max-w-7xl px-5">
        {achievements.map((achievement, index) => (
          <AchievementItem
            key={index}
            {...achievement}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </section>
  );
};

export default AchievementsSection;
