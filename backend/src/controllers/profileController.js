const { Profile, Order } = require("../models");

// ── GET /api/profiles/me ──────────────────────────────────────────────────────

async function getMyProfile(req, res, next) {
  try {
    const profile = await Profile.findOne({ where: { user_id: req.user.id } });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create your profile.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: { profile },
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/profiles ────────────────────────────────────────────────────────

async function createProfile(req, res, next) {
  try {
    const existing = await Profile.findOne({ where: { user_id: req.user.id } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You already have a profile. Use PUT /api/profiles/me to update it.",
        data: null,
      });
    }

    const paidOrder = await Order.findOne({
      where: { user_id: req.user.id, payment_status: "paid" },
    });
    if (!paidOrder) {
      return res.status(403).json({
        success: false,
        message: "A completed payment is required before creating your profile. Please purchase a TapMe card first.",
        data: null,
      });
    }

    const {
      slug,
      name,
      bio,
      designation,
      company_name,
      email,
      phone,
      website,
      profile_image,
      company_logo,
      theme_key,
      social_links,
      is_public,
    } = req.body;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "slug is required.",
        data: null,
      });
    }

    const slugTaken = await Profile.findOne({ where: { slug } });
    if (slugTaken) {
      return res.status(409).json({
        success: false,
        message: "This profile slug is already taken.",
        data: null,
      });
    }

    const profile = await Profile.create({
      user_id: req.user.id,
      slug,
      name: name ?? null,
      bio: bio ?? null,
      designation: designation ?? null,
      company_name: company_name ?? null,
      email: email ?? null,
      phone: phone ?? null,
      website: website ?? null,
      profile_image: profile_image ?? null,
      company_logo: company_logo ?? null,
      theme_key: theme_key ?? "default",
      social_links: social_links ?? {},
      is_public: is_public !== undefined ? is_public : true,
    });

    return res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      data: { profile },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/profiles/me ──────────────────────────────────────────────────────

async function updateMyProfile(req, res, next) {
  try {
    const profile = await Profile.findOne({ where: { user_id: req.user.id } });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create your profile first.",
        data: null,
      });
    }

    const {
      slug,
      name,
      bio,
      designation,
      company_name,
      email,
      phone,
      website,
      profile_image,
      company_logo,
      theme_key,
      social_links,
      is_public,
    } = req.body;

    if (slug && slug !== profile.slug) {
      const slugTaken = await Profile.findOne({ where: { slug } });
      if (slugTaken) {
        return res.status(409).json({
          success: false,
          message: "This profile slug is already taken.",
          data: null,
        });
      }
    }

    await profile.update({
      ...(slug !== undefined && { slug }),
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(designation !== undefined && { designation }),
      ...(company_name !== undefined && { company_name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(website !== undefined && { website }),
      ...(profile_image !== undefined && { profile_image }),
      ...(company_logo !== undefined && { company_logo }),
      ...(theme_key !== undefined && { theme_key }),
      ...(social_links !== undefined && { social_links }),
      ...(is_public !== undefined && { is_public }),
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: { profile },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/profiles/public/:slug ────────────────────────────────────────────
// Lightweight response — called on every NFC tap/QR scan

async function getPublicProfile(req, res, next) {
  try {
    const profile = await Profile.findOne({
      where: { slug: req.params.slug, is_public: true },
      attributes: [
        "id",
        "slug",
        "name",
        "bio",
        "designation",
        "company_name",
        "email",
        "phone",
        "website",
        "profile_image",
        "company_logo",
        "theme_key",
        "social_links",
      ],
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found or is not public.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: { profile },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/profiles/theme ───────────────────────────────────────────────────

async function updateTheme(req, res, next) {
  try {
    const { theme_key } = req.body;

    if (!theme_key) {
      return res.status(400).json({
        success: false,
        message: "theme_key is required.",
        data: null,
      });
    }

    const profile = await Profile.findOne({ where: { user_id: req.user.id } });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create your profile first.",
        data: null,
      });
    }

    await profile.update({ theme_key });

    return res.status(200).json({
      success: true,
      message: "Theme updated successfully.",
      data: { theme_key: profile.theme_key },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyProfile,
  createProfile,
  updateMyProfile,
  getPublicProfile,
  updateTheme,
};
