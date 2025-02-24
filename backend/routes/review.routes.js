const express = require("express");
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");
const router = express.Router();

// Review routes
router.get("/:collegeId", getReviews);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
