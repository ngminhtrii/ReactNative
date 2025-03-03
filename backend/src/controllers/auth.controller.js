const {
  signupService,
  loginService,
  sendOtpService,
  verifyOTPService,
  resetPasswordService,
  updateUserService,
} = require('../services/auth.service');
const {validationResult} = require('express-validator');

const postSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    const user = await signupService(req.body);
    res.status(201).json({message: 'Đăng ký thành công', userId: user._id});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const postLogin = async (req, res) => {
  try {
    const {user, token} = await loginService(req.body);
    res.status(200).json({message: 'Đăng nhập thành công', user, token});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const postSendOtp = async (req, res) => {
  try {
    await sendOtpService(req.body);
    res.status(200).json({message: 'OTP đã được gửi'});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const postVerifyOtp = async (req, res) => {
  try {
    await verifyOTPService(req.body);
    res.status(200).json({message: 'Xác nhận OTP thành công'});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const postResetPassword = async (req, res) => {
  try {
    await resetPasswordService(req.body);
    res.status(200).json({message: 'Đặt lại mật khẩu thành công'});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateUserService(req.params.user_id, req.body);
    res
      .status(200)
      .json({message: 'Cập nhật người dùng thành công', updatedUser});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  postSignup,
  postLogin,
  postSendOtp,
  postVerifyOtp,
  postResetPassword,
  updateUser,
};
