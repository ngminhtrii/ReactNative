const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  viewReports,
} = require("../controllers/admin.controller");

const router = express.Router();

router.post("/product", addProduct);
router.put("/product/:productId", updateProduct);
router.delete("/product/:productId", deleteProduct);
router.get("/reports", viewReports);

module.exports = router;
