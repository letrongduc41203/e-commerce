import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Lấy danh sách sản phẩm
router.get('/', getProducts);

// Lấy chi tiết sản phẩm
router.get('/:id', getProductById);

// Thêm sản phẩm mới (yêu cầu đăng nhập)
router.post(
  '/',
  auth,
  [
    body('title').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
    body('thumbnail').notEmpty().withMessage('Ảnh sản phẩm là bắt buộc'),
    body('category').notEmpty().withMessage('Danh mục là bắt buộc')
  ],
  validateRequest,
  createProduct
);

// Cập nhật sản phẩm (yêu cầu đăng nhập)
router.put(
  '/:id',
  auth,
  [
    body('title').optional().notEmpty().withMessage('Tên sản phẩm không được để trống'),
    body('thumbnail').optional().notEmpty().withMessage('Ảnh sản phẩm không được để trống'),
    body('category').optional().notEmpty().withMessage('Danh mục không được để trống')
  ],
  validateRequest,
  updateProduct
);

// Xóa sản phẩm (yêu cầu đăng nhập)
router.delete('/:id', auth, deleteProduct);

export default router;
