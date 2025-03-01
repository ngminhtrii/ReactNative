const {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
} = require("../services/cart.service");

const getCarts = async (req, res) => {
  try {
    const carts = await getCartByUserId(req.params.userId);
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateCart = async (req, res) => {
  try {
    const newCart = await createCart(req.body);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const updatedCart = await updateCart(cartId, req.body);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCartController = async (req, res) => {
  try {
    const { cartId } = req.params;
    await deleteCart(cartId);
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCarts,
  postCreateCart,
  putUpdateCart,
  deleteCartController,
};
