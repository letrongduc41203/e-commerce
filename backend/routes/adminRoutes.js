import express from 'express';
import adminController from '../controllers/adminController.js';
import { authenticateAdmin, isSuperAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Route đăng nhập admin
router.post('/login', adminController.loginAdmin);

// Routes yêu cầu xác thực admin
router.use(authenticateAdmin);

// Lấy thông tin admin hiện tại
router.get('/me', adminController.getCurrentAdmin);

// Đổi mật khẩu
router.put('/change-password', adminController.changePassword);

// Routes chỉ dành cho Super Admin
router.get('/all', adminController.getAllAdmins);
router.post('/', adminController.createAdmin);
router.delete('/:id', adminController.deleteAdmin);

export default router;
