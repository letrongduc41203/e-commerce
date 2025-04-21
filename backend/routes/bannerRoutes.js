import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
// TODO: Implement createBanner, updateBanner, deleteBanner in bannerController.js
import { getBanners } from '../controllers/bannerController.js';

const router = express.Router();

// Lấy danh sách banner
router.get('/', getBanners);

// TODO: Thêm handler cho tạo mới banner (createBanner) sau khi bổ sung vào bannerController.js
// router.post('/', ...);

// TODO: Thêm handler cho cập nhật banner (updateBanner) sau khi bổ sung vào bannerController.js
// router.put('/:id', ...);

// TODO: Thêm handler cho xóa banner (deleteBanner) sau khi bổ sung vào bannerController.js
// router.delete('/:id', ...);

export default router;
