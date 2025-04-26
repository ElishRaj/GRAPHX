import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useAuth } from "./auth";
import Logo from "/logo.png";

const Navbar = ({ darkMode, setDarkMode }) => {
  // Authentication and state management
  const { isAuthenticated, userData, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isDesktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items and refs
  const navItems = ["Home", "Saved", "Workspace", "Prices", "Api", "Settings"];
  const navRefs = useRef([]);
  const containerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const desktopUserMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const userButtonRef = useRef(null);
  const desktopUserButtonRef = useRef(null);

  // Smooth underline animation setup
  const underlineX = useMotionValue(0);
  const underlineWidth = useMotionValue(0);
  const underlineXSpring = useSpring(underlineX, {
    stiffness: 300,
    damping: 25,
    mass: 0.5,
  });
  const underlineWidthSpring = useSpring(underlineWidth, {
    stiffness: 300,
    damping: 25,
  });

  // Track active navigation item
  const [activeIndex, setActiveIndex] = useState(0);

  // Set initial active index based on current path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const index = navItems.findIndex(
      (item) =>
        path === `/${item.toLowerCase()}` || (item === "Home" && path === "/")
    );
    if (index >= 0) {
      setActiveIndex(index);
      updateUnderlinePosition(index);
    }
  }, [location.pathname]);

  // Update underline position on window resize
  useEffect(() => {
    const handleResize = () => {
      updateUnderlinePosition(activeIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  // Handle clicks outside menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        !userButtonRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
      if (
        desktopUserMenuRef.current &&
        !desktopUserMenuRef.current.contains(event.target) &&
        !desktopUserButtonRef.current.contains(event.target)
      ) {
        setDesktopUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update underline position smoothly
  const updateUnderlinePosition = (index) => {
    if (navRefs.current[index] && containerRef.current) {
      const navItem = navRefs.current[index];
      const container = containerRef.current;

      const itemRect = navItem.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const left = itemRect.left - containerRect.left;
      const width = itemRect.width;

      underlineX.set(left);
      underlineWidth.set(width);
    }
  };

  // Handle navigation clicks
  const handleNavClick = (index, path) => {
    setActiveIndex(index);
    updateUnderlinePosition(index);
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Toggle functions
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
    setMobileMenuOpen(false);
  };

  const toggleDesktopUserMenu = () => {
    setDesktopUserMenuOpen(!isDesktopUserMenuOpen);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setUserMenuOpen(false);
      setDesktopUserMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Logout icon component
  const LogoutIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-1"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-10 border-b ${
        darkMode
          ? "bg-gray-900 text-white border-gray-800"
          : "bg-white text-gray-900 border-gray-200"
      } shadow-md transition-colors duration-300`}
    >
      <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} className="h-10 mr-3" alt="GraphX Logo" />
          <span className="text-3xl font-bold">Graph-X</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="relative" ref={containerRef}>
            <ul className="flex items-center space-x-8 font-medium">
              {navItems.map((item, index) => (
                <li key={index} ref={(el) => (navRefs.current[index] = el)}>
                  {item === "Api" ? (
                    <button
                      onClick={() => handleNavClick(index, "/api")}
                      className={`text-lg transition-colors duration-200 ${
                        activeIndex === index
                          ? "text-purple-700 font-semibold"
                          : "hover:text-purple-700"
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <Link
                      to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      onClick={() =>
                        handleNavClick(
                          index,
                          item === "Home" ? "/" : `/${item.toLowerCase()}`
                        )
                      }
                      className={`text-lg transition-colors duration-200 ${
                        activeIndex === index
                          ? "text-purple-700 font-semibold"
                          : "hover:text-purple-700"
                      }`}
                    >
                      {item}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Ultra-smooth Underline */}
            <motion.div
              className={`absolute bottom-0 h-0.5 ${
                darkMode ? "bg-purple-500" : "bg-purple-700"
              } will-change-transform`}
              style={{
                x: underlineXSpring,
                width: underlineWidthSpring,
              }}
            />
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <motion.div
            className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer border shadow ${
              darkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-400"
            }`}
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center"
              animate={{ x: darkMode ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {darkMode ? (
                <Moon className="text-purple-500" />
              ) : (
                <Sun className="text-yellow-500" />
              )}
            </motion.div>
          </motion.div>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={desktopUserMenuRef}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center cursor-pointer"
                onClick={toggleDesktopUserMenu}
                ref={desktopUserButtonRef}
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <span className="text-purple-700 font-bold">
                    {userData?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="font-medium">{userData?.name || "User"}</span>
              </motion.div>

              <AnimatePresence>
                {isDesktopUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } ring-1 ${
                      darkMode ? "ring-gray-700" : "ring-gray-200"
                    } z-50`}
                  >
                    <div className="py-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className={`flex items-center justify-center w-full text-left px-4 py-2 text-sm ${
                          darkMode
                            ? "text-red-400 hover:bg-gray-700"
                            : "text-red-600 hover:bg-gray-100"
                        }`}
                      >
                        <LogoutIcon />
                        <span className="ml-2">Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="bg-purple-700 text-white rounded-lg px-4 py-2 border border-purple-600 shadow-md hover:bg-purple-800 transition-all"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-purple-700 text-white rounded-lg px-4 py-2 border border-purple-600 shadow-md hover:bg-purple-800 transition-all"
                >
                  Get Started
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          {!isAuthenticated ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="bg-purple-700 text-white rounded-lg px-3 py-1 text-sm border border-purple-600 shadow-md hover:bg-purple-800 transition-all"
              >
                Login
              </Link>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg border dark:border-gray-600 border-gray-300 shadow-md"
              onClick={toggleUserMenu}
              ref={userButtonRef}
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-bold">
                  {userData?.name?.charAt(0) || "U"}
                </span>
              </div>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg border dark:border-gray-600 border-gray-300 shadow-md"
            onClick={toggleMobileMenu}
            ref={menuButtonRef}
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8 cursor-pointer" />
            ) : (
              <Menu className="w-8 h-8 cursor-pointer" />
            )}
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`absolute top-full left-0 w-full ${
                darkMode ? "bg-gray-900" : "bg-white"
              } border-t ${
                darkMode ? "border-gray-800" : "border-gray-200"
              } shadow-lg z-40`}
              ref={mobileMenuRef}
            >
              <ul className="flex flex-col space-y-2 p-4">
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="text-center"
                  >
                    {item === "Api" ? (
                      <button
                        onClick={() => handleNavClick(index, "/api")}
                        className={`w-full text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        } ${
                          activeIndex === index
                            ? "text-purple-700 font-semibold"
                            : "hover:text-purple-700"
                        } transition-all duration-300 p-2 rounded-lg ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                      >
                        {item}
                      </button>
                    ) : (
                      <Link
                        to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        onClick={() =>
                          handleNavClick(
                            index,
                            item === "Home" ? "/" : `/${item.toLowerCase()}`
                          )
                        }
                        className={`w-full text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        } ${
                          activeIndex === index
                            ? "text-purple-700 font-semibold"
                            : "hover:text-purple-700"
                        } transition-all duration-300 p-2 rounded-lg ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                      >
                        {item}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile User Menu */}
        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`absolute top-full right-0 w-48 ${
                darkMode ? "bg-gray-900" : "bg-white"
              } border-t ${
                darkMode ? "border-gray-800" : "border-gray-200"
              } shadow-lg z-40`}
              ref={userMenuRef}
            >
              <div className="flex flex-col space-y-2 p-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center"
                >
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white rounded-lg px-4 py-2 border border-red-700 shadow-md hover:bg-red-700 transition-all w-full flex items-center justify-center gap-2"
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
