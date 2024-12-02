const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define News Schema
const newsSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  mainNews: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, required: true }, // Added author field
  date: { type: Date, default: Date.now },
  location:{type:String },

});

// Create News Model
const News = mongoose.model('News', newsSchema);

// API Endpoints

// Get all news
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
});

// Add news
app.post('/api/news', async (req, res) => {
  const requiredFields = ["heading", "mainNews", "image", "author", "location"]; // Add new keys here
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.join(", ")}` 
    });
  }

  try {
    const newNews = new News(req.body); // Automatically maps keys from req.body
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: "Error adding news", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
