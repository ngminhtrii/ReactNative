const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
});

ReviewSchema.add(BaseSchema);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
