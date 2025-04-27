import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "./auth";
import Toast from "./Toast";

const Pricing = ({ isDarkMode,onPlanPurchase }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [toast, setToast] = useState(null);
  const [subscription, setSubscription] = useState({
    plan: null,
    active: false,
    expiresAt: null,
    loading: true,
    error: null,
  });
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [showAlternateMethods, setShowAlternateMethods] = useState(false);
  const [showPlanSwitchModal, setShowPlanSwitchModal] = useState(false);
  const [newPlanDetails, setNewPlanDetails] = useState(null);
  const { isAuthenticated, userData } = useAuth();

  // Load Razorpay script with improved styling
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;

    const style = document.createElement("style");
    style.innerHTML = `
      .razorpay-container {
        font-size: 16px !important;
        min-width: 400px !important;
      }
      .razorpay-container * {
        font-size: inherit !important;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setRazorpayLoaded(true);
      console.log("Razorpay script loaded successfully");
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setToast({ message: "Failed to load payment system", type: "error" });
    };

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById("razorpay-script");
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
      document.head.removeChild(style);
    };
  }, []);

  // Fetch subscription status
  const fetchSubscription = async () => {
    try {
      setSubscription((prev) => ({ ...prev, loading: true, error: null }));
      const response = await axios.get(
        "https://graphx-yky3.onrender.com/api/subscription",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSubscription({
          plan: response.data.subscription?.plan || null,
          active: response.data.subscription?.active || false,
          expiresAt: response.data.subscription?.expiresAt || null,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      setSubscription({
        plan: null,
        active: false,
        expiresAt: null,
        loading: false,
        error:
          err.response?.data?.message || "Failed to load subscription data",
      });
      setToast({
        message: "Failed to load subscription information",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    } else {
      setSubscription({
        plan: null,
        active: false,
        expiresAt: null,
        loading: false,
        error: null,
      });
    }
  }, [isAuthenticated]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handlePayment = async (plan) => {
    if (!isAuthenticated) {
      showToast("Please login to subscribe", "error");
      return;
    }

    if (!razorpayLoaded) {
      showToast("Payment system is still loading, please try again", "error");
      return;
    }

    // Check if user is trying to switch plans
    if (subscription.active && subscription.plan !== plan) {
      const price = plan === "professional" ? 700 : 1499;
      setNewPlanDetails({
        name: plan === "professional" ? "Professional" : "Enterprise",
        price,
      });
      setActivePlan(plan);
      setShowPlanSwitchModal(true);
      return;
    }

    setActivePlan(plan);
    setLoading(true);

    try {
      const response = await axios.post(
        "https://graphx-yky3.onrender.com/api/payment/create-order",
        { plan },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Payment failed");
      }

      const options = {
        key: "rzp_test_fFVSONnYXjlBJT",
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Graph-X",
        description: `Graph-X ${plan} Plan Subscription`,
        order_id: response.data.orderId,
        handler: async function (razorpayResponse) {
          try {
            const verificationResponse = await axios.post(
              "https://graphx-yky3.onrender.com/api/payment/verify",
              {
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verificationResponse.data.success) {
              setSubscription({
                plan: verificationResponse.data.subscription.plan,
                active: verificationResponse.data.subscription.active,
                expiresAt: verificationResponse.data.subscription.expiresAt,
                loading: false,
                error: null,
              });
              setShowPaymentSuccess(true);
              setTimeout(() => {
                setShowPaymentSuccess(false);
              }, 3000);
              showToast(
                "Payment successful! Subscription activated.",
                "success"
              );
              if (onPlanPurchase) {
                onPlanPurchase()
              }
            } else {
              showToast("Payment verification failed", "error");
            }
          } catch (err) {
            console.error("Verification error:", err);
            showToast(
              err.response?.data?.message || "Payment verification failed",
              "error"
            );
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userData?.displayName || userData?.email.split("@")[0],
          email: userData?.email,
        },
        theme: {
          color: isDarkMode ? "#7c3aed" : "#4f46e5",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setPaymentError({
          title: "Payment Failed",
          message:
            response.error.description ||
            "Payment was not completed successfully",
        });
        setShowPaymentFailedModal(true);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError({
        title: "Payment Error",
        message: err.response?.data?.error || err.message,
      });
      setShowPaymentFailedModal(true);
      setLoading(false);
    }
  };

  const confirmPlanSwitch = async () => {
    setShowPlanSwitchModal(false);
    setLoading(true);

    try {
      const response = await axios.post(
        "https://graphx-yky3.onrender.com/api/payment/switch-plan",
        {
          newPlan: activePlan,
          currentPlan: subscription.plan,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Plan switch failed");
      }

      if (response.data.requiresPayment) {
        const options = {
          key: "rzp_test_fFVSONnYXjlBJT",
          amount: response.data.amount,
          currency: response.data.currency,
          name: "Graph-X",
          description: `Plan switch to ${activePlan}`,
          order_id: response.data.orderId,
          handler: async function (razorpayResponse) {
            try {
              const verificationResponse = await axios.post(
                "https://graphx-yky3.onrender.com/api/payment/verify-switch",
                {
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_signature: razorpayResponse.razorpay_signature,
                  newPlan: activePlan,
                },
                { withCredentials: true }
              );

              if (verificationResponse.data.success) {
                setSubscription({
                  plan: verificationResponse.data.subscription.plan,
                  active: verificationResponse.data.subscription.active,
                  expiresAt: verificationResponse.data.subscription.expiresAt,
                  loading: false,
                  error: null,
                });
                setShowPaymentSuccess(true);
                setTimeout(() => {
                  setShowPaymentSuccess(false);
                }, 3000);
                showToast("Plan switched successfully!", "success");
                if (onPlanPurchase) {
                onPlanPurchase()
              }
              } else {
                showToast("Payment verification failed", "error");
                fetchSubscription();
              }
            } catch (err) {
              console.error("Verification error:", err);
              showToast(
                err.response?.data?.message || "Payment verification failed",
                "error"
              );
              fetchSubscription();
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: userData?.displayName || userData?.email.split("@")[0],
            email: userData?.email,
          },
          theme: {
            color: isDarkMode ? "#7c3aed" : "#4f46e5",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          setPaymentError({
            title: "Payment Failed",
            message:
              response.error.description ||
              "Payment was not completed successfully",
          });
          setShowPaymentFailedModal(true);
          setLoading(false);
          fetchSubscription();
        });
        rzp.open();
      } else {
        setSubscription({
          plan: response.data.subscription.plan,
          active: response.data.subscription.active,
          expiresAt: response.data.subscription.expiresAt,
          loading: false,
          error: null,
        });
        showToast("Plan switched successfully!", "success");
        setLoading(false);
      }
    } catch (err) {
      console.error("Plan switch error:", err);
      setPaymentError({
        title: "Switch Error",
        message: err.response?.data?.error || err.message,
      });
      setShowPaymentFailedModal(true);
      setLoading(false);
    }
  };

  const initiateAlternatePayment = (method) => {
    setShowPaymentFailedModal(false);
    showToast(`Initiating ${method} payment...`, "info");
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const plans = [
    {
      name: "Starter",
      price: 0,
      features: [
        "Basic visualization tools",
        "Up to 10,000 data points",
        "PNG exports",
        "Community support",
      ],
      cta: "Get Started",
      gradient: isDarkMode ? ["#1e1b4b", "#312e81"] : ["#f5f3ff", "#ede9fe"],
    },
    {
      name: "Professional",
      price: 700,
      features: [
        "Advanced analytics",
        "Unlimited data points",
        "Interactive dashboards",
        "API access",
        "Priority support",
      ],
      popular: true,
      cta: subscription.plan === "professional" ? "Current Plan" : "Go Pro",
      planId: "professional",
      gradient: isDarkMode ? ["#4c1d95", "#7e22ce"] : ["#ec4899", "#f43f5e"],
      disabled: subscription.plan === "professional",
    },
    {
      name: "Enterprise",
      price: 1499,
      features: [
        "Custom solutions",
        "Team collaboration",
        "Multiple export formats",
        "Advanced processing",
        "Dedicated account manager",
      ],
      cta: subscription.plan === "enterprise" ? "Current Plan" : "Contact Us",
      planId: "enterprise",
      gradient: isDarkMode ? ["#1e1b4b", "#4338ca"] : ["#6366f1", "#8b5cf6"],
      disabled: subscription.plan === "enterprise",
    },
  ];

  return (
    <div
      className={`min-h-screen w-full overflow-hidden relative ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDarkMode ? "bg-purple-500/20" : "bg-pink-500/20"
            }`}
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              opacity: 0,
            }}
            animate={{
              x: [null, Math.random() * 100],
              y: [null, Math.random() * 100],
              opacity: [0, Math.random() * 0.3 + 0.1, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider ${
              isDarkMode
                ? "bg-purple-900/30 text-purple-300 border border-purple-500/30"
                : "bg-pink-100 text-pink-600 border border-pink-200"
            }`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            Flexible Pricing
          </motion.span>

          <motion.h1
            className={`mt-6 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose Your Perfect Plan
          </motion.h1>

          <motion.p
            className={`mt-4 max-w-2xl mx-auto text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transparent pricing that scales with your needs. No hidden fees,
            just powerful insights.
          </motion.p>

          {subscription.active && subscription.expiresAt && (
            <motion.div
              className={`mt-4 px-4 py-2 rounded-lg inline-flex items-center ${
                isDarkMode
                  ? "bg-green-900/30 text-green-300"
                  : "bg-green-100 text-green-800"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Your {subscription.plan} plan is active until{" "}
                {formatDate(subscription.expiresAt)}
              </span>
            </motion.div>
          )}
        </div>

        {/* Pricing cards */}
        {subscription.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const isPopular = plan.popular;
              const isHovered = hoveredIndex === index;
              const isProcessing = loading && activePlan === plan.planId;
              const isCurrentPlan = subscription.plan === plan.planId;

              return (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={!isCurrentPlan ? { y: -10 } : {}}
                >
                  {isHovered && !isCurrentPlan && (
                    <motion.div
                      className={`absolute -inset-2 rounded-2xl blur-md opacity-70 z-0 ${
                        isDarkMode ? "bg-purple-500/30" : "bg-pink-500/30"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 0.7 : 0 }}
                    />
                  )}

                  {isPopular && (
                    <motion.div
                      className={`absolute -top-3 right-6 px-4 py-1 rounded-t-lg text-xs font-bold z-2 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          : "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                      }`}
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                      }}
                    >
                      Most Popular
                    </motion.div>
                  )}

                  <motion.div
                    className={`relative rounded-2xl overflow-hidden h-full flex flex-col ${
                      isDarkMode ? "bg-gray-900/80" : "bg-white/90"
                    } ${isPopular ? "border-2" : "border"} ${
                      isCurrentPlan
                        ? isDarkMode
                          ? "border-emerald-500/50"
                          : "border-emerald-400/50"
                        : isDarkMode
                        ? isPopular
                          ? "border-purple-500/50"
                          : "border-gray-700"
                        : isPopular
                        ? "border-pink-400/50"
                        : "border-gray-200"
                    }`}
                    style={{
                      boxShadow: isDarkMode
                        ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                        : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative p-8 flex-1 flex flex-col">
                      <div className="mb-8">
                        <h3
                          className={`text-2xl font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {plan.name}
                        </h3>

                        <div className="mt-6 flex items-end">
                          <span
                            className={`text-5xl font-extrabold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ₹{plan.price}
                          </span>
                          <span
                            className={`ml-1.5 text-lg font-medium ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            /month
                          </span>
                        </div>
                        <p
                          className={`mt-2 text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {plan.price === 0
                            ? "Free forever"
                            : "Billed annually"}
                        </p>
                      </div>

                      <ul className="space-y-3.5 mb-8 flex-1">
                        {plan.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                          >
                            <svg
                              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                isDarkMode ? "text-purple-400" : "text-pink-500"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span
                              className={`ml-3 ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      <motion.button
                        onClick={() => handlePayment(plan.planId)}
                        disabled={
                          isProcessing ||
                          isCurrentPlan ||
                          !razorpayLoaded ||
                          !isAuthenticated ||
                          plan.price === 0
                        }
                        whileHover={
                          !isProcessing &&
                          !isCurrentPlan &&
                          razorpayLoaded &&
                          isAuthenticated &&
                          plan.price !== 0
                            ? {
                                scale: 1.03,
                                boxShadow: isDarkMode
                                  ? "0 4px 20px -5px rgba(139, 92, 246, 0.5)"
                                  : "0 4px 20px -5px rgba(236, 72, 153, 0.3)",
                              }
                            : {}
                        }
                        whileTap={{ scale: 0.97 }}
                        className={`mt-auto w-full py-3.5 px-6 rounded-lg font-bold transition-all duration-200 flex items-center justify-center ${
                          isCurrentPlan
                            ? isDarkMode
                              ? "bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 cursor-default"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default"
                            : plan.price === 0
                            ? isDarkMode
                              ? "bg-gray-800 text-gray-300 border border-gray-700 cursor-default"
                              : "bg-gray-100 text-gray-700 border border-gray-200 cursor-default"
                            : isPopular
                            ? isDarkMode
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                              : "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/20"
                            : isDarkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                            : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
                        } ${
                          (!isAuthenticated || !razorpayLoaded) &&
                          plan.price !== 0
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {isProcessing ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : isCurrentPlan ? (
                          "Current Plan"
                        ) : !isAuthenticated ? (
                          "Login to Subscribe"
                        ) : plan.price === 0 ? (
                          "Current Plan"
                        ) : (
                          plan.cta
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Enterprise CTA */}
        <motion.div
          className={`mt-16 text-center p-8 rounded-2xl relative overflow-hidden ${
            isDarkMode
              ? "bg-gray-900/60 border border-gray-800"
              : "bg-white/90 border border-gray-200"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative z-10">
            <h3
              className={`text-xl font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Need custom enterprise solutions?
            </h3>
            <p
              className={`mt-2 max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We offer tailored solutions for large organizations with specific
              requirements.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Schedule demo
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center ${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-300 hover:text-purple-200 border border-purple-500/30"
                    : "bg-gradient-to-r from-pink-100 to-red-100 text-pink-600 hover:text-pink-700 border border-pink-200"
                }`}
              >
                Contact sales
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Success Animation */}
      <AnimatePresence>
        {showPaymentSuccess && (
          <div className="fixed inset-0 overflow-hidden z-50 pointer-events-none">
            {[...Array(200)].map((_, i) => {
              const colors = isDarkMode
                ? ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"]
                : ["#f43f5e", "#ec4899", "#8b5cf6", "#3b82f6", "#10b981"];
              const color = colors[Math.floor(Math.random() * colors.length)];
              const size = Math.random() * 8 + 4;
              const angle = Math.random() * 360;
              const distance = Math.random() * 300 + 100;

              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: color,
                    width: size,
                    height: size,
                    left: "50%",
                    top: "50%",
                    x: 0,
                    y: 0,
                    originX: 0,
                    originY: 0,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    x: [
                      0,
                      Math.cos((angle * Math.PI) / 180) * distance,
                      Math.cos((angle * Math.PI) / 180) * (distance * 1.2),
                    ],
                    y: [
                      0,
                      Math.sin((angle * Math.PI) / 180) * distance,
                      Math.sin((angle * Math.PI) / 180) * (distance * 1.2),
                    ],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    delay: Math.random() * 0.3,
                  }}
                />
              );
            })}

            {/* Success message */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center pt-48"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className={`p-6 rounded-xl max-w-md mx-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-2xl text-center`}
              >
                <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                <p className="mb-4">
                  Your {activePlan} plan is now active.
                  {subscription.expiresAt && (
                    <span className="block mt-2 text-sm opacity-80">
                      Expires on: {formatDate(subscription.expiresAt)}
                    </span>
                  )}
                </p>
                <motion.button
                  onClick={() => setShowPaymentSuccess(false)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Failed Modal */}
      {showPaymentFailedModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg max-w-md w-full mx-4 transition-all duration-500 ease-in-out ${
              isDarkMode
                ? "bg-gray-800/90 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                : "bg-white/90 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            } ${
              showPaymentFailedModal
                ? "animate-[fadeIn_0.3s_ease-in-out_forwards,scaleIn_0.3s_ease-in-out_forwards]"
                : "animate-[fadeOut_0.3s_ease-in-out_forwards,scaleOut_0.3s_ease-in-out_forwards]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3
                className={`text-xl font-bold ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {paymentError?.title || "Payment Failed"}
              </h3>
              <button
                onClick={() => setShowPaymentFailedModal(false)}
                className={`text-2xl leading-none p-1 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-red-400"
                    : "text-gray-500 hover:text-red-600"
                }`}
              >
                &times;
              </button>
            </div>

            <div className="mb-6">
              <p
                className={`font-medium mb-2 ${
                  isDarkMode ? "text-red-300" : "text-red-500"
                }`}
              >
                {paymentError?.message || "The payment could not be completed."}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Please try again or use a different payment method.
              </p>
            </div>

            {!showAlternateMethods ? (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setShowPaymentFailedModal(false);
                    if (activePlan) handlePayment(activePlan);
                  }}
                  className={`py-2.5 px-4 rounded-lg font-medium transition-all ${
                    isDarkMode
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_14px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.5)]"
                      : "bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_14px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]"
                  }`}
                >
                  Try Again
                </button>
                <button
                  onClick={() => setShowAlternateMethods(true)}
                  className={`py-2.5 px-4 rounded-lg font-medium border transition-all ${
                    isDarkMode
                      ? "border-gray-600 hover:bg-gray-700/50 text-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
                      : "border-gray-300 hover:bg-gray-100 text-gray-800 shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  Try Different Payment Method
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <h4
                  className={`font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Select Payment Method:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => initiateAlternatePayment("upi")}
                    className={`p-3 rounded-lg border flex flex-col items-center transition-all ${
                      isDarkMode
                        ? "border-gray-600 hover:bg-gray-700/50 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(239,68,68,0.2)]"
                        : "border-gray-300 hover:bg-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(220,38,38,0.1)]"
                    }`}
                  >
                    <div className="h-8 mb-1 flex items-center justify-center text-2xl">
                      💳
                    </div>
                    <span>UPI Apps</span>
                  </button>
                  <button
                    onClick={() => initiateAlternatePayment("paytm")}
                    className={`p-3 rounded-lg border flex flex-col items-center transition-all ${
                      isDarkMode
                        ? "border-gray-600 hover:bg-gray-700/50 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(239,68,68,0.2)]"
                        : "border-gray-300 hover:bg-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(220,38,38,0.1)]"
                    }`}
                  >
                    <div className="h-8 mb-1 flex items-center justify-center text-2xl">
                      🏦
                    </div>
                    <span>Paytm</span>
                  </button>
                  <button
                    onClick={() => initiateAlternatePayment("card")}
                    className={`p-3 rounded-lg border flex flex-col items-center transition-all ${
                      isDarkMode
                        ? "border-gray-600 hover:bg-gray-700/50 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(239,68,68,0.2)]"
                        : "border-gray-300 hover:bg-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(220,38,38,0.1)]"
                    }`}
                  >
                    <div className="h-8 mb-1 flex items-center justify-center text-2xl">
                      💳
                    </div>
                    <span>Card</span>
                  </button>
                  <button
                    onClick={() => initiateAlternatePayment("netbanking")}
                    className={`p-3 rounded-lg border flex flex-col items-center transition-all ${
                      isDarkMode
                        ? "border-gray-600 hover:bg-gray-700/50 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(239,68,68,0.2)]"
                        : "border-gray-300 hover:bg-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(220,38,38,0.1)]"
                    }`}
                  >
                    <div className="h-8 mb-1 flex items-center justify-center text-2xl">
                      🏛️
                    </div>
                    <span>Net Banking</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowAlternateMethods(false)}
                  className={`mt-3 text-sm ${
                    isDarkMode
                      ? "text-gray-400 hover:text-red-400"
                      : "text-gray-500 hover:text-red-600"
                  }`}
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Plan Switch Modal */}
      {showPlanSwitchModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
          <style>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0) translateX(0);
        }
        50% {
          transform: translateY(-20px) translateX(10px);
        }
      }
      @keyframes float-delay {
        0%, 100% {
          transform: translateY(0) translateX(0);
        }
        50% {
          transform: translateY(15px) translateX(-10px);
        }
      }
      .animate-float {
        animation: float 8s ease-in-out infinite;
      }
      .animate-float-delay {
        animation: float-delay 10s ease-in-out infinite;
      }
    `}</style>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="relative"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: 10 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
              whileHover={{
                backdropFilter: "blur(12px)",
                boxShadow: isDarkMode
                  ? "0 0 40px rgba(103, 58, 183, 0.4)"
                  : "0 0 40px rgba(98, 0, 238, 0.2)",
              }}
              className={`p-6 rounded-2xl max-w-md w-full mx-4 border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-900/80 border-gray-700 shadow-[0_0_30px_rgba(103,58,183,0.3)] backdrop-blur-md"
                  : "bg-white/80 border-gray-200 shadow-[0_0_30px_rgba(98,0,238,0.1)] backdrop-blur-md"
              }`}
            >
              <div className="flex justify-between items-center mb-5">
                <h3
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  Switch Your Plan?
                </h3>
                <motion.button
                  onClick={() => setShowPlanSwitchModal(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 rounded-full ${
                    isDarkMode
                      ? "text-gray-400 hover:bg-gray-700 hover:text-indigo-300"
                      : "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                  } transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              </div>

              <div className="mb-6">
                <p
                  className={`mb-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  You already have an active{" "}
                  <span className="font-bold text-indigo-500">
                    {subscription.plan}
                  </span>{" "}
                  plan
                  {subscription.expiresAt &&
                    ` (expires on ${formatDate(subscription.expiresAt)})`}
                  . Are you sure you want to switch to{" "}
                  <span className="font-bold text-indigo-500">
                    {newPlanDetails?.name}
                  </span>{" "}
                  plan for ₹{newPlanDetails?.price}/month?
                </p>

                <motion.div
                  whileHover={{
                    scale: 1.01,
                    boxShadow: isDarkMode
                      ? "0 8px 25px rgba(63, 81, 181, 0.25)"
                      : "0 8px 25px rgba(98, 0, 238, 0.15)",
                  }}
                  className={`p-4 rounded-xl mb-4 border transition-all ${
                    isDarkMode
                      ? "bg-gray-800/60 border-indigo-900/50 shadow-[0_4px_20px_rgba(63,81,181,0.15)] hover:bg-gray-800/80"
                      : "bg-indigo-50/80 border-indigo-200 shadow-[0_4px_20px_rgba(98,0,238,0.08)] hover:bg-indigo-50"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
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
                      className="inline mr-2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Important Notes:
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li className="leading-snug">
                      Your current plan will be canceled immediately
                    </li>
                    <li className="leading-snug">
                      You'll be charged the remaining ₹799 for the upgrade
                    </li>
                    <li className="leading-snug">
                      Your new plan will be active immediately
                    </li>
                  </ul>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={() => setShowPlanSwitchModal(false)}
                  className={`py-2.5 px-6 rounded-xl font-medium transition-all relative overflow-hidden group ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600"
                      : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                  whileHover={{
                    y: -2,
                    boxShadow: isDarkMode
                      ? "0 5px 15px rgba(0,0,0,0.3)"
                      : "0 5px 15px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Cancel</span>
                  <span
                    className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-gray-700/30 to-gray-800/30"
                        : "bg-gradient-to-br from-gray-100/30 to-white/30"
                    }`}
                  ></span>
                </motion.button>

                <motion.button
                  onClick={confirmPlanSwitch}
                  className={`py-2.5 px-6 rounded-xl font-medium text-white transition-all relative overflow-hidden group ${
                    isDarkMode
                      ? "bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600"
                      : "bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600"
                  }`}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 5px 20px rgba(98, 0, 238, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Confirm Upgrade (₹799)
                  </span>
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300"></span>
                </motion.button>
              </div>

              {/* Animated background elements */}
              {isDarkMode ? (
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-20 -z-10">
                  <div className="absolute top-0 left-1/4 w-32 h-32 bg-indigo-900 rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
                  <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-900 rounded-full mix-blend-overlay filter blur-3xl animate-float-delay"></div>
                </div>
              ) : (
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-20 -z-10">
                  <div className="absolute top-0 left-1/4 w-32 h-32 bg-indigo-200 rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
                  <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-100 rounded-full mix-blend-overlay filter blur-3xl animate-float-delay"></div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default Pricing;
