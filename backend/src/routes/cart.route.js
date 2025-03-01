const express = require("express");
const {
  getCarts,
  postCreateCart,
  putUpdateCart,
  deleteCartController,
} = require("../controllers/cart.controller");

const router = express.Router();

router.get("/:userId", getCarts);
router.post("/", postCreateCart);
router.put("/:cartId", putUpdateCart);
router.delete("/:cartId", deleteCartController);

module.exports = router;
