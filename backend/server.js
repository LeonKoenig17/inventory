const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 3000;

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

app.use(helmet());          // Security headers
app.use(compression());     // Gzip responses
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(cors());
app.use(express.json()); // Parse JSON requests

// Routes
const boxInventoryRoutes = require('./routes/boxInventory');
app.use('/api', boxInventoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}