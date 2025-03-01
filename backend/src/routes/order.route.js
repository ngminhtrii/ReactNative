const express = require("express");
const {
  getOrders,
  postCreateOrder,
  putUpdateOrder,
  deleteOrderController,
} = require("../controllers/order.controller");

const router = express.Router();

router.get("/:orderId", getOrders);
router.post("/", postCreateOrder);
router.put("/:orderId", putUpdateOrder);
router.delete("/:orderId", deleteOrderController);

module.exports = router;
