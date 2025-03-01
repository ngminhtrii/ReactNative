// tái sử dụng createdAt, updatedAt cho các model khác
const mongoose = require("mongoose");

const BaseSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BaseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = BaseSchema;
