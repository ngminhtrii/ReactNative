const Product = require('../models/product.model');

const createProduct = async productData => {
  const product = new Product(productData);
  await product.save();
  return product;
};

const getProductById = async productId => {
  return await Product.findById(productId);
};

const updateProduct = async (productId, updateData) => {
  return await Product.findByIdAndUpdate(productId, updateData, {new: true});
};

const deleteProduct = async productId => {
  return await Product.findByIdAndDelete(productId);
};

const searchProductsService = async query => {
  return await Product.find({name: new RegExp(query.q, 'i')});
};

const filterProductsService = async query => {
  return await Product.find(query);
};

const viewProductService = async productId => {
  return await Product.findById(productId);
};

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProductsService,
  filterProductsService,
  viewProductService,
};
