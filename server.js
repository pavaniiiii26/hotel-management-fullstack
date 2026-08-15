import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import db from './db.js';
import personRoutes from './routes/personRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load env variables FIRST before anything else


// Validate required environment variables on startup
const REQUIRED_ENV = ['JWT_SECRET', 'MONGODB_URI'];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
});



// CORS — allow React dev server
app.use(cors({
  origin: ['http://localhost:5173', 'https://hotel-management-fullstack-tau.vercel.app'],
  credentials: true
}));

// Security headers
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Request logger middleware
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
  next();
};
app.use(logRequest);

// Global rate limiter — max 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(globalLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Restaurant API!' });
});

app.use('/person', personRoutes);
app.use('/profile', profileRoutes);
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);

// 404 handler — catches any route that doesn't match above
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Centralized error handler — catches errors passed via next(err)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong'
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
