# E-Commerce Backend API Documentation

## Authentication
- Một số route cần JWT token ở header: `Authorization: Bearer <token>`

---

## 1. User
### Đăng ký
- **POST** `/api/users/register`
- Body:
```json
{
  "username": "string",
  "password": "string (min 6 ký tự)",
  "name": "string"
}
```
- Response: user info hoặc lỗi validate

### Đăng nhập
- **POST** `/api/users/login`
- Body:
```json
{
  "username": "string",
  "password": "string"
}
```
- Response: `{ user, token }` hoặc lỗi

### Lấy danh sách user
- **GET** `/api/users`

---

## 2. Product
### Lấy danh sách sản phẩm
- **GET** `/api/products`

### Lấy chi tiết sản phẩm
- **GET** `/api/products/:id`

### Thêm sản phẩm mới
- **POST** `/api/products`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "title": "string",
  "thumbnail": "string",
  "category": "string"
}
```

### Cập nhật sản phẩm
- **PUT** `/api/products/:id`
- Headers: `Authorization: Bearer <token>`
- Body: (ít nhất 1 trường)
```json
{
  "title": "string",
  "thumbnail": "string",
  "category": "string"
}
```

### Xóa sản phẩm
- **DELETE** `/api/products/:id`
- Headers: `Authorization: Bearer <token>`

---

## 3. Collection
### Lấy danh sách collection
- **GET** `/api/collections`

### Thêm collection
- **POST** `/api/collections`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "name": "string",
  "slug": "string",
  "banner": "string",
  "modelImage": "string"
}
```

### Cập nhật collection
- **PUT** `/api/collections/:id`
- Headers: `Authorization: Bearer <token>`
- Body: (ít nhất 1 trường)
```json
{
  "name": "string",
  "slug": "string",
  "banner": "string",
  "modelImage": "string"
}
```

### Xóa collection
- **DELETE** `/api/collections/:id`
- Headers: `Authorization: Bearer <token>`

---

## 4. Banner
### Lấy danh sách banner
- **GET** `/api/banners`

### Thêm banner
- **POST** `/api/banners`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "hero": {
    "title": "string",
    "description": "string",
    "image": "string",
    "buttonText": "string",
    "buttonLink": "string"
  },
  "featured": [
    { "id": number, "image": "string" }
  ]
}
```

### Cập nhật banner
- **PUT** `/api/banners/:id`
- Headers: `Authorization: Bearer <token>`
- Body: (ít nhất 1 trường của hero hoặc featured)

### Xóa banner
- **DELETE** `/api/banners/:id`
- Headers: `Authorization: Bearer <token>`

---

## 5. Gift
### Lấy danh sách gift
- **GET** `/api/gifts`

### Thêm gift
- **POST** `/api/gifts`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "image": "string"
}
```

### Cập nhật gift
- **PUT** `/api/gifts/:id`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "image": "string"
}
```

### Xóa gift
- **DELETE** `/api/gifts/:id`
- Headers: `Authorization: Bearer <token>`

---

## 6. Lỗi trả về mẫu
- Lỗi validate:
```json
{
  "errors": [
    { "msg": "Tên sản phẩm là bắt buộc", "param": "title", ... }
  ]
}
```
- Lỗi chung:
```json
{
  "error": "Thông báo lỗi cụ thể"
}
```
