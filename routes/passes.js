const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const Pass = require('../models/Pass');

const router = express.Router();

// Validation middleware
const validatePass = [
  body('holderName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Holder name is required and must be between 1-100 characters'),
    
  body('holderEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
    
  body('passType')
    .isIn(['day_pass', 'weekly_pass', 'monthly_pass', 'quarterly_pass', 'annual_pass', 'guest_pass', 'event_pass'])
    .withMessage('Invalid pass type'),
    
  body('startDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid start date is required'),
    
  body('endDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid end date is required'),
    
  body('accessLevel')
    .optional()
    .isIn(['basic', 'premium', 'vip', 'admin'])
    .withMessage('Invalid access level'),
    
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters'),
    
  body('issuedBy')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Issued by is required and must be between 1-100 characters')
];

const validatePassUpdate = [
  body('holderName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Holder name must be between 1-100 characters'),
    
  body('holderEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
    
  body('passType')
    .optional()
    .isIn(['day_pass', 'weekly_pass', 'monthly_pass', 'quarterly_pass', 'annual_pass', 'guest_pass', 'event_pass'])
    .withMessage('Invalid pass type'),
    
  body('startDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid start date is required'),
    
  body('endDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid end date is required'),
    
  body('accessLevel')
    .optional()
    .isIn(['basic', 'premium', 'vip', 'admin'])
    .withMessage('Invalid access level'),
    
  body('status')
    .optional()
    .isIn(['active', 'expired', 'suspended', 'cancelled'])
    .withMessage('Invalid status'),
    
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid pass ID')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/passes
// @desc    Get all passes with optional filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
  query('status').optional().isIn(['active', 'expired', 'suspended', 'cancelled']),
  query('passType').optional().isIn(['day_pass', 'weekly_pass', 'monthly_pass', 'quarterly_pass', 'annual_pass', 'guest_pass', 'event_pass']),
  query('accessLevel').optional().isIn(['basic', 'premium', 'vip', 'admin'])
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.passType) filter.passType = req.query.passType;
    if (req.query.accessLevel) filter.accessLevel = req.query.accessLevel;
    if (req.query.holderEmail) filter.holderEmail = new RegExp(req.query.holderEmail, 'i');

    // Build sort object
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by creation date, newest first
    }

    const passes = await Pass.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Pass.countDocuments(filter);

    res.json({
      success: true,
      data: {
        passes,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching passes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching passes'
    });
  }
});

// @route   GET /api/passes/:id
// @desc    Get a single pass by ID
// @access  Public
router.get('/:id', validateId, handleValidationErrors, async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Pass not found'
      });
    }

    res.json({
      success: true,
      data: pass
    });
  } catch (error) {
    console.error('Error fetching pass:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pass'
    });
  }
});

// @route   POST /api/passes
// @desc    Create a new pass
// @access  Public
router.post('/', validatePass, handleValidationErrors, async (req, res) => {
  try {
    // Check for duplicate email with active passes
    const existingActivePass = await Pass.findOne({
      holderEmail: req.body.holderEmail,
      status: 'active',
      endDate: { $gte: new Date() }
    });

    if (existingActivePass) {
      return res.status(400).json({
        success: false,
        message: 'User already has an active pass'
      });
    }

    const pass = new Pass(req.body);
    await pass.save();

    res.status(201).json({
      success: true,
      message: 'Pass created successfully',
      data: pass
    });
  } catch (error) {
    console.error('Error creating pass:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Pass number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating pass'
    });
  }
});

// @route   PUT /api/passes/:id
// @desc    Update a pass
// @access  Public
router.put('/:id', [...validateId, ...validatePassUpdate], handleValidationErrors, async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Pass not found'
      });
    }

    // Update the pass
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        pass[key] = req.body[key];
      }
    });

    await pass.save();

    res.json({
      success: true,
      message: 'Pass updated successfully',
      data: pass
    });
  } catch (error) {
    console.error('Error updating pass:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating pass'
    });
  }
});

// @route   DELETE /api/passes/:id
// @desc    Delete a pass
// @access  Public
router.delete('/:id', validateId, handleValidationErrors, async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Pass not found'
      });
    }

    await Pass.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pass deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pass:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting pass'
    });
  }
});

// @route   POST /api/passes/:id/checkin
// @desc    Check in with a pass
// @access  Public
router.post('/:id/checkin', validateId, handleValidationErrors, async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Pass not found'
      });
    }

    if (!pass.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Pass is not valid for check-in'
      });
    }

    // Update check-in information
    pass.checkinCount += 1;
    pass.lastCheckin = new Date();
    await pass.save();

    res.json({
      success: true,
      message: 'Check-in successful',
      data: {
        passNumber: pass.passNumber,
        holderName: pass.holderName,
        checkinCount: pass.checkinCount,
        lastCheckin: pass.lastCheckin
      }
    });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during check-in'
    });
  }
});

// @route   GET /api/passes/stats/summary
// @desc    Get pass statistics summary
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Pass.aggregate([
      {
        $group: {
          _id: null,
          totalPasses: { $sum: 1 },
          activePasses: {
            $sum: {
              $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
            }
          },
          expiredPasses: {
            $sum: {
              $cond: [{ $eq: ['$status', 'expired'] }, 1, 0]
            }
          },
          totalRevenue: { $sum: '$price' },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);

    const passTypeStats = await Pass.aggregate([
      {
        $group: {
          _id: '$passType',
          count: { $sum: 1 },
          revenue: { $sum: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: stats[0] || {
          totalPasses: 0,
          activePasses: 0,
          expiredPasses: 0,
          totalRevenue: 0,
          averagePrice: 0
        },
        passTypes: passTypeStats
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;