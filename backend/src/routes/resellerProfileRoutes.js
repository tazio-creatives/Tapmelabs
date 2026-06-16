const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/resellerProfileController");
const resellerAuth = require("../middleware/resellerAuth");

router.use(resellerAuth);

router.get("/stats",        ctrl.dashboardStats);
router.get("/",             ctrl.getProfile);
router.patch("/",           ctrl.updateProfile);
router.patch("/password",   ctrl.changePassword);

module.exports = router;
