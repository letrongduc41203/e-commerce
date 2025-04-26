import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Middleware xác thực JWT token cho admin
export const authenticateAdmin = async (req, res, next) => {
  try {
    let token;
    
    // Lấy token từ header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Nếu không có token
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không có token, quyền truy cập bị từ chối' 
      });
    }
    
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret-key');
    
    // Kiểm tra admin có tồn tại không
    const admin = await Admin.findAdminById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin không tồn tại hoặc token không hợp lệ' 
      });
    }
    
    // Kiểm tra trạng thái tài khoản
    if (admin.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: 'Tài khoản đã bị khóa hoặc vô hiệu hóa' 
      });
    }
    
    // Thêm thông tin admin vào request
    req.admin = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      isSuperAdmin: admin.is_super_admin
    };
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token đã hết hạn' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi xác thực', 
      error: error.message 
    });
  }
};

// Middleware kiểm tra quyền Super Admin
export const isSuperAdmin = (req, res, next) => {
  if (!req.admin.isSuperAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Quyền truy cập bị từ chối, chỉ Super Admin mới có quyền thực hiện thao tác này' 
    });
  }
  next();
};

export default {
  authenticateAdmin,
  isSuperAdmin
};
