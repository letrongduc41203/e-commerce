import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
// TODO: Implement createGift, updateGift, deleteGift in giftController.js
import { getGifts } from '../controllers/giftController.js';

const router = express.Router();

// Lấy danh sách gift
router.get('/', getGifts);

// TODO: Thêm handler cho tạo mới gift (createGift) sau khi bổ sung vào giftController.js
// router.post('/', ...);

// TODO: Thêm handler cho cập nhật gift (updateGift) sau khi bổ sung vào giftController.js
// router.put('/:id', ...);

// TODO: Thêm handler cho xóa gift (deleteGift) sau khi bổ sung vào giftController.js
// router.delete('/:id', ...);

export default router;
