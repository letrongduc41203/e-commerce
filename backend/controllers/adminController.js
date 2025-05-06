import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import crypto from 'crypto'; // Thêm module crypto để tạo token ngẫu nhiên

// Hằng số cho refresh token
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh token có hạn 7 ngày
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // Access token có hạn 15 phút

// Tạo access token
const generateAccessToken = (admin) => {
  const payload = { 
    id: admin.id, 
    username: admin.username, 
    email: admin.email, 
    role: admin.role,
    isSuperAdmin: admin.is_super_admin 
  };
  const secret = process.env.JWT_SECRET || 'admin-secret-key';
  const options = { expiresIn: ACCESS_TOKEN_EXPIRES_IN };
  
  console.log('Creating access token with payload:', {
    id: payload.id,
    username: payload.username
  });
  
  try {
    const token = jwt.sign(payload, secret, options);
    console.log('Token created successfully:', token.substring(0, 15) + '...');
    return token;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

// Tạo refresh token ngẫu nhiên
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// Xử lý đăng nhập cho admin
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp username và password' 
      });
    }

    // Tìm admin theo username
    const admin = await Admin.findAdminByUsername(username);

    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username hoặc mật khẩu không đúng' 
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (admin.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: 'Tài khoản đã bị khóa hoặc vô hiệu hóa' 
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username hoặc mật khẩu không đúng' 
      });
    }

    // Cập nhật thời gian đăng nhập cuối
    await Admin.updateLastLogin(admin.id);

    // Tạo access token và refresh token
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken();
    
    // Tính thời gian hết hạn cho refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Hết hạn sau 7 ngày
    
    // Lưu refresh token vào database
    await Admin.saveRefreshToken(
      admin.id, 
      refreshToken, 
      expiresAt, 
      req.headers['user-agent'] || '', 
      req.ip
    );
    
    // Xóa các token hết hạn
    await Admin.deleteExpiredRefreshTokens();

    // Gửi về thông tin admin (không bao gồm mật khẩu) và token
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role,
        isSuperAdmin: admin.is_super_admin
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Làm mới token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token không được cung cấp'
      });
    }
    
    // Tìm refresh token trong database
    const tokenDoc = await Admin.findRefreshToken(refreshToken);
    
    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token không hợp lệ hoặc đã hết hạn'
      });
    }
    
    // Kiểm tra token có hết hạn chưa
    if (new Date(tokenDoc.expires_at) < new Date()) {
      // Vô hiệu hóa token đã hết hạn
      await Admin.revokeRefreshToken(refreshToken);
      
      return res.status(401).json({
        success: false,
        message: 'Refresh token đã hết hạn, vui lòng đăng nhập lại'
      });
    }
    
    // Kiểm tra trạng thái tài khoản admin
    if (tokenDoc.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa hoặc vô hiệu hóa'
      });
    }
    
    // Lấy thông tin admin
    const admin = await Admin.findAdminById(tokenDoc.admin_id);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin admin'
      });
    }
    
    // Tạo access token mới
    const accessToken = generateAccessToken(admin);
    
    // Trả về access token mới
    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Đăng xuất
export const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token không được cung cấp'
      });
    }
    
    // Vô hiệu hóa refresh token
    await Admin.revokeRefreshToken(refreshToken);
    
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Error logging out admin:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy thông tin admin hiện tại
export const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findAdminById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin admin' 
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role,
        isSuperAdmin: admin.is_super_admin,
        lastLogin: admin.last_login
      }
    });
  } catch (error) {
    console.error('Error getting current admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Đổi mật khẩu admin
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ mật khẩu hiện tại và mật khẩu mới' 
      });
    }

    // Kiểm tra mật khẩu mới có đủ mạnh không
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
      });
    }

    // Lấy thông tin admin từ database
    const admin = await Admin.findAdminByUsername(req.admin.username);

    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin admin' 
      });
    }

    // Xác thực mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Mật khẩu hiện tại không đúng' 
      });
    }

    // Thay đổi mật khẩu
    await Admin.changePassword(adminId, newPassword);

    res.status(200).json({ 
      success: true, 
      message: 'Đổi mật khẩu thành công' 
    });
  } catch (error) {
    console.error('Error changing admin password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Lấy danh sách tất cả admin (chỉ super admin mới có quyền)
export const getAllAdmins = async (req, res) => {
  try {
    // Kiểm tra nếu là super admin
    if (!req.admin.isSuperAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Không có quyền truy cập' 
      });
    }

    const admins = await Admin.getAllAdmins();
    
    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('Error getting all admins:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Tạo admin mới (chỉ super admin mới có quyền)
export const createAdmin = async (req, res) => {
  try {
    // Kiểm tra nếu là super admin
    if (!req.admin.isSuperAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Không có quyền truy cập' 
      });
    }

    const { username, password, email, firstName, lastName, role, isSuperAdmin } = req.body;

    // Validate input
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ thông tin' 
      });
    }

    // Kiểm tra mật khẩu có đủ mạnh không
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      });
    }

    // Tạo admin mới
    const newAdmin = await Admin.createAdmin({
      username,
      password,
      email,
      firstName,
      lastName,
      role,
      isSuperAdmin
    });

    res.status(201).json({
      success: true,
      message: 'Tạo admin mới thành công',
      admin: newAdmin
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    
    // Xử lý các lỗi cụ thể
    if (error.message === 'Username already exists') {
      return res.status(400).json({ 
        success: false, 
        message: 'Username đã tồn tại' 
      });
    }
    
    if (error.message === 'Email already exists') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email đã tồn tại' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xóa admin (chỉ super admin mới có quyền)
export const deleteAdmin = async (req, res) => {
  try {
    // Kiểm tra nếu là super admin
    if (!req.admin.isSuperAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Không có quyền truy cập' 
      });
    }

    const { id } = req.params;

    // Kiểm tra không cho phép xóa chính mình
    if (parseInt(id) === req.admin.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không thể xóa tài khoản của chính mình' 
      });
    }

    const result = await Admin.deleteAdmin(id);

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy admin hoặc không thể xóa super admin' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa admin thành công'
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

export default {
  loginAdmin,
  getCurrentAdmin,
  changePassword,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  refreshToken,
  logoutAdmin
};
