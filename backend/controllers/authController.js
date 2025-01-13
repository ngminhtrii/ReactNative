const User = require('../models/User');
const {
  generateToken,
  sendResetEmail,
  generateRandomPassword,
} = require('../utils/tokenUtils');

exports.register = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.create({email, password});
    res.status(201).json({message: 'User registered successfully', user});
  } catch (error) {
    res.status(400).json({error: 'Email already exists'});
  }
};

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({error: 'Invalid email or password'});
    }
    const token = generateToken(user._id);
    res.status(200).json({message: 'Login successful', token});
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({error: 'User not found'});

    const newPassword = generateRandomPassword();
    user.password = newPassword;
    await user.save();

    await sendResetEmail(email, newPassword);
    res.status(200).json({message: 'Password reset email sent'});
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
};
