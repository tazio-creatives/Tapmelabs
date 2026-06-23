const express = require("express");
const router  = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/leadController");
const { Subscription } = require("../models");

// GET /api/leads/subscription — check Pro plan status
router.get("/subscription", protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      where: { user_id: req.user.id, status: "active" },
    });
    const isPro = !!(sub && (!sub.expires_at || new Date(sub.expires_at) > new Date()));
    res.json({ success: true, is_pro: isPro, subscription: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.use(protect);
router.get("/",                ctrl.list);
router.get("/stats",           ctrl.stats);
router.get("/:id",             ctrl.getOne);
router.patch("/:id/status",    ctrl.updateStatus);
router.patch("/:id/notes",     ctrl.updateNotes);
router.post("/:id/send-reply", ctrl.sendReply);
router.delete("/:id",          ctrl.remove);

module.exports = router;
