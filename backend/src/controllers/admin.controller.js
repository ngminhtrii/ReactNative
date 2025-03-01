const {
  addProductService,
  updateProductService,
  deleteProductService,
  viewReportsService,
} = require("../services/admin.service");

const addProduct = async (req, res) => {
  try {
    const product = await addProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await updateProductService(req.params.productId, req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const viewReports = async (req, res) => {
  try {
    const reports = await viewReportsService();
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  viewReports,
};
