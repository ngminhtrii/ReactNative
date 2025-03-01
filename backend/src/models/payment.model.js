const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Momo", "ZaloPay"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Thành công", "Thất bại", "Chờ xử lý"],
    default: "Chờ xử lý",
  },
  transactionId: {
    type: String,
    required: true,
  },
});

PaymentSchema.add(BaseSchema);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
