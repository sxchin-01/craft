const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'restored', 'failed'],
    default: 'uploaded'
  },
  restoredPath: {
    type: String
  },
  processingDetails: {
    startedAt: Date,
    completedAt: Date,
    operations: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);
