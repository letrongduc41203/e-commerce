# E-Commerce Fullstack App

## Mô tả dự án
Đây là dự án E-Commerce fullstack sử dụng React (frontend), Express + MongoDB (backend) và PostgreSQL (quản lý user).

- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express, Mongoose, dotenv
- **Database**: MongoDB (sản phẩm, banner, collection, gifts), PostgreSQL (user)

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
│   │   ├── services/
│   │   └── ...
│   ├── .env
│   └── ...
├── package.json
└── README.md
```

## Hướng dẫn cài đặt

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
- Tạo file `.env` trong backend với nội dung:
  ```
  MONGO_URI=mongodb://localhost:27017/ecommerce
  PORT=5000
  ```
- Tạo file `.env` trong frontend nếu cần custom API endpoint.

### 4. Import dữ liệu mẫu vào MongoDB
```sh
cd backend
node import_data.js
```

### 5. Chạy backend
```sh
npm run dev
```

### 6. Chạy frontend
```sh
cd ../frontend
npm run dev
```

### 7. Truy cập ứng dụng
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Ghi chú
- Để tránh lỗi port, đảm bảo port 5000 (backend) và 5173 (frontend) không bị chiếm dụng.
- Nếu thay đổi dữ liệu mẫu, hãy chạy lại `node import_data.js` để cập nhật MongoDB.
- Đăng nhập/đăng ký user quản lý bằng PostgreSQL (nếu còn dùng).

## Liên hệ
Mọi thắc mắc vui lòng liên hệ admin dự án.
