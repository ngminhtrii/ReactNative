const express = require("express");
const {
  getPayments,
  postCreatePayment,
  putUpdatePayment,
  deletePaymentController,
} = require("../controllers/payment.controller");

const router = express.Router();

router.get("/:paymentId", getPayments);
router.post("/", postCreatePayment);
router.put("/:paymentId", putUpdatePayment);
router.delete("/:paymentId", deletePaymentController);

module.exports = router;
