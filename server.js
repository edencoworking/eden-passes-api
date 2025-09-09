require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const passesRoutes = require('./routes/passes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/passes', passesRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Eden Passes API is running!' });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eden-passes');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;