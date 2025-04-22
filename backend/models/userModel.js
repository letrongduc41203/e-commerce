// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   firstName: String,
//   lastName: String,
//   title: String,
//   dob: String,
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);
// export default User;

import pool from '../config/db.js';

// Tìm user theo email
export async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// Tạo user mới
export async function createUser({ email, password, firstName, lastName, title, dob }) {
  const result = await pool.query(
    `INSERT INTO users (email, password, first_name, last_name, title, dob)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [email, password, firstName, lastName, title, dob]
  );
  return result.rows[0];
}