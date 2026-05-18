const express = require("express");
const {
  uploadProductImage,
  uploadProfileImage,
  uploadCompanyLogo,
  uploadThemePreview,
} = require("../controllers/uploadController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Express accepts an array of handlers — multerWrapper + respond are chained
// automatically.  protect runs before the multer handler on each route.
router.post("/product-image",  protect, uploadProductImage);
router.post("/profile-image",  protect, uploadProfileImage);
router.post("/company-logo",   protect, uploadCompanyLogo);
router.post("/theme-preview",  protect, uploadThemePreview);

module.exports = router;
