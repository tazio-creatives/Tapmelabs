const express = require("express");
const {
  createTheme,
  getActiveThemes,
  getAllThemesAdmin,
  getThemeByKey,
  updateTheme,
  deleteTheme,
} = require("../controllers/themeController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");

const router = express.Router();

// Static paths before /:key to avoid param collision
router.get("/admin",  protect, requireAdmin, getAllThemesAdmin);
router.get("/",                              getActiveThemes);
router.post("/",      protect, requireAdmin, createTheme);
router.get("/:key",                          getThemeByKey);
router.put("/:id",    protect, requireAdmin, updateTheme);
router.delete("/:id", protect, requireAdmin, deleteTheme);

module.exports = router;
