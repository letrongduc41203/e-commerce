import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Lấy danh sách user
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, name FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Đăng nhập
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, username, name, password FROM users WHERE username=$1',
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
    }
    // Tạo JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user: { id: user.id, username: user.username, name: user.name }, token });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Đăng ký user mới
export const registerUser = async (req, res) => {
  const { username, password, name } = req.body;
  try {
    // Kiểm tra username đã tồn tại chưa
    const check = await pool.query('SELECT id FROM users WHERE username=$1', [username]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Tài khoản đã tồn tại' });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING id, username, name',
      [username, hashedPassword, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};
