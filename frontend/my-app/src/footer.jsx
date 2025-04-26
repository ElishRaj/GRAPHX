import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import log from "/logo.png";
import { Link } from "react-router-dom";

const Footer = ({ isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const y = useTransform(scrollYProgress, [0.8, 0.9], [50, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const linkHoverVariants = {
    hover: {
      x: 5,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const socialHoverVariants = {
    hover: {
      y: -5,
      scale: 1.1,
      transition: { type: "spring", stiffness: 400 },
    },
    tap: { scale: 0.9 },
  };

  const quickLinks = [
    { title: "Pricing", icon: "💰", path: "/prices" },
    { title: "About", icon: "ℹ️", path: "/errorr" },
    { title: "Help", icon: "❓", path: "/errorr" },
    { title: "Models", icon: "🧠", path: "/models" },
    { title: "Saved", icon: "💾", path: "/saved" },
  ];

  const resourcesLinks = [
    { title: "Terms", icon: "📜", path: "/errorr" },
    { title: "Documentation", icon: "📚", path: "/Api" },
    { title: "Tutorials", icon: "🎓", path: "/Api" },
    { title: "Community", icon: "👥", path: "/errorr" },
  ];

  const socialIcons = [
    {
      name: "twitter",
      color: "#1DA1F2",
      path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
      url: "https://twitter.com",
    },
    {
      name: "github",
      color: isDarkMode ? "#E2E8F0" : "#1F2937",
      path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
      url: "https://github.com",
    },
    {
      name: "linkedin",
      color: "#0A66C2",
      path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
      url: "https://linkedin.com",
    },
    {
      name: "instagram",
      color: isDarkMode ? "#F472B6" : "#DB2777",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
      url: "https://instagram.com",
    },
    {
      name: "facebook",
      color: "#1877F2",
      path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
      url: "https://facebook.com",
    },
    {
      name: "discord",
      color: "#5865F2",
      path: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
      url: "https://discord.com",
    },
  ];

  // Create a motion-enhanced Link component
  const MotionLink = motion(Link);

  return (
    <motion.footer
      style={{ opacity, y }}
      className={`w-full px-4 py-12 md:py-20 lg:px-8 ${
        isDarkMode
          ? "bg-gray-950 text-gray-100"
          : "bg-gray-50 text-gray-900 border-t border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div
            variants={itemVariants}
            className="sm:col-span-2 lg:col-span-1 space-y-4"
          >
            <div className="flex items-center space-x-3">
              <motion.img
                src={log}
                alt="Graph-X Logo"
                className="w-10 h-10 rounded-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring" }}
              />
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Graph-X
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Data Visualization Evolved
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p
                className={`leading-relaxed ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Transform complex data into beautiful, actionable insights with
                our next-gen visualization tools.
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Trusted by Fortune 500 companies and academic institutions
                worldwide.
              </p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            className="space-y-5 px-2 sm:px-4 lg:px-6"
          >
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <motion.li
                  key={item.title}
                  onHoverStart={() => setIsHovered(item.title)}
                  onHoverEnd={() => setIsHovered(null)}
                  variants={linkHoverVariants}
                  animate={isHovered === item.title ? "hover" : "initial"}
                  className="overflow-hidden"
                >
                  <Link
                    to={item.path}
                    className={`flex items-center text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } hover:text-purple-500 transition-colors group pl-2`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <motion.span
                      className="inline-block"
                      animate={{
                        x: isHovered === item.title ? 5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {item.title}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            variants={itemVariants}
            className="space-y-5 px-2 sm:px-4 lg:px-6"
          >
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Resources
            </h3>
            <ul className="space-y-3">
              {resourcesLinks.map((item) => (
                <motion.li
                  key={item.title}
                  onHoverStart={() => setIsHovered(item.title)}
                  onHoverEnd={() => setIsHovered(null)}
                  variants={linkHoverVariants}
                  animate={isHovered === item.title ? "hover" : "initial"}
                  className="overflow-hidden"
                >
                  <Link
                    to={item.path}
                    className={`flex items-center text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } hover:text-purple-500 transition-colors group pl-2`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <motion.span
                      className="inline-block"
                      animate={{
                        x: isHovered === item.title ? 5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {item.title}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* API Block - Full width on mobile */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-5"
          >
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Developer API
            </h3>
            <div
              className={`p-4 rounded-xl ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              } border ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              } shadow-sm w-full`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="font-medium">Powerful GraphQL API</h4>
              </div>
              <p
                className={`text-sm mb-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Integrate with our robust API to build custom solutions and
                automate workflows.
              </p>
              <MotionLink
                to="/Api"
                className={`inline-flex items-center text-sm font-medium px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-purple-400"
                    : "bg-gray-100 hover:bg-gray-200 text-purple-600"
                } transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                API Documentation
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </MotionLink>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`my-8 md:my-12 h-px ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"
              : "bg-gradient-to-r from-gray-50 via-gray-200 to-gray-50"
          }`}
        />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-6"
        >
          <p
            className={`text-xs sm:text-sm mt-4 md:mt-0 ${
              isDarkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            © {new Date().getFullYear()} Graph-X. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
              {socialIcons.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`p-2 rounded-full transition-all shadow-sm flex items-center justify-center ${
                    isDarkMode
                      ? "bg-gray-900 hover:bg-gray-800"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  style={{
                    boxShadow: isDarkMode
                      ? `0 2px 4px rgba(0,0,0,0.3)`
                      : `0 2px 6px rgba(0,0,0,0.05)`,
                  }}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill={social.color}
                  >
                    <path d={social.path} />
                  </svg>
                </motion.a>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                isDarkMode
                  ? "bg-gray-900 hover:bg-gray-800"
                  : "bg-white hover:bg-gray-100"
              } transition-all shadow-sm flex items-center gap-1 sm:gap-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <span>🌐</span>
              <span>English</span>
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
