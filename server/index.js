import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import predictionRoutes from './routes/predictionRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

connectDB();
app.use('/api', predictionRoutes); // ✅ Register routes once only

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import chatbotRoutes from './routes/chatbotRoutes.js';
app.use('/api', chatbotRoutes); // ✅ add below predictionRoutes

import trendingRoutes from './routes/trendingRoutes.js';
app.use('/api', trendingRoutes);
