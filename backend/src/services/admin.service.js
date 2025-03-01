const Product = require("../models/product.model");

const addProductService = async (data) => {
  return await Product.create(data);
};

const updateProductService = async (productId, data) => {
  return await Product.findByIdAndUpdate(productId, data, { new: true });
};

const deleteProductService = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};

const viewReportsService = async () => {
  // Implement logic to generate reports
  return { message: "Reports generated" };
};

module.exports = {
  addProductService,
  updateProductService,
  deleteProductService,
  viewReportsService,
};
