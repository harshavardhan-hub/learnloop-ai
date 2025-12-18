import dotenv from 'dotenv';
dotenv.config();

// NOW import everything else
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import testRoutes from './routes/testRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    message: 'LearnLoop AI API Server',
    status: 'Running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Error Handler (Must be last)
app.use(errorHandler);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 LearnLoop AI Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔑 OpenRouter API Key: ${process.env.OPENROUTER_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
});
