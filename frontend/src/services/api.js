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
// Exception: payment gateway endpoints — a 401 there means bad API keys on the
// backend, not an expired user session, so we must NOT log the user out.

const PAYMENT_PATHS = ["/payments/create-razorpay-order", "/payments/verify-razorpay-payment"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isPaymentEndpoint = PAYMENT_PATHS.some((p) => url.includes(p));
    if (error.response?.status === 401 && !isPaymentEndpoint && typeof window !== "undefined") {
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customerUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
