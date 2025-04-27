# E-Commerce Fullstack App

## Giới thiệu dự án
Đây là dự án E-Commerce fullstack hiện đại với hệ thống quản trị (Admin Dashboard) hoàn chỉnh, cho phép quản lý sản phẩm, đơn hàng, người dùng, và các thống kê kinh doanh. Dự án sử dụng:

- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express, Mongoose, dotenv
- **Database**: MongoDB (sản phẩm, banner, collection, gifts), PostgreSQL (quản lý user)

## Tính năng nổi bật

### Admin Dashboard
- **Giao diện quản trị chuyên nghiệp** với sidebar điều hướng, responsive.
- **Thống kê tổng quan**: Số lượng đơn hàng, doanh thu, biểu đồ trạng thái đơn hàng (pie chart), doanh thu theo tháng (bar chart), đơn hàng gần đây.
- **Quản lý đơn hàng**: Xem, lọc, tìm kiếm, phân trang, cập nhật trạng thái đơn hàng.
- **Chi tiết đơn hàng**: Xem timeline, thông tin khách hàng, sản phẩm, cập nhật trạng thái.
- **Quản lý sản phẩm**: Thêm, sửa, xoá, xem chi tiết sản phẩm, thao tác hàng loạt, lọc nâng cao.
- **Form sản phẩm**: Thêm/sửa sản phẩm với kiểm tra dữ liệu, upload ảnh, nhập thông tin chi tiết, thông số, size, màu sắc.
- **Bảo vệ route**: Các route quản trị được bảo vệ, chỉ admin truy cập.

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
│   │   │   └── admin/   # Trang quản trị (dashboard, order, product, user, ...)
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
npm run dev
```

### 6. Chạy frontend
```sh
cd ../frontend
npm run dev
```

### 7. Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
- **Backend API**: http://localhost:5000

## Lưu ý
- Đảm bảo port 5000 (backend) và 5173 (frontend) không bị chiếm dụng.
- Nếu cập nhật dữ liệu mẫu, hãy chạy lại `node import_data.js`.
- Chức năng quản lý user sử dụng PostgreSQL (nếu còn dùng).
- Các route quản trị yêu cầu đăng nhập admin.

## Liên hệ
Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ admin dự án.
