const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const SizeSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
  },
});

SizeSchema.add(BaseSchema);

const Size = mongoose.model("Size", SizeSchema);

module.exports = Size;
