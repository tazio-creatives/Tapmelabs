const { Theme, Profile } = require("../models");
const { fn, col } = require("sequelize");

// ── POST /api/themes ──────────────────────────────────────────────────────────
// TODO: Add admin role middleware.

async function createTheme(req, res, next) {
  try {
    const { name, key, preview_image, status } = req.body;

    if (!name || !key) {
      return res.status(400).json({
        success: false,
        message: "name and key are required.",
        data: null,
      });
    }

    const existing = await Theme.findOne({ where: { key } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A theme with this key already exists.",
        data: null,
      });
    }

    const VALID_STATUSES = ["active", "inactive"];
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}.`,
        data: null,
      });
    }

    const theme = await Theme.create({
      name,
      key,
      preview_image: preview_image ?? null,
      status: status ?? "active",
    });

    return res.status(201).json({
      success: true,
      message: "Theme created successfully.",
      data: { theme },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/themes ───────────────────────────────────────────────────────────

async function getActiveThemes(req, res, next) {
  try {
    const themes = await Theme.findAll({
      where: { status: "active" },
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Themes fetched successfully.",
      data: { themes, count: themes.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/themes/admin ─────────────────────────────────────────────────────
// Returns all themes regardless of status.
// TODO: Add admin role middleware.

async function getAllThemesAdmin(req, res, next) {
  try {
    const [themes, usageRows] = await Promise.all([
      Theme.findAll({ order: [["created_at", "ASC"]] }),
      Profile.findAll({
        attributes: ["theme_key", [fn("COUNT", col("id")), "count"]],
        group: ["theme_key"],
        raw: true,
      }),
    ]);

    const usageMap = {};
    usageRows.forEach((r) => { usageMap[r.theme_key] = Number(r.count); });

    const themesWithUsage = themes.map((t) => ({
      ...t.toJSON(),
      usage_count: usageMap[t.key] || 0,
    }));

    return res.status(200).json({
      success: true,
      message: "All themes fetched successfully.",
      data: { themes: themesWithUsage, count: themes.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/themes/:key ──────────────────────────────────────────────────────

async function getThemeByKey(req, res, next) {
  try {
    const theme = await Theme.findOne({ where: { key: req.params.key } });

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "Theme not found.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Theme fetched successfully.",
      data: { theme },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/themes/:id ───────────────────────────────────────────────────────
// TODO: Add admin role middleware.

async function updateTheme(req, res, next) {
  try {
    const theme = await Theme.findByPk(req.params.id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "Theme not found.",
        data: null,
      });
    }

    const { name, key, preview_image, status } = req.body;

    if (key && key !== theme.key) {
      const keyTaken = await Theme.findOne({ where: { key } });
      if (keyTaken) {
        return res.status(409).json({
          success: false,
          message: "A theme with this key already exists.",
          data: null,
        });
      }
    }

    if (status) {
      const VALID_STATUSES = ["active", "inactive"];
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}.`,
          data: null,
        });
      }
    }

    await theme.update({
      ...(name !== undefined && { name }),
      ...(key !== undefined && { key }),
      ...(preview_image !== undefined && { preview_image }),
      ...(status !== undefined && { status }),
    });

    return res.status(200).json({
      success: true,
      message: "Theme updated successfully.",
      data: { theme },
    });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/themes/:id ────────────────────────────────────────────────────
// TODO: Add admin role middleware.

async function deleteTheme(req, res, next) {
  try {
    const theme = await Theme.findByPk(req.params.id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "Theme not found.",
        data: null,
      });
    }

    await theme.update({ status: "inactive" });

    return res.status(200).json({
      success: true,
      message: "Theme deactivated successfully.",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTheme,
  getActiveThemes,
  getAllThemesAdmin,
  getThemeByKey,
  updateTheme,
  deleteTheme,
};
