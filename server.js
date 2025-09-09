require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const passesRouter = require('./routes/passes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/passes', passesRouter);

app.get('/', (req, res) => {
  res.send('Eden Passes API is running');
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });
