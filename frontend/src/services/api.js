import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attach JWT token from localStorage on every outgoing request.

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("customerToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
// On 401, clear stored credentials and redirect to login.
// Exceptions: auth endpoints (wrong password is a 401 but not a session expiry)
// and payment gateway endpoints (401 there means bad backend API keys).

const NO_REDIRECT_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/payments/create-razorpay-order",
  "/payments/verify-razorpay-payment",
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const skipRedirect =
      NO_REDIRECT_PATHS.some((p) => url.includes(p)) ||
      (typeof window !== "undefined" && window.location.pathname === "/login");
    if (error.response?.status === 401 && !skipRedirect && typeof window !== "undefined") {
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customerUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
