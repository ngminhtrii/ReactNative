const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary');

router.post(
  '/cloudinary-upload',
  fileUploader.single('file'),
  (req, res, next) => {
    if (!req.file) {
      const error = new Error('No file uploaded!');
      console.error('Upload error:', error);
      return res.status(400).json({error: error.message});
    }

    res.json({secure_url: req.file.path});
  },
);

router.use((err, req, res, next) => {
  console.error('Upload error:', err);
  res.status(500).json({error: 'Upload failed', details: err.message});
});

module.exports = router;
