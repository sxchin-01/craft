const axios = require('axios');
const fs = require('fs');
const path = require('path');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

// In-memory storage for uploaded images (replace with DB later)
const uploadedImages = new Map();

// Upload and process image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageData = {
      id: Date.now().toString(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      status: 'uploaded',
      url: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString()
    };

    // Store in memory
    uploadedImages.set(imageData.id, imageData);

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: imageData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Get image by ID
exports.getImage = async (req, res) => {
  try {
    const image = uploadedImages.get(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const image = uploadedImages.get(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from memory
    uploadedImages.delete(req.params.id);

    // Delete file from storage
    try {
      fs.unlinkSync(image.path);
    } catch (fsError) {
      console.log('Could not delete file:', fsError.message);
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// Get all images
exports.getAllImages = async (req, res) => {
  try {
    const images = Array.from(uploadedImages.values());
    res.json(images);
  } catch (error) {
    console.error('Get all images error:', error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
};
