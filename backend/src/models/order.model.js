const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const OrderSchema = new mongoose.Schema({
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
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"],
    default: "Chờ xác nhận",
  },
  paymentMethod: {
    type: String,
    enum: ["Momo", "ZaloPay"],
  },
  shippingAddress: {
    type: String,
    required: true,
  },
});

OrderSchema.add(BaseSchema);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
