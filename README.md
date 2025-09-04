# E-Commerce Fullstack App

## Giới thiệu dự án
Đây là dự án E-Commerce fullstack hiện đại với hệ thống quản trị (Admin Dashboard) hoàn chỉnh, cho phép quản lý sản phẩm, đơn hàng, người dùng, và các thống kê kinh doanh. Dự án sử dụng:

- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express, Mongoose, dotenv
- **Database**: MongoDB, PostgreSQL


## 🖼️ Hình ảnh minh họa


![UI](/e-commerce/images/localhost_3000_.png)
![UI](/e-commerce/images/localhost_3000_checkout%20(1).png)
![UI](/e-commerce/images/localhost_3000_collections_spring-summer-2025-for-women.png)
![UI](/e-commerce/images/localhost_3000_cart.png)
![UI](/e-commerce/images/localhost_3000_checkout.png)


## Cấu trúc thư mục

```
E-Commerce/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── import_data.js
│   ├── server.js
│   ├── .env
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   │   └── admin/   # Trang quản trị
│   │   ├── services/
│   │   └── ...
│   ├── .env
│   └── ...
├── package.json
└── README.md
```

## Hướng dẫn cài đặt & chạy dự án

### 1. Clone project
```sh
git clone <repo-url>
cd E-Commerce
```

### 2. Cài đặt dependencies
```sh
cd backend
npm install
cd ../frontend
npm install
```

### 3. Thiết lập biến môi trường
- Tạo file `.env` trong `backend`:
  ```
  MONGO_URI=mongodb://localhost:27017/ecommerce
  PORT=5000
  ```
- Tạo file `.env` trong `frontend` nếu cần tuỳ chỉnh endpoint API.

### 4. Import dữ liệu mẫu vào MongoDB
```sh
cd backend
node import_data.js
```

### 5. Chạy backend
```sh
cd ../backend
node server.js
```

### 6. Chạy frontend
```sh
cd ../frontend
npm run dev
```

### 7. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:5000

## Lưu ý
- Đảm bảo port 5000 (backend) và 3000 (frontend) không bị chiếm dụng.
- Nếu cập nhật dữ liệu mẫu, hãy chạy lại `node import_data.js`.
- Các route quản trị yêu cầu đăng nhập admin.