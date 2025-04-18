const express = require("express");
const { protect } = require("@middlewares/auth.middleware");
const imageController = require("@controllers/user/image.controller");
const uploadMiddleware = require("@middlewares/upload.middleware");
const uploadValidator = require("@validators/upload.validator");
const validate = require("@utils/validatehelper");

const router = express.Router();

/**
 * @route   POST /api/images/avatar
 * @desc    Upload ảnh đại diện cho chính mình
 * @access  Private
 */
router.post(
  "/avatar",
  protect,
  uploadMiddleware.handleAvatarUpload,
  validate([
    uploadValidator.validateSingleFileExists,
    uploadValidator.validateImageFileType,
    uploadValidator.validateImageFileSize,
  ]),
  imageController.uploadAvatar
);

/**
 * @route   DELETE /api/images/avatar
 * @desc    Xóa ảnh đại diện của chính mình
 * @access  Private
 */
router.delete("/avatar", protect, imageController.removeAvatar);

module.exports = router;
