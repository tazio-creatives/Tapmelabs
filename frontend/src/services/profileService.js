import api from "./api";

// ── GET /api/profiles/me ──────────────────────────────────────────────────────
// Returns the authenticated customer's full profile.

async function getMyProfile() {
  const response = await api.get("/profiles/me");
  return response.data;
}

// ── POST /api/profiles ────────────────────────────────────────────────────────
// Creates the customer's profile (one per user).
// payload: { slug, name, designation, company_name, email, phone, website,
//            social_links, is_public }

async function createProfile(payload) {
  const response = await api.post("/profiles", payload);
  return response.data;
}

// ── PUT /api/profiles/me ──────────────────────────────────────────────────────
// Updates the authenticated customer's profile fields.
// payload: any subset of profile fields (partial update supported).

async function updateMyProfile(payload) {
  const response = await api.put("/profiles/me", payload);
  return response.data;
}

// ── PUT /api/profiles/theme ───────────────────────────────────────────────────
// Updates only the theme_key on the customer's profile.
// payload: { theme_key }

async function updateTheme(theme_key) {
  const response = await api.put("/profiles/theme", { theme_key });
  return response.data;
}

// ── GET /api/profiles/public/:slug ───────────────────────────────────────────
// Public endpoint — no token required.
// Returns a customer's public profile card data (used on /u/:slug).

async function getPublicProfile(slug) {
  const response = await api.get(`/profiles/public/${slug}`);
  return response.data;
}

const profileService = {
  getMyProfile,
  createProfile,
  updateMyProfile,
  updateTheme,
  getPublicProfile,
};

export default profileService;
