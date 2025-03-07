const express = require('express');
const {
  getProducts,
  postCreateProduct,
  putUpdateProduct,
  deleteProductController,
  getProductByIdController,
} = require('../controllers/product.controller');

const router = express.Router();

router.get('/', getProducts);
router.post('/', postCreateProduct);
router.put('/:productId', putUpdateProduct);
router.delete('/:productId', deleteProductController);
router.get('/:productId', getProductByIdController);

module.exports = router;
