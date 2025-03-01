const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../services/user.service");
const User = require("../models/user.model");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateUser = async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await updateUser(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  postCreateUser,
  putUpdateUser,
  deleteUserController,
};
