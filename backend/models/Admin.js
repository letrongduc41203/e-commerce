import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// Tạo bảng admin nếu chưa tồn tại
export const createAdminTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        is_super_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        CONSTRAINT check_status CHECK (status IN ('active', 'inactive', 'suspended'))
      )
    `;
    
    await pool.query(createTableQuery);
    console.log('Admin table created or already exists');
    
    // Kiểm tra xem đã có admin mặc định chưa
    const checkAdminQuery = 'SELECT * FROM admins WHERE username = $1';
    const adminResult = await pool.query(checkAdminQuery, ['admin']);
    
    // Nếu chưa có admin nào, tạo tài khoản admin mặc định
    if (adminResult.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const createAdminQuery = `
        INSERT INTO admins (username, password, email, first_name, last_name, is_super_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      await pool.query(createAdminQuery, [
        'admin',
        hashedPassword,
        'admin@example.com',
        'Admin',
        'User',
        true
      ]);
      
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Error creating admin table:', error);
    throw error;
  }
};

// Tạo bảng lưu trữ refresh token
export const createRefreshTokenTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent VARCHAR(255),
        ip_address VARCHAR(45),
        is_revoked BOOLEAN DEFAULT false,
        FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
      )
    `;
    
    await pool.query(createTableQuery);
    console.log('Admin refresh token table created or already exists');
  } catch (error) {
    console.error('Error creating refresh token table:', error);
    throw error;
  }
};

// Tìm admin theo username
export const findAdminByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM admins WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding admin:', error);
    throw error;
  }
};

// Tìm admin theo ID
export const findAdminById = async (id) => {
  try {
    const query = 'SELECT id, username, email, first_name, last_name, role, is_super_admin, created_at, last_login, status FROM admins WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding admin by ID:', error);
    throw error;
  }
};

// Cập nhật thời gian đăng nhập cuối
export const updateLastLogin = async (id) => {
  try {
    const query = 'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [id]);
  } catch (error) {
    console.error('Error updating last login:', error);
    throw error;
  }
};

// Đổi mật khẩu admin
export const changePassword = async (id, newPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const query = 'UPDATE admins SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [hashedPassword, id]);
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Lấy danh sách tất cả admin (dùng cho super admin)
export const getAllAdmins = async () => {
  try {
    const query = 'SELECT id, username, email, first_name, last_name, role, is_super_admin, created_at, last_login, status FROM admins';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error getting all admins:', error);
    throw error;
  }
};

// Tạo admin mới (chỉ super admin mới có quyền)
export const createAdmin = async (adminData) => {
  const { username, password, email, firstName, lastName, role, isSuperAdmin } = adminData;
  
  try {
    // Kiểm tra username đã tồn tại chưa
    const checkUsernameQuery = 'SELECT * FROM admins WHERE username = $1';
    const usernameResult = await pool.query(checkUsernameQuery, [username]);
    
    if (usernameResult.rows.length > 0) {
      throw new Error('Username already exists');
    }
    
    // Kiểm tra email đã tồn tại chưa
    const checkEmailQuery = 'SELECT * FROM admins WHERE email = $1';
    const emailResult = await pool.query(checkEmailQuery, [email]);
    
    if (emailResult.rows.length > 0) {
      throw new Error('Email already exists');
    }
    
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Thêm admin mới
    const createAdminQuery = `
      INSERT INTO admins (username, password, email, first_name, last_name, role, is_super_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, email, first_name, last_name, role, is_super_admin, created_at
    `;
    
    const values = [
      username,
      hashedPassword,
      email,
      firstName,
      lastName,
      role || 'admin',
      isSuperAdmin || false
    ];
    
    const result = await pool.query(createAdminQuery, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

// Xóa admin (chỉ super admin mới có quyền)
export const deleteAdmin = async (id) => {
  try {
    const query = 'DELETE FROM admins WHERE id = $1 AND is_super_admin = false RETURNING id';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Admin not found or cannot delete super admin');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

// Lưu refresh token mới
export const saveRefreshToken = async (adminId, token, expiresAt, userAgent, ipAddress) => {
  try {
    const query = `
      INSERT INTO admin_refresh_tokens (admin_id, token, expires_at, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, token, expires_at
    `;
    
    const values = [adminId, token, expiresAt, userAgent, ipAddress];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
};

// Tìm refresh token
export const findRefreshToken = async (token) => {
  try {
    const query = `
      SELECT rt.*, a.username, a.status 
      FROM admin_refresh_tokens rt
      JOIN admins a ON rt.admin_id = a.id
      WHERE rt.token = $1 AND rt.is_revoked = false
    `;
    
    const result = await pool.query(query, [token]);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding refresh token:', error);
    throw error;
  }
};

// Vô hiệu hóa refresh token 
export const revokeRefreshToken = async (token) => {
  try {
    const query = 'UPDATE admin_refresh_tokens SET is_revoked = true WHERE token = $1';
    await pool.query(query, [token]);
    return true;
  } catch (error) {
    console.error('Error revoking refresh token:', error);
    throw error;
  }
};

// Vô hiệu hóa tất cả refresh token của admin
export const revokeAllRefreshTokens = async (adminId) => {
  try {
    const query = 'UPDATE admin_refresh_tokens SET is_revoked = true WHERE admin_id = $1';
    await pool.query(query, [adminId]);
    return true;
  } catch (error) {
    console.error('Error revoking all refresh tokens:', error);
    throw error;
  }
};

// Xóa các refresh token hết hạn
export const deleteExpiredRefreshTokens = async () => {
  try {
    const query = 'DELETE FROM admin_refresh_tokens WHERE expires_at < CURRENT_TIMESTAMP OR is_revoked = true';
    await pool.query(query);
    return true;
  } catch (error) {
    console.error('Error deleting expired refresh tokens:', error);
    throw error;
  }
};

export default {
  createAdminTable,
  createRefreshTokenTable,
  findAdminByUsername,
  findAdminById,
  updateLastLogin,
  changePassword,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  deleteExpiredRefreshTokens
};
