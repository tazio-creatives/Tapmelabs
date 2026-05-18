const { NfcCard, User, Profile } = require("../models");

// ── POST /api/nfc-cards ───────────────────────────────────────────────────────
// TODO: Add admin role middleware to restrict card creation to admins only.

async function createNfcCard(req, res, next) {
  try {
    const { card_uid, status } = req.body;

    if (!card_uid) {
      return res.status(400).json({
        success: false,
        message: "card_uid is required.",
        data: null,
      });
    }

    const existing = await NfcCard.findOne({ where: { card_uid } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An NFC card with this UID already exists.",
        data: null,
      });
    }

    const VALID_STATUSES = ["unassigned", "active", "locked"];
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}.`,
        data: null,
      });
    }

    const card = await NfcCard.create({
      card_uid,
      status: status ?? "unassigned",
    });

    return res.status(201).json({
      success: true,
      message: "NFC card created successfully.",
      data: { card },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/nfc-cards ────────────────────────────────────────────────────────
// TODO: Add admin role middleware.

async function getAllNfcCards(req, res, next) {
  try {
    const cards = await NfcCard.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email"],
          required: false,
        },
        {
          model: Profile,
          as: "profile",
          attributes: ["id", "slug", "name"],
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "NFC cards fetched successfully.",
      data: { cards, count: cards.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/nfc-cards/:id ────────────────────────────────────────────────────
// TODO: Add admin role middleware.

async function getNfcCardById(req, res, next) {
  try {
    const card = await NfcCard.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "phone"],
          required: false,
        },
        {
          model: Profile,
          as: "profile",
          attributes: ["id", "slug", "name", "designation", "company_name"],
          required: false,
        },
      ],
    });

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "NFC card not found.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "NFC card fetched successfully.",
      data: { card },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/nfc-cards/:id/assign ─────────────────────────────────────────────
// TODO: Add admin role middleware.

async function assignNfcCard(req, res, next) {
  try {
    const { user_id, profile_id } = req.body;

    if (!user_id || !profile_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and profile_id are required.",
        data: null,
      });
    }

    const card = await NfcCard.findByPk(req.params.id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "NFC card not found.",
        data: null,
      });
    }

    if (card.status === "locked") {
      return res.status(400).json({
        success: false,
        message: "This NFC card is locked and cannot be assigned.",
        data: null,
      });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        data: null,
      });
    }

    const profile = await Profile.findByPk(profile_id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
        data: null,
      });
    }

    await card.update({ user_id, profile_id, status: "active" });

    return res.status(200).json({
      success: true,
      message: "NFC card assigned successfully.",
      data: { card },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/nfc-cards/:id/lock ───────────────────────────────────────────────
// TODO: Add admin role middleware.

async function lockNfcCard(req, res, next) {
  try {
    const card = await NfcCard.findByPk(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "NFC card not found.",
        data: null,
      });
    }

    if (card.status === "locked") {
      return res.status(400).json({
        success: false,
        message: "NFC card is already locked.",
        data: null,
      });
    }

    await card.update({ status: "locked" });

    return res.status(200).json({
      success: true,
      message: "NFC card locked successfully.",
      data: { card },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/nfc-cards/:id/unlock ─────────────────────────────────────────────
// TODO: Add admin role middleware.

async function unlockNfcCard(req, res, next) {
  try {
    const card = await NfcCard.findByPk(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "NFC card not found.",
        data: null,
      });
    }

    if (card.status !== "locked") {
      return res.status(400).json({
        success: false,
        message: "NFC card is not locked.",
        data: null,
      });
    }

    // Restore to "active" if it was assigned, otherwise "unassigned"
    const nextStatus = card.user_id ? "active" : "unassigned";
    await card.update({ status: nextStatus });

    return res.status(200).json({
      success: true,
      message: "NFC card unlocked successfully.",
      data: { card },
    });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/nfc-cards/:id ─────────────────────────────────────────────────
// Soft delete: sets status to "locked" since the model enum does not include
// "inactive". A locked card is excluded from assignment and cannot be tapped.
// TODO: Add admin role middleware.

async function deleteNfcCard(req, res, next) {
  try {
    const card = await NfcCard.findByPk(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "NFC card not found.",
        data: null,
      });
    }

    await card.update({ status: "locked" });

    return res.status(200).json({
      success: true,
      message: "NFC card deactivated successfully.",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNfcCard,
  getAllNfcCards,
  getNfcCardById,
  assignNfcCard,
  lockNfcCard,
  unlockNfcCard,
  deleteNfcCard,
};
