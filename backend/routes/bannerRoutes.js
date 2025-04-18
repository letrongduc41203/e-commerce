import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';

const router = express.Router();

// Lấy danh sách banner
router.get('/', getBanners);

// Thêm banner mới (yêu cầu đăng nhập)
router.post(
  '/',
  auth,
  [
    body('hero.title').notEmpty().withMessage('Hero title là bắt buộc'),
    body('hero.description').notEmpty().withMessage('Hero description là bắt buộc'),
    body('hero.image').notEmpty().withMessage('Hero image là bắt buộc'),
    body('hero.buttonText').notEmpty().withMessage('Hero buttonText là bắt buộc'),
    body('hero.buttonLink').notEmpty().withMessage('Hero buttonLink là bắt buộc'),
    body('featured').isArray().withMessage('Featured phải là mảng')
  ],
  validateRequest,
  createBanner
);

// Cập nhật banner (yêu cầu đăng nhập)
router.put(
  '/:id',
  auth,
  [
    body('hero.title').optional().notEmpty().withMessage('Hero title không được để trống'),
    body('hero.description').optional().notEmpty().withMessage('Hero description không được để trống'),
    body('hero.image').optional().notEmpty().withMessage('Hero image không được để trống'),
    body('hero.buttonText').optional().notEmpty().withMessage('Hero buttonText không được để trống'),
    body('hero.buttonLink').optional().notEmpty().withMessage('Hero buttonLink không được để trống'),
    body('featured').optional().isArray().withMessage('Featured phải là mảng')
  ],
  validateRequest,
  updateBanner
);

// Xóa banner (yêu cầu đăng nhập)
router.delete('/:id', auth, deleteBanner);

export default router;
