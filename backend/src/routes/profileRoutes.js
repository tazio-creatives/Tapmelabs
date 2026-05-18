const express = require("express");
const {
  getMyProfile,
  createProfile,
  updateMyProfile,
  getPublicProfile,
  updateTheme,
} = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Static paths must be declared before /:slug to avoid param collision
router.get("/me",            protect, getMyProfile);
router.post("/",             protect, createProfile);
router.put("/me",            protect, updateMyProfile);
router.put("/theme",         protect, updateTheme);
router.get("/public/:slug",           getPublicProfile);

module.exports = router;
