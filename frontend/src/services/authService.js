import api from "./api";

// ── POST /api/auth/register ───────────────────────────────────────────────────

async function register({ full_name, email, phone, password }) {
  const response = await api.post("/auth/register", { full_name, email, phone, password });
  return response.data;
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────

async function login({ email, password }) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────

async function verifyOtp({ email, otp }) {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
}

// ── POST /api/auth/resend-otp ─────────────────────────────────────────────────

async function resendOtp({ email }) {
  const response = await api.post("/auth/resend-otp", { email });
  return response.data;
}

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// Returns the currently authenticated user (requires customerToken).

async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// Call saveSession after a successful login/register to persist credentials.

function saveSession(token, user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("customerToken", token);
  localStorage.setItem("customerUser", JSON.stringify(user));
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("customerToken");
  localStorage.removeItem("customerUser");
}

function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("customerUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("customerToken"));
}

const authService = { register, login, verifyOtp, resendOtp, getMe, saveSession, clearSession, getStoredUser, isLoggedIn };

export default authService;
