import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/users.js';
import requestRoutes from './routes/requests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillSwap MERN Backend API Server is Running' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

app.listen(PORT, () => {
  console.log(`🚀 SkillSwap Express Server running on http://localhost:${PORT}`);
});
