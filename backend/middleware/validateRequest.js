import { validationResult } from 'express-validator';

// Middleware kiểm tra kết quả validate và trả lỗi rõ ràng cho frontend
export default function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
