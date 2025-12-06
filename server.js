require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const urlModel = require('./models/Url');
const urlRoutes = require('./routes/url');

const app = express();
const PORT = process.env.PORT || 3000;

// Sequelize Database Configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'url_shortener',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// Initialize Model
const Url = urlModel(sequelize);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sync Database
sequelize.sync({ alter: false })
  .then(() => console.log('Database synced successfully'))
  .catch(err => console.log('Database sync error:', err));

// Routes
app.use('/api/url', urlRoutes(Url, sequelize));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Redirect to original URL
app.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ where: { shortCode: req.params.shortCode } });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    }
    res.status(404).json({ message: 'URL not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
