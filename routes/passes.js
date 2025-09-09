const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');

// GET /api/passes - List all passes
router.get('/', async (req, res) => {
  try {
    const passes = await Pass.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: passes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving passes',
      error: error.message
    });
  }
});

// POST /api/passes - Create a new pass
router.post('/', async (req, res) => {
  try {
    const { type, date } = req.body;
    
    if (!type || !date) {
      return res.status(400).json({
        success: false,
        message: 'Type and date are required'
      });
    }

    const pass = new Pass({
      type,
      date: new Date(date)
    });

    const savedPass = await pass.save();
    
    res.status(201).json({
      success: true,
      message: 'Pass created successfully',
      data: savedPass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating pass',
      error: error.message
    });
  }
});

module.exports = router;