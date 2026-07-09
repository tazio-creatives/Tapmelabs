const express = require("express");
const { ReviewTag } = require("../models");

const router = express.Router();

// Public route — used by the /rv/[code] tap page to render the review-standee view
router.get("/public/:code", async (req, res) => {
  try {
    const tag = await ReviewTag.findOne({
      where: { code: req.params.code, status: "active" },
    });
    if (!tag) return res.status(404).json({ review_tag: null });

    res.json({
      review_tag: {
        product_type:      tag.product_type,
        business_name:     tag.business_name,
        logo_url:          tag.logo_url,
        google_review_url: tag.google_review_url,
        instagram_url:     tag.instagram_url,
        whatsapp_url:      tag.whatsapp_url,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
