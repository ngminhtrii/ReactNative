const express = require('express');
const {
  register,
  verifyRegister,
  login,
  forgetPassword,
  verifyForgetPassword,
  sendOtp,
  verifyOtp,
  getProfile,
  updateProfile, // Import the updateProfile controller
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify-register', verifyRegister);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/verify-forget-password', verifyForgetPassword);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/profile', getProfile);
router.post('/update-profile', updateProfile);

module.exports = router;
