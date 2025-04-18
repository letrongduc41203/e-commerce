import express from 'express';
import { body } from 'express-validator';
import { getUsers, loginUser, registerUser } from '../controllers/userController.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/', getUsers);

// Đăng nhập
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username là bắt buộc'),
    body('password').notEmpty().withMessage('Password là bắt buộc')
  ],
  validateRequest,
  loginUser
);

// Đăng ký
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username là bắt buộc'),
    body('password').isLength({ min: 6 }).withMessage('Password phải từ 6 ký tự'),
    body('name').notEmpty().withMessage('Name là bắt buộc')
  ],
  validateRequest,
  registerUser
);

export default router;
