import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
// TODO: Implement createCollection, updateCollection, deleteCollection in collectionController.js
import { getCollections } from '../controllers/collectionController.js';

const router = express.Router();

// Lấy danh sách collection
router.get('/', getCollections);

// TODO: Thêm handler cho tạo mới collection (createCollection) sau khi bổ sung vào collectionController.js
// router.post('/', ...);

// TODO: Thêm handler cho cập nhật collection (updateCollection) sau khi bổ sung vào collectionController.js
// router.put('/:id', ...);

// TODO: Thêm handler cho xóa collection (deleteCollection) sau khi bổ sung vào collectionController.js
// router.delete('/:id', ...);

export default router;
