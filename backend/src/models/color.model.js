const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const ColorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hexCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
});

ColorSchema.add(BaseSchema);

const Color = mongoose.model("Color", ColorSchema);

module.exports = Color;
