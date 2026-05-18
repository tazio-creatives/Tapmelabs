import api from "./api";

// ── POST /api/analytics/visit ─────────────────────────────────────────────────
// Public — records an NFC tap, QR scan, or profile view.
// Call this on every /u/:slug page load.
//
// payload: { profile_id, visit_type }
// visit_type: "view" | "tap" | "qr_scan" | "contact_saved"
//
// Uses navigator.sendBeacon when available so the request survives page unloads
// (e.g. user taps a contact link immediately after opening the profile).

async function recordVisit(profile_id, visit_type = "view") {
  const payload = JSON.stringify({ profile_id, visit_type });

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const sent = navigator.sendBeacon(
      `${baseURL}/analytics/visit`,
      new Blob([payload], { type: "application/json" })
    );
    // Fall back to axios if sendBeacon returns false (e.g. payload too large)
    if (sent) return;
  }

  await api.post("/analytics/visit", { profile_id, visit_type });
}

// ── GET /api/analytics/my-profile ────────────────────────────────────────────
// Returns analytics counts for the authenticated customer's profile.
// Requires customerToken.

async function getMyProfileAnalytics() {
  const response = await api.get("/analytics/my-profile");
  return response.data;
}

// ── GET /api/analytics/profile/:profileId ────────────────────────────────────
// Returns analytics for any profile by ID. Requires customerToken.

async function getProfileAnalytics(profileId) {
  const response = await api.get(`/analytics/profile/${profileId}`);
  return response.data;
}

const analyticsService = { recordVisit, getMyProfileAnalytics, getProfileAnalytics };

export default analyticsService;
