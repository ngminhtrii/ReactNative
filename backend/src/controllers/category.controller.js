const {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../services/category.service");

const getCategories = async (req, res) => {
  try {
    const categories = await getCategoryById(req.params.categoryId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateCategory = async (req, res) => {
  try {
    const newCategory = await createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updatedCategory = await updateCategory(categoryId, req.body);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await deleteCategory(categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  postCreateCategory,
  putUpdateCategory,
  deleteCategoryController,
};
