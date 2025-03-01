const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const DiscountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

DiscountSchema.add(BaseSchema);

const Discount = mongoose.model("Discount", DiscountSchema);

module.exports = Discount;
