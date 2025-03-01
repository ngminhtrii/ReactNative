const Order = require("../models/order.model");

const createOrder = async (orderData) => {
  const order = new Order(orderData);
  await order.save();
  return order;
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId);
};

const updateOrder = async (orderId, updateData) => {
  return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
};

const deleteOrder = async (orderId) => {
  return await Order.findByIdAndDelete(orderId);
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
