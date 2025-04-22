import { findUserByEmail, createUser } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Đăng ký
export const register = async (req, res) => {
  console.log('[REGISTER][BODY]', req.body);
  try {
    const { email, password, firstName, lastName, title, dob } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password: hashed, firstName, lastName, title, dob });
    res.status(201).json({ message: 'Đăng ký thành công', user: { email: user.email } });
  } catch (err) {
    console.error('[REGISTER][ERROR]', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Sai mật khẩu' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, firstName: user.first_name, lastName: user.last_name } });
  } catch (err) {
    console.error('[REGISTER][ERROR]', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
