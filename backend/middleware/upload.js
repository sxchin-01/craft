const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Load config from .env
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // Default 10MB

// 2. Ensure Upload Directory Exists (Safety Step)
// If 'uploads/' doesn't exist, this creates it automatically.
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory: ${UPLOAD_DIR}`);
}

// 3. Configure Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Generates a unique name: "timestamp-originalname.jpg"
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 4. Initialize Multer with Limits
const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE }, // Enforces the 10MB limit
    fileFilter: (req, file, cb) => {
        // Optional: Reject non-image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
});

module.exports = upload;
