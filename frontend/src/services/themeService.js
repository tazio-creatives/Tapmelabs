import api from "./api";

// ── GET /api/themes ───────────────────────────────────────────────────────────
// Returns only active themes. No token required.

async function getActiveThemes() {
  const response = await api.get("/themes");
  return response.data;
}

// ── GET /api/themes/:key ──────────────────────────────────────────────────────
// Returns a single theme by its unique key. No token required.

async function getThemeByKey(key) {
  const response = await api.get(`/themes/${key}`);
  return response.data;
}

const themeService = { getActiveThemes, getThemeByKey };

export default themeService;
