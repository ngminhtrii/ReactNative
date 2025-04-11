const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../services/user.service');
const User = require('../models/user.model');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

const getUserProfile = async (req, res) => {
  try {
    console.log('Req.user:', req.user); // Kiểm tra dữ liệu trong req.user
    console.log('User ID:', req.user.userId || req.user._id); // Log ID trước khi tìm trong DB

    const userId = req.user.userId || req.user._id;
    if (!userId) {
      return res.status(400).json({message: 'User ID not found in token'});
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    console.log('Fetched user:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

const postCreateUser = async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

const putUpdateUser = async (req, res) => {
  try {
    const {userId} = req.params;
    const updatedUser = await updateUser(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

const putUpdateUserProfile = async (req, res) => {
  try {
    const updatedUser = await updateUser(req.user._id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

const deleteUserController = async (req, res) => {
  try {
    const {userId} = req.params;
    await deleteUser(userId);
    res.status(200).json({message: 'User deleted successfully'});
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  postCreateUser,
  putUpdateUser,
  putUpdateUserProfile,
  deleteUserController,
};
