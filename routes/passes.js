const express = require('express');
const Pass = require('../models/Pass');
const router = express.Router();

// Create a new pass
router.post('/', async (req, res) => {
  try {
    const { type, date } = req.body;
    const pass = new Pass({ type, date });
    await pass.save();
    res.status(201).json(pass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all passes
router.get('/', async (req, res) => {
  try {
    const passes = await Pass.find().sort({ createdAt: -1 });
    res.json(passes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;