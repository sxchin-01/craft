const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');

// Routes
// 'image' must match the "name" attribute in your frontend form
router.post('/', upload.single('image'), uploadController.uploadImage);
router.get('/:id', uploadController.getImage);
router.delete('/:id', uploadController.deleteImage);

module.exports = router;
