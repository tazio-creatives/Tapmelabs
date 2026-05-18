const { ProfileVisit, Profile } = require("../models");

// ── Helpers ───────────────────────────────────────────────────────────────────

function getIpAddress(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.ip || null;
}

function detectDevice(userAgent) {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return "tablet";
  if (/mobile|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

async function buildAnalyticsCounts(profileId) {
  const [total_views, total_taps, qr_scans, contacts_saved] = await Promise.all([
    ProfileVisit.count({ where: { profile_id: profileId, visit_type: "view" } }),
    ProfileVisit.count({ where: { profile_id: profileId, visit_type: "tap" } }),
    ProfileVisit.count({ where: { profile_id: profileId, visit_type: "qr_scan" } }),
    ProfileVisit.count({ where: { profile_id: profileId, visit_type: "contact_saved" } }),
  ]);

  return {
    total_views,
    total_taps,
    qr_scans,
    contacts_saved,
    total_interactions: total_views + total_taps + qr_scans + contacts_saved,
  };
}

// ── POST /api/analytics/visit ─────────────────────────────────────────────────
// Public — called on every NFC profile page load.
// Frontend can use navigator.sendBeacon("/api/analytics/visit", payload) for
// fire-and-forget tracking that survives page unloads.

async function recordVisit(req, res, next) {
  try {
    const { profile_id, visit_type } = req.body;

    if (!profile_id) {
      return res.status(400).json({
        success: false,
        message: "profile_id is required.",
        data: null,
      });
    }

    const VALID_TYPES = ["view", "tap", "qr_scan", "contact_saved"];
    const resolvedType = VALID_TYPES.includes(visit_type) ? visit_type : "view";

    const ip_address = getIpAddress(req);
    const user_agent = req.headers["user-agent"] || null;
    const device     = detectDevice(user_agent);

    await ProfileVisit.create({
      profile_id,
      visit_type: resolvedType,
      ip_address,
      user_agent,
      device,
    });

    return res.status(201).json({
      success: true,
      message: "Visit recorded.",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/analytics/profile/:profileId ────────────────────────────────────

async function getProfileAnalytics(req, res, next) {
  try {
    const { profileId } = req.params;

    const profile = await Profile.findByPk(profileId, {
      attributes: ["id", "slug", "name"],
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
        data: null,
      });
    }

    const counts = await buildAnalyticsCounts(profileId);

    return res.status(200).json({
      success: true,
      message: "Profile analytics fetched successfully.",
      data: { profile, analytics: counts },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/analytics/my-profile ────────────────────────────────────────────

async function getMyProfileAnalytics(req, res, next) {
  try {
    const profile = await Profile.findOne({
      where: { user_id: req.user.id },
      attributes: ["id", "slug", "name"],
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create your profile first.",
        data: null,
      });
    }

    const counts = await buildAnalyticsCounts(profile.id);

    return res.status(200).json({
      success: true,
      message: "Your profile analytics fetched successfully.",
      data: { profile, analytics: counts },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { recordVisit, getProfileAnalytics, getMyProfileAnalytics };
