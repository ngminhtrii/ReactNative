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
});

AuthSchema.add(BaseSchema);

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;
