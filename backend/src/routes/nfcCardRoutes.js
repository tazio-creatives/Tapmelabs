const express = require("express");
const {
  createNfcCard,
  getAllNfcCards,
  getNfcCardById,
  assignNfcCard,
  lockNfcCard,
  unlockNfcCard,
  deleteNfcCard,
} = require("../controllers/nfcCardController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");
const { NfcCard, Form, Profile } = require("../models");

const router = express.Router();

// Public route — used by NFC Route Handler to determine redirect
router.get("/public/:card_uid", async (req, res) => {
  try {
    const card = await NfcCard.findOne({
      where: { card_uid: req.params.card_uid, status: "active" },
      include: [
        { model: Form,    as: "form",    attributes: ["slug"], required: false },
        { model: Profile, as: "profile", attributes: ["slug"], required: false },
      ],
    });
    if (!card) return res.status(404).json({ card: null });
    res.json({
      card: {
        default_action: card.default_action || "profile",
        form_slug:      card.form?.slug    || null,
        profile_slug:   card.profile?.slug || null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer: get their own NFC card + update default action
router.get("/mine", protect, async (req, res) => {
  try {
    const card = await NfcCard.findOne({
      where: { user_id: req.user.id },
      include: [
        { model: Form,    as: "form",    attributes: ["id", "title", "slug"], required: false },
        { model: Profile, as: "profile", attributes: ["id", "slug"],         required: false },
      ],
    });
    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch("/mine/action", protect, async (req, res) => {
  try {
    const { default_action, form_id } = req.body;
    if (!["profile", "form"].includes(default_action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }
    const card = await NfcCard.findOne({ where: { user_id: req.user.id } });
    if (!card) return res.status(404).json({ success: false, message: "No card found" });
    await card.update({ default_action, form_id: default_action === "form" ? form_id : null });
    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: get NFC card by user_id
router.get("/user/:user_id", protect, requireAdmin, async (req, res) => {
  try {
    const card = await NfcCard.findOne({
      where: { user_id: req.params.user_id },
      include: [
        { model: Form,    as: "form",    attributes: ["id", "title", "slug"], required: false },
        { model: Profile, as: "profile", attributes: ["id", "slug"],         required: false },
      ],
    });
    res.json({ success: true, card: card || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/",             protect, requireAdmin, createNfcCard);
router.get("/",              protect, requireAdmin, getAllNfcCards);
router.get("/:id",           protect, requireAdmin, getNfcCardById);
router.put("/:id/assign",    protect, requireAdmin, assignNfcCard);
router.put("/:id/lock",      protect, requireAdmin, lockNfcCard);
router.put("/:id/unlock",    protect, requireAdmin, unlockNfcCard);
router.delete("/:id",        protect, requireAdmin, deleteNfcCard);

module.exports = router;
