import express from 'express';
import { getMen } from '../controllers/menController.js';

const router = express.Router();

// GET /api/men - lấy toàn bộ bộ sưu tập nam
router.get('/', getMen);

export default router;
