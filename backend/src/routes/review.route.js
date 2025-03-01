const express = require("express");
const {
  getReviews,
  postCreateReview,
  putUpdateReview,
  deleteReviewController,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/:productId", getReviews);
router.post("/", postCreateReview);
router.put("/:reviewId", putUpdateReview);
router.delete("/:reviewId", deleteReviewController);

module.exports = router;
