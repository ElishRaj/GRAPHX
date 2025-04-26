// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("http://localhost:30000/auth/status", {
        withCredentials: true,
      });

      setIsAuthenticated(response.data.isAuthenticated);
      if (response.data.user) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Set up periodic auth checks (every 5 minutes)
    const interval = setInterval(checkAuthStatus, 300000);
    return () => clearInterval(interval);
  }, []);

  const login = (user) => {
    setIsAuthenticated(true);
    setUserData(user);
  };

  const logout = async () => {
    try {
      await axios.post(
        " http://localhost:30000/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userData,
        loading,
        login,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
