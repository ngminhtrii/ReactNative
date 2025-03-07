const mongoose = require('mongoose');
const BaseSchema = require('./base.model');

const AuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: Boolean,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  image: {
    type: String,
  },
  otp: {
    type: String, // Đảm bảo rằng trường otp là kiểu chuỗi
  },
});

AuthSchema.add(BaseSchema);

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;
