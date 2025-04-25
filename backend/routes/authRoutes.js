import express from 'express';
import { register, login, changePassword } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Đổi mật khẩu
router.post('/change-password', auth, changePassword);

export default router;
