const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');

// GET /api/passes - Get all passes
router.get('/', async (req, res) => {
  try {
    const passes = await Pass.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: passes
    });
  } catch (error) {
    console.error('Error fetching passes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching passes',
      error: error.message
    });
  }
});

// POST /api/passes - Create a new pass
router.post('/', async (req, res) => {
  try {
    const { type, date } = req.body;

    // Validation
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Pass type is required'
      });
    }

    if (!['day', 'week', 'month'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Pass type must be one of: day, week, month'
      });
    }

    const passData = { type };
    if (date) {
      passData.date = new Date(date);
    }

    const newPass = new Pass(passData);
    const savedPass = await newPass.save();

    res.status(201).json({
      success: true,
      data: savedPass,
      message: 'Pass created successfully'
    });
  } catch (error) {
    console.error('Error creating pass:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating pass',
      error: error.message
    });
  }
});

module.exports = router;