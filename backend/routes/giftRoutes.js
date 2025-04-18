import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { getGifts, createGift, updateGift, deleteGift } from '../controllers/giftController.js';

const router = express.Router();

// Lấy danh sách gift
router.get('/', getGifts);

// Thêm gift mới (yêu cầu đăng nhập)
router.post(
  '/',
  auth,
  [
    body('image').notEmpty().withMessage('Ảnh gift là bắt buộc')
  ],
  validateRequest,
  createGift
);

// Cập nhật gift (yêu cầu đăng nhập)
router.put(
  '/:id',
  auth,
  [
    body('image').optional().notEmpty().withMessage('Ảnh gift không được để trống')
  ],
  validateRequest,
  updateGift
);

// Xóa gift (yêu cầu đăng nhập)
router.delete('/:id', auth, deleteGift);

export default router;
