const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const passesRoutes = require('./routes/passes');

// Initialize Express app
const app = express();

// Port configuration
const PORT = process.env.PORT || 3000;

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eden-passes';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
})); // Enable CORS
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// API Routes
app.use('/api/passes', passesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Eden Passes API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Eden Passes API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      passes: '/api/passes',
      documentation: '/api/docs (coming soon)'
    }
  });
});

// API documentation endpoint (basic info)
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    api: 'Eden Passes API',
    version: '1.0.0',
    description: 'RESTful API for managing coworking space passes',
    endpoints: {
      'GET /api/passes': 'Get all passes (with pagination and filtering)',
      'GET /api/passes/:id': 'Get a specific pass by ID',
      'POST /api/passes': 'Create a new pass',
      'PUT /api/passes/:id': 'Update a pass',
      'DELETE /api/passes/:id': 'Delete a pass',
      'POST /api/passes/:id/checkin': 'Check in with a pass',
      'GET /api/passes/stats/summary': 'Get pass statistics'
    },
    queryParameters: {
      pagination: 'page, limit',
      filtering: 'status, passType, accessLevel, holderEmail',
      sorting: 'sortBy (format: field:asc|desc)'
    },
    passTypes: [
      'day_pass',
      'weekly_pass',
      'monthly_pass',
      'quarterly_pass',
      'annual_pass',
      'guest_pass',
      'event_pass'
    ],
    accessLevels: ['basic', 'premium', 'vip', 'admin'],
    statuses: ['active', 'expired', 'suspended', 'cancelled']
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableEndpoints: {
      root: '/',
      health: '/health',
      passes: '/api/passes',
      documentation: '/api/docs'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Eden Passes API server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;