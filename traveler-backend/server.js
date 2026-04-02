const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting middleware
const isLocalRequest = (req) => {
  const ip = String(req.ip || '');
  const host = String(req.hostname || '');
  return ip.includes('127.0.0.1')
    || ip.includes('::1')
    || ip.includes('::ffff:127.0.0.1')
    || host === 'localhost';
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 5000 : 500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' && isLocalRequest(req)
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Apply rate limiting ONLY to external APIs (not auth, general routes)
app.use('/api/external', apiLimiter);

// ✅ FIXED: Removed global no-cache middleware (was causing forced re-requests)
// Browser & proxies were re-requesting EVERYTHING despite backend caching
// Caching is now handled per-route with proper TTLs

// Routes
const authRoutes = require('./routes/auth');
const destinationRoutes = require('./routes/destinations');
const tripRoutes = require('./routes/trips');
const paymentRoutes = require('./routes/payments');
const securityRoutes = require('./routes/security');
const blogRoutes = require('./routes/blogs');
const reviewRoutes = require('./routes/reviews');
const externalApiRoutes = require('./routes/external-apis');
const activityRoutes = require('./routes/activities');

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/external', externalApiRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/activities', activityRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Traveler Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Traveler API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      destinations: '/api/destinations',
      trips: '/api/trips',
      blogs: '/api/blogs',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    statusCode: 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    statusCode: 404
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
