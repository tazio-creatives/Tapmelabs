const express = require("express");
const router  = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/formController");

// Public routes (no auth)
router.get("/public/:slug",        ctrl.getPublic);
router.post("/public/:slug/submit", ctrl.submit);

// Protected routes (customer must be logged in)
router.use(protect);
router.get("/",      ctrl.list);
router.post("/",     ctrl.create);
router.get("/:id",   ctrl.getOne);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
