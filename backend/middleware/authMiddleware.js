import jwt from 'jsonwebtoken';

// Middleware xác thực JWT cho các route cần bảo vệ
export default function authMiddleware(req, res, next) {
  // Lấy token từ header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Không có token xác thực' });
  }
  try {
    // Giải mã và xác thực token
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Gắn thông tin user vào request để dùng ở controller
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
}
// import middleware này vào các route cần bảo vệ, user phải đăng nhập mới truy cập được