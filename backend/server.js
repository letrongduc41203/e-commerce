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
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import menRoutes from './routes/men.js';
import Admin from './models/Admin.js';

// Sử dụng các route chuẩn hóa
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/men', menRoutes);

// MongoDB Models

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Route kiểm tra kết nối PostgreSQL
import pool from './config/db.js';
app.get('/test-pg', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.send('Kết nối PostgreSQL OK!');
  } catch (err) {
    res.status(500).send('Kết nối PostgreSQL lỗi: ' + err.stack);
  }
});

// Start the server
// Khởi tạo bảng admin khi server khởi động
const initializeAdmin = async () => {
  try {
    await Admin.createAdminTable();
    await Admin.createRefreshTokenTable();
    console.log('✅ Admin and refresh token tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing admin tables:', error);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Khởi tạo bảng admin và tài khoản admin mặc định
  initializeAdmin();
});

