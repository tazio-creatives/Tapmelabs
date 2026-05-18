const express = require("express");
const {
  recordVisit,
  getProfileAnalytics,
  getMyProfileAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Static path before /:profileId to avoid param collision
router.get("/my-profile",          protect, getMyProfileAnalytics);
router.post("/visit",                        recordVisit);
router.get("/profile/:profileId",  protect, getProfileAnalytics);

module.exports = router;
