import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from '../services/authService';

const titles = ["Ông", "Bà", "Cô", "Anh", "Chị"];

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    title: "",
    firstName: "",
    lastName: "",
    dob: "",
    agreeLV: false,
    agreePolicy: false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate các trường bắt buộc nếu cần
      if (!form.email || !form.password || !form.firstName || !form.lastName || !form.dob) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
      }
      if (form.email !== form.confirmEmail) {
        alert('Email xác thực không khớp!');
        return;
      }
      if (!form.agreePolicy) {
        alert('Bạn cần đồng ý với Chính sách quyền riêng tư.');
        return;
      }
      const data = {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        title: form.title,
        dob: form.dob,
      };
      await register(data);
      alert('Đăng ký thành công! Hãy kiểm tra email để xác thực.');
      // Có thể chuyển hướng sang trang login nếu muốn
      // navigate('/login');
    } catch (err) {
      alert('Đăng ký thất bại: ' + err.message);
    }
  };

  return (
    <div className="min-h-[80vh] bg-white pt-4 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-lg md:text-xl font-semibold mt-4 mb-1">Tạo tài khoản</h1>
        <p className="text-xs text-gray-700 mb-2">Tạo tài khoản để tận hưởng trải nghiệm được cá nhân hóa.</p>
        <div className="text-xs mb-6">
          Bạn đã có tài khoản My LV? <Link to="/login" className="underline hover:text-black">Đăng nhập tại đây</Link>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email và xác thực email */}
          <div className="col-span-1 flex flex-col gap-4">
            <div>
              <label className="block text-xs mb-1 font-medium">Email*</label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-medium">Email xác thực*</label>
              <input
                type="email"
                name="confirmEmail"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={form.confirmEmail}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-medium">Mật khẩu*</label>
              <input
                type="password"
                name="password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          {/* Thông tin tài khoản */}
          <div className="col-span-1 flex flex-col gap-4">
            <div>
              <label className="block text-xs mb-1 font-medium">Tiêu đề*</label>
              <select
                name="title"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={form.title}
                onChange={handleChange}
                required
              >
                <option value="">Chọn danh xưng</option>
                {titles.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1 font-medium">Tên*</label>
              <input
                type="text"
                name="firstName"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-medium">Họ*</label>
              <input
                type="text"
                name="lastName"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-medium">Ngày sinh</label>
              <input
                type="date"
                name="dob"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Checkbox và nút */}
          <div>
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                name="agreePolicy"
                className="mr-2"
                checked={form.agreePolicy}
                onChange={handleChange}
                required
              />
              Tôi đã đọc và đồng ý với<a href="#" className="underline ml-1">Chính sách quyền riêng tư</a>.
            </label>
          </div>
          <div className="col-span-1 flex items-end justify-end mt-2">
            <button
              type="submit"
              className="w-full md:w-auto bg-black text-white rounded-full px-10 py-2 font-semibold hover:bg-gray-900 transition"
            >
              Tiếp tục
            </button>
          </div>
        </form>
        <div className="text-xs text-gray-500 mt-4 md:mt-8">
          Bạn sẽ nhận được mã kích hoạt qua email để xác thực việc tạo tài khoản của mình.
        </div>
      </div>
    </div>
  );
}
