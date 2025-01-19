const User = require('../models/User');
const {
  generateToken,
  generateOTP,
  sendOTPEmail,
} = require('../utils/tokenUtils');

exports.register = async (req, res) => {
  let user;
  try {
    const {email, password} = req.body;
    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    user = await User.create({email, password, otp, isActive: false});
    res.status(200).json({message: 'OTP sent to email', userId: user._id});
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.message.includes('sendOTPEmail')) {
      res.status(500).json({error: 'Error sending OTP'});
    } else if (user) {
      res.status(200).json({message: 'OTP sent to email', userId: user._id});
    } else {
      res.status(500).json({error: 'Error creating user'});
    }
  }
};

exports.verifyRegister = async (req, res) => {
  try {
    const {userId, otp} = req.body;
    const user = await User.findById(userId);
    if (!user || user.otp !== otp) {
      return res.status(400).json({error: 'Invalid OTP'});
    }
    user.isActive = true;
    user.otp = null;
    await user.save();
    res.status(200).json({message: 'User activated successfully'});
  } catch (error) {
    res.status(400).json({error: 'Error verifying OTP'});
  }
};

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user || !(await user.comparePassword(password)) || !user.isActive) {
      return res.status(401).json({error: 'Invalid email or password'});
    }
    const token = generateToken(user._id);
    res.status(200).json({message: 'Login successful', token});
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
};

exports.forgetPassword = async (req, res) => {
  let user;
  try {
    const {email} = req.body;
    user = await User.findOne({email});
    if (!user) return res.status(404).json({error: 'User not found'});

    const otp = generateOTP();
    user.otp = otp;
    await user.save();
    await sendOTPEmail(email, otp);
    res.status(200).json({message: 'OTP sent to email', userId: user._id});
  } catch (error) {
    console.error('Error during password reset:', error);
    if (error.message.includes('sendOTPEmail')) {
      res.status(500).json({error: 'Error sending OTP'});
    } else if (user) {
      res.status(200).json({message: 'OTP sent to email', userId: user._id});
    } else {
      res.status(500).json({error: 'Error finding user'});
    }
  }
};

exports.verifyForgetPassword = async (req, res) => {
  try {
    const {userId, otp, newPassword} = req.body;
    const user = await User.findById(userId);
    if (!user || user.otp !== otp) {
      return res.status(400).json({error: 'Invalid OTP'});
    }
    user.password = newPassword;
    user.otp = null;
    await user.save();
    res.status(200).json({message: 'Password reset successfully'});
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
};
