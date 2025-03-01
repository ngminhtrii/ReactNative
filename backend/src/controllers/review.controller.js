const {
  createReview,
  getReviewsByProductId,
  updateReview,
  deleteReview,
} = require("../services/review.service");

const getReviews = async (req, res) => {
  try {
    const reviews = await getReviewsByProductId(req.params.productId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateReview = async (req, res) => {
  try {
    const newReview = await createReview(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await updateReview(reviewId, req.body);
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await deleteReview(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  postCreateReview,
  putUpdateReview,
  deleteReviewController,
};
