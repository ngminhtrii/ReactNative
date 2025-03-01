const mongoose = require("mongoose");
const BaseSchema = require("./base.model");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

CategorySchema.add(BaseSchema);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
