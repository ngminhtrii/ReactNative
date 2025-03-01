const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

CartSchema.add(BaseSchema);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
