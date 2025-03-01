const {
  createPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../services/payment.service");

const getPayments = async (req, res) => {
  try {
    const payments = await getPaymentById(req.params.paymentId);
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreatePayment = async (req, res) => {
  try {
    const newPayment = await createPayment(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const updatedPayment = await updatePayment(paymentId, req.body);
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePaymentController = async (req, res) => {
  try {
    const { paymentId } = req.params;
    await deletePayment(paymentId);
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  postCreatePayment,
  putUpdatePayment,
  deletePaymentController,
};
