import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/users.js';
import requestRoutes from './routes/requests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ── CORS ─────────────────────────────────────────────────────────────────────
// Always allow local dev origins; in production also allow CLIENT_URL
// (supports multiple origins separated by commas in the env var)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // No origin = curl / Render health-check / same-origin — allow
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: false, // no cookies in this project
  })
);

app.use(express.json());

// ── Database ──────────────────────────────────────────────────────────────────
connectDB();

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'SkillSwap API is running' });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    // Never leak stack traces in production
    ...(isProd ? {} : { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 SkillSwap server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`
  );
});

