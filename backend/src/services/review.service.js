const Review = require("../models/review.model");

const createReview = async (reviewData) => {
  const review = new Review(reviewData);
  await review.save();
  return review;
};

const getReviewsByProductId = async (productId) => {
  return await Review.find({ productId });
};

const updateReview = async (reviewId, updateData) => {
  return await Review.findByIdAndUpdate(reviewId, updateData, { new: true });
};

const deleteReview = async (reviewId) => {
  return await Review.findByIdAndDelete(reviewId);
};

module.exports = {
  createReview,
  getReviewsByProductId,
  updateReview,
  deleteReview,
};
