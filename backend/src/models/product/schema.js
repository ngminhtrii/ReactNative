const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    images: [
      {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
        isMain: {
          type: Boolean,
          default: false,
        },
        displayOrder: {
          type: Number,
          default: 0,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false, // Đổi từ true thành false
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: false, // Đổi từ true thành false
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant',
      },
    ],
    totalQuantity: {
      type: Number,
      default: 100,
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    colors: {
      type: [String],
      validate: {
        validator: array => Array.isArray(array) && array.length <= 2,
        message: 'Tối đa 2 màu sắc',
      },
      default: [],
    },

    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = ProductSchema;
