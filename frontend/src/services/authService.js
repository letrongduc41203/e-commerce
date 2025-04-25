//  file trung gian để frontend gọi các API đăng nhập/đăng ký của backend 
const API_URL = "http://localhost:5000/api/auth";

// Đổi mật khẩu: truyền vào token xác thực, mật khẩu cũ và mới
export async function changePassword({ oldPassword, newPassword, token }) {
  const res = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ oldPassword, newPassword })
  });
  if (!res.ok) throw new Error("Đổi mật khẩu thất bại");
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error("Đăng nhập thất bại");
  return res.json();
}

export async function register(data) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Đăng ký thất bại");
  return res.json();
}
