const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');
const upload = require('../middleware/upload');

// Start processing (accepts single file under 'image')
router.post('/', upload.single('image'), processController.startProcess);


module.exports = router;
