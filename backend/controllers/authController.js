const mongoose = require('mongoose');
const User = require('../models/User');
const {
  generateToken,
  generateOTP,
  sendOTPEmail,
  sendVerificationEmail,
} = require('../utils/tokenUtils');

exports.register = async (req, res) => {
  try {
    const {email, password} = req.body;
    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    const user = await User.create({email, password, otp, isActive: false});
    res.status(200).json({message: 'OTP sent to email', userId: user._id});
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({error: 'Error creating user'});
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
    res
      .status(200)
      .json({message: 'Login successful', token, userId: user._id});
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({error: 'User not found'});

    const otp = generateOTP();
    user.otp = otp;
    await user.save();
    await sendOTPEmail(email, otp);
    res.status(200).json({message: 'OTP sent to email', userId: user._id});
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({error: 'Error sending OTP'});
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

exports.updateProfile = async (req, res) => {
  try {
    const {userId, phoneNumber, profileImageUrl} = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({error: 'User not found'});

    let otpSent = false;

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const otp = generateOTP();
      user.otp = otp;
      await sendOTPEmail(user.email, otp); // Send OTP to the user's email
      otpSent = true;
    }

    if (profileImageUrl) {
      user.profileImageUrl = profileImageUrl;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      userId: user._id,
      otpSent,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({error: 'Server error', details: error.message});
  }
};

exports.verifyEmailUpdate = async (req, res) => {
  try {
    const {userId, otp, email} = req.body;
    const user = await User.findById(userId);
    if (!user || user.otp !== otp) {
      return res.status(400).json({error: 'Invalid OTP'});
    }
    user.email = email;
    user.isActive = true;
    user.otp = null;
    await user.save();
    res.status(200).json({message: 'Email updated successfully'});
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const {email} = req.body;
    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    res.status(200).json({message: 'OTP sent to email'});
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({error: 'Error sending OTP'});
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const {email, otp, phoneNumber} = req.body;
    const user = await User.findOne({email});
    if (!user || user.otp !== otp) {
      return res.status(400).json({error: 'Invalid OTP'});
    }
    user.phoneNumber = phoneNumber;
    user.otp = null;
    await user.save();
    res.status(200).json({message: 'Phone number updated successfully'});
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({error: 'Error verifying OTP'});
  }
};

exports.getProfile = async (req, res) => {
  try {
    const {userId} = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid user ID'});
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({error: 'User not found'});

    res.status(200).json({
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({error: 'Server error', details: error.message});
  }
};
