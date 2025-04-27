import { useState, useEffect, useCallback } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./auth";
import Navbar from "./Nav";
import AnimationPage from "./Them";
import WelcomeBackForm from "./login";
import RegisterForm from "./register";
import VisualizeData from "./models";
import ChartName from "./charname";
import AchievementsSection from "./our";
import StepsComponent from "./user";
import Workspace from "./m";
import ChartContainer from "./chartcomponent";
import Footer from "./footer";
import MaintenancePage from "./devlopingstate";
import Pricing from "./pricing";
import PageNotFound from "./pagenotfuound";
import GraphXAPIDocumentation from "./Api";
import GraphManager from "./Graphmanger";
import Loading from "./LOADING";

function App() {
  const { isAuthenticated, userData, loading: authLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [premier, setPremier] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show login success message if URL has login_success param
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("login_success")) {
      setShowLoginSuccess(true);
      const timer = setTimeout(() => setShowLoginSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // Loading animation control (shows only once per session)
  useEffect(() => {
    const hasShownLoading = sessionStorage.getItem("hasShownLoading");
    if (hasShownLoading) {
      setAppLoading(false);
    } else {
      const timer = setTimeout(() => {
        setAppLoading(false);
        sessionStorage.setItem("hasShownLoading", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Memoized subscription fetch function
  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setPremier(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:30000/api/subscription",
        { withCredentials: true }
      );
      setPremier(!!response.data.subscription?.plan);
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      setPremier(false);
    }
  }, [isAuthenticated]);

  // Check subscription status when authentication changes
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleLoginSuccess = (user) => {
    fetchSubscription();
    navigate("/dashboard?login_success=true");
  };

  const handlePlanPurchase = useCallback(() => {
    setPremier(true);
  }, []);

  if (authLoading || appLoading) {
    return <Loading darkMode={darkMode} />;
  }

  // Dashboard component to avoid duplication
  const Dashboard = () => (
    <>
      {showLoginSuccess && (
        <div
          className={`fixed top-20 right-4 px-4 py-2 rounded-md z-50 ${
            darkMode ? "bg-green-700 text-white" : "bg-green-500 text-white"
          }`}
        >
          Login successful!
        </div>
      )}
      <AnimationPage isDarkMode={darkMode} />
      <VisualizeData isDarkMode={darkMode} premier={premier} />
      <AchievementsSection isDarkMode={darkMode} />
      <StepsComponent isDarkMode={darkMode} />
      <Footer
        isDarkMode={darkMode}
        user={isAuthenticated ? userData : null}
        onLoginRequest={() => navigate("/login")}
      />
    </>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#111827] text-white" : "bg-[#FFF6F3] text-black"
      }`}
    >
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAuthenticated={isAuthenticated}
        userData={userData}
        premier={premier}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />

        <Route
          path="/prices"
          element={
            <Pricing
              isDarkMode={darkMode}
              premier={premier}
              onPlanPurchase={handlePlanPurchase}
            />
          }
        />
        <Route
          path="/login"
          element={
            <WelcomeBackForm
              isDarkMode={darkMode}
              onLoginSuccess={handleLoginSuccess}
            />
          }
        />
        <Route
          path="/register"
          element={<RegisterForm isDarkMode={darkMode} />}
        />

        {/* Protected Routes */}
        <Route
          path="/workspace"
          element={
            isAuthenticated ? (
              <Workspace
                graphTitle="My Chart"
                isDarkMode={darkMode}
                premier={premier}
              />
            ) : (
              <WelcomeBackForm
                isDarkMode={darkMode}
                onLoginSuccess={handleLoginSuccess}
              />
            )
          }
        />
        <Route
          path="/generate"
          element={
            isAuthenticated ? (
              <ChartContainer isDarkMode={darkMode} premier={premier} />
            ) : (
              <WelcomeBackForm
                isDarkMode={darkMode}
                onLoginSuccess={handleLoginSuccess}
              />
            )
          }
        />

        {/* Maintenance/Placeholder Routes */}
        <Route
          path="/working"
          element={<MaintenancePage isDarkMode={darkMode} />}
        />
        <Route
          path="/Api"
          element={<GraphXAPIDocumentation isDarkMode={darkMode} />}
        />
        <Route
          path="/settings"
          element={<MaintenancePage isDarkMode={darkMode} />}
        />

        {/* Special Routes */}
        <Route
          path="/chartname"
          element={<ChartName isDarkMode={darkMode} />}
        />
        <Route
          path="/errorr"
          element={<PageNotFound isDarkMode={darkMode} />}
        />
        <Route
          path="/saved"
          element={
            isAuthenticated ? (
              <GraphManager isDarkMode={darkMode} premier={premier} />
            ) : (
              <WelcomeBackForm
                isDarkMode={darkMode}
                onLoginSuccess={handleLoginSuccess}
              />
            )
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound isDarkMode={darkMode} />} />
      </Routes>
    </div>
  );
}

export default App;
