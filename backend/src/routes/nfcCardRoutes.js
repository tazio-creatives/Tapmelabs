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

const router = express.Router();

router.post("/",             protect, requireAdmin, createNfcCard);
router.get("/",              protect, requireAdmin, getAllNfcCards);
router.get("/:id",           protect, requireAdmin, getNfcCardById);
router.put("/:id/assign",    protect, requireAdmin, assignNfcCard);
router.put("/:id/lock",      protect, requireAdmin, lockNfcCard);
router.put("/:id/unlock",    protect, requireAdmin, unlockNfcCard);
router.delete("/:id",        protect, requireAdmin, deleteNfcCard);

module.exports = router;
