const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

BrandSchema.add(BaseSchema);

const Brand = mongoose.model("Brand", BrandSchema);

module.exports = Brand;
