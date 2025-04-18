import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { getCollections, createCollection, updateCollection, deleteCollection } from '../controllers/collectionController.js';

const router = express.Router();

// Lấy danh sách collection
router.get('/', getCollections);

// Thêm collection mới (yêu cầu đăng nhập)
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Tên collection là bắt buộc'),
    body('slug').notEmpty().withMessage('Slug là bắt buộc'),
    body('banner').notEmpty().withMessage('Banner là bắt buộc'),
    body('modelImage').notEmpty().withMessage('Model image là bắt buộc')
  ],
  validateRequest,
  createCollection
);

// Cập nhật collection (yêu cầu đăng nhập)
router.put(
  '/:id',
  auth,
  [
    body('name').optional().notEmpty().withMessage('Tên collection không được để trống'),
    body('slug').optional().notEmpty().withMessage('Slug không được để trống'),
    body('banner').optional().notEmpty().withMessage('Banner không được để trống'),
    body('modelImage').optional().notEmpty().withMessage('Model image không được để trống')
  ],
  validateRequest,
  updateCollection
);

// Xóa collection (yêu cầu đăng nhập)
router.delete('/:id', auth, deleteCollection);

export default router;
