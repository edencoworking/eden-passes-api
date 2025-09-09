const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');

// GET /api/passes - List all passes
router.get('/', async (req, res) => {
  try {
    const passes = await Pass.find().sort({ createdAt: -1 });
    res.json(passes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve passes' });
  }
});

// POST /api/passes - Create a new pass
router.post('/', async (req, res) => {
  try {
    const { type, date } = req.body;
    
    if (!type || !date) {
      return res.status(400).json({ error: 'Type and date are required' });
    }

    const pass = new Pass({
      type,
      date: new Date(date)
    });

    const savedPass = await pass.save();
    res.status(201).json(savedPass);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create pass' });
  }
});

module.exports = router;