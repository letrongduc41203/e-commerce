import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './models/db.js';

dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI);
// Connect to MongoDB nếu có MONGO_URI
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.warn('⚠️  MONGO_URI is not set. Skipping MongoDB connection.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import giftRoutes from './routes/giftRoutes.js';

// Sử dụng các route chuẩn hóa
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/gifts', giftRoutes);

// MongoDB Models

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

