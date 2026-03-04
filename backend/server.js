const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/pool');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const boxInventoryRoutes = require('./routes/boxInventory');

const app = express();

// PORT
const PORT = process.env.PORT || 3000;

// --- SECURITY & PERFORMANCE ---
app.use(helmet());          // Security headers
app.use(compression());     // Gzip responses

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per IP per window
}));

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:4200'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Parse JSON requests
app.use(express.json());

// --- ROUTES ---
app.use('/api', boxInventoryRoutes);

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// --- TRUST PROXY IN PRODUCTION ---
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});