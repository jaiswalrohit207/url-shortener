const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const validUrl = require('valid-url');

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }
    
    // Validate URL format
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }
    
    let url = await Url.findOne({ originalUrl });
    if (url) {
      return res.status(200).json(url);
    }
    
    url = new Url({ originalUrl });
    url.shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${url.shortCode}`;
    await url.save();
    
    res.status(201).json(url);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all URLs
router.get('/', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get URL by short code
router.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete URL
router.delete('/:shortCode', async (req, res) => {
  try {
    await Url.findOneAndDelete({ shortCode: req.params.shortCode });
    res.status(200).json({ message: 'URL deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
