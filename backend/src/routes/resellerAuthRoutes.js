const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/resellerAuthController");
const resellerAuth = require("../middleware/resellerAuth");

router.post("/register", ctrl.register);
router.post("/login",    ctrl.login);
router.post("/refresh",  ctrl.refresh);
router.post("/logout",   resellerAuth, ctrl.logout);
router.get("/me",        resellerAuth, ctrl.me);

module.exports = router;
