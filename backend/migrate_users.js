// Script để chuyển dữ liệu từ users.json vào PostgreSQL
const { Pool } = require('pg');
const fs = require('fs');

const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

const pool = new Pool({
  user: 'postgres', // sửa lại user, password, database nếu cần
  host: 'localhost',
  database: 'ecommerce',
  password: 'trongduc',
  port: 5432,
});

async function migrate() {
  for (const user of users) {
    await pool.query(
      'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
      [user.username, user.password, user.name]
    );
  }
  await pool.end();
  console.log('Done!');
}

migrate();
