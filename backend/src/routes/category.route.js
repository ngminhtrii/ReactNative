const express = require("express");
const {
  getCategories,
  postCreateCategory,
  putUpdateCategory,
  deleteCategoryController,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/:categoryId", getCategories);
router.post("/", postCreateCategory);
router.put("/:categoryId", putUpdateCategory);
router.delete("/:categoryId", deleteCategoryController);

module.exports = router;
