const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    unique: true,
    default: () => nanoid(6)
  },
  shortUrl: String,
  clicks: {
    type: Number,
    default: 0
  },
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Url', urlSchema);
