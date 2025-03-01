const Cart = require("../models/cart.model");

const createCart = async (cartData) => {
  const cart = new Cart(cartData);
  await cart.save();
  return cart;
};

const getCartByUserId = async (userId) => {
  return await Cart.findOne({ userId });
};

const updateCart = async (cartId, updateData) => {
  return await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
};

const deleteCart = async (cartId) => {
  return await Cart.findByIdAndDelete(cartId);
};

module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
};
