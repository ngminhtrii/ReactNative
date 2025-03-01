const {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../services/order.service");

const getOrders = async (req, res) => {
  try {
    const orders = await getOrderById(req.params.orderId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateOrder = async (req, res) => {
  try {
    const newOrder = await createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await updateOrder(orderId, req.body);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    await deleteOrder(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  postCreateOrder,
  putUpdateOrder,
  deleteOrderController,
};
