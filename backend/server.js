import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoute from './routes/authRoute.js';
import dashboardRoute from './routes/dashboardRoute.js';
import transactionRoute from './routes/transactionRoute.js';
import statRoute from './routes/statRoute.js';
import budgetRoute from './routes/budgetRoute.js';
import emailRoute from './routes/emailRoute.js';
import { errorHandler } from './middleware/errorHandler.js';

// Setup
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Budget-mgt-app';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/stats', statRoute);
app.use('/api/budget', budgetRoute);
app.use('/api/send', emailRoute);

// ✅ Serve frontend build (React/Vite dist folder)
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// ✅ Wildcard route (Express 5 compatible)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handler
app.use(errorHandler);

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
