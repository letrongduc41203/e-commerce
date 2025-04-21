import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Nếu bạn dùng react-icons thì đổi import phù hợp
import { login } from '../services/authService';

const benefits = [
  {
    icon: "\uD83D\uDCB3", // 🛒
    text: "Theo dõi đơn hàng, bảo dưỡng sản phẩm và hóa đơn"
  },
  {
    icon: "\uD83D\uDCBC", // 💼
    text: "Quản lý thông tin cá nhân của bạn"
  },
  {
    icon: "\uD83D\uDCE7", // 📧
    text: "Nhận tin tức đến từ Louis Vuitton"
  },
  {
    icon: "\u2665\uFE0F", // ❤️
    text: "Tạo danh sách yêu thích, xem các sản phẩm và chia sẻ"
  }
];

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setError("");
    try {
      const res = await login(form.email, form.password);
      // Lưu token vào localStorage nếu muốn
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      // Lưu thông tin user vào localStorage (tuỳ ý)
      if (res.user) {
        localStorage.setItem('lv_user', JSON.stringify(res.user));
      }
      alert('Đăng nhập thành công!');
      navigate('/');
      window.location.reload(); // Reload lại trang để cập nhật state user trên Navbar
    } catch (err) {
      setError('Đăng nhập thất bại: ' + (err.message || 'Sai thông tin đăng nhập'));
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center bg-white pt-24">
      <div className="w-full max-w-6xl flex flex-col md:flex-row mt-8">
        {/* Form bên trái */}
        <div className="flex-1 px-8 md:px-12 py-8">
          <h1 className="text-2xl font-light mb-2">Chào mừng bạn trở lại</h1>
          <div className="mb-6 text-sm text-gray-700">
            Đăng nhập bằng địa chỉ email và mật khẩu
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={form.email}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            <div className="relative">
              <label className="block text-xs mb-1 font-medium">Mật khẩu*</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full border border-gray-300 rounded px-3 h-10 focus:outline-none focus:border-black pr-9"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute top-1/2 right-2 translate-y-1/5 flex items-center text-gray-500 hover:text-black p-0 m-0 bg-transparent border-none"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                style={{ lineHeight: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <div className="text-xs text-red-500">{error}</div>}
            <div className="flex justify-between items-center text-xs">
              <Link to="#" className="underline text-gray-600 hover:text-black">Quên mật khẩu</Link>
              <Link to="#" className="underline text-gray-600 hover:text-black">Gửi cho tôi liên kết qua email</Link>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white rounded-full py-2 mt-2 font-semibold hover:bg-gray-900 transition"
            >
              Đăng nhập
            </button>
          </form>
          <div className="mt-6 text-xs text-center text-gray-700">
            Bạn chưa có tài khoản MyLV? <Link to="/register" className="underline hover:text-black">Tạo ngay</Link>
          </div>
        </div>
        {/* Lợi ích bên phải */}
        <div className="hidden md:block w-[340px] bg-gray-50 p-8 ml-8 rounded">
          <ul className="space-y-4">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-xl">{b.icon}</span>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
