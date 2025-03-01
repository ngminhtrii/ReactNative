const Category = require("../models/category.model");

const createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  await category.save();
  return category;
};

const getCategoryById = async (categoryId) => {
  return await Category.findById(categoryId);
};

const updateCategory = async (categoryId, updateData) => {
  return await Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
  });
};

const deleteCategory = async (categoryId) => {
  return await Category.findByIdAndDelete(categoryId);
};

module.exports = {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
