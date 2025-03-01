const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProductsService,
  filterProductsService,
  viewProductService,
} = require("../services/product.service");

const getProducts = async (req, res) => {
  try {
    const products = await searchProductsService(req.query);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateProduct = async (req, res) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await updateProduct(productId, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    await deleteProduct(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const product = await viewProductService(req.params.productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  postCreateProduct,
  putUpdateProduct,
  deleteProductController,
  getProductByIdController,
};
