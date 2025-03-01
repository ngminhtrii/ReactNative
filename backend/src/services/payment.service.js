const Payment = require("../models/payment.model");

const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  await payment.save();
  return payment;
};

const getPaymentById = async (paymentId) => {
  return await Payment.findById(paymentId);
};

const updatePayment = async (paymentId, updateData) => {
  return await Payment.findByIdAndUpdate(paymentId, updateData, { new: true });
};

const deletePayment = async (paymentId) => {
  return await Payment.findByIdAndDelete(paymentId);
};

module.exports = {
  createPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
};
