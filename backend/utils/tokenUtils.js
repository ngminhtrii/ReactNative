const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

exports.generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign({id: userId}, JWT_SECRET, {expiresIn});
};

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
