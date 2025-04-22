// Kết nối tới PostgreSQL bằng pg
import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

// Nên dùng biến môi trường để bảo mật thông tin kết nối
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'ecommerce',
  password: process.env.PG_PASSWORD || 'trongduc',
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 2003,
});

// Hàm test kết nối
export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected:', res.rows[0]);
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
};

export default pool;
