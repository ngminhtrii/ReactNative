const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  size: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Size",
  },
  color: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Color",
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
      rating: {
        type: Number,
      },
    },
  ],
  images: {
    type: [String],
  },
});

ProductSchema.add(BaseSchema);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
