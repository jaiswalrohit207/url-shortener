const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const { nanoid } = require('nanoid');

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

    // Import Url model and sequelize
    const { Url, sequelize } = require('../models');

    let url = await Url.findOne({ where: { originalUrl } });
    if (url) {
      return res.status(200).json(url);
    }

    const shortCode = nanoid(7);
    const shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`;

    url = await Url.create({
      originalUrl,
      shortCode,
      shortUrl,
      clicks: 0
    });

    res.status(201).json(url);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all URLs
router.get('/', async (req, res) => {
  try {
    const { Url } = require('../models');
    const urls = await Url.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get URL by short code
router.get('/:shortCode', async (req, res) => {
  try {
    const { Url } = require('../models');
    const { shortCode } = req.params;

    const url = await Url.findOne({ where: { shortCode } });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Increment click count
    await url.increment('clicks');

    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete URL
router.delete('/:shortCode', async (req, res) => {
  try {
    const { Url } = require('../models');
    const { shortCode } = req.params;

    const url = await Url.findOne({ where: { shortCode } });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    await url.destroy();
    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
