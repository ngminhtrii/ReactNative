const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

exports.generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign({id: userId}, JWT_SECRET, {expiresIn});
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Error sending OTP email');
  }
};

exports.sendOTPEmail = sendOTPEmail;
exports.generateOTP = generateOTP;

exports.sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    text: `Click this link to reset your password: ${resetLink}`,
  });
};
