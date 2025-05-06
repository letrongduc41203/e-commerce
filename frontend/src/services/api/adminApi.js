import axios from 'axios';
import adminAuthService from '../adminAuthService';

const API_URL = 'http://localhost:5000/api';

// Instance axios cho API của admin
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Biến để theo dõi quá trình refresh token
let isRefreshing = false;
let failedQueue = [];

// Xử lý hàng đợi sau khi refresh token thành công hoặc thất bại
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Thêm access token vào header của request
adminApi.interceptors.request.use(
  (config) => {
    const token = adminAuthService.getAccessToken();
    
    if (token) {
      try {
        console.log('Adding token to request:', token.substring(0, 10) + '...');
        // Đảm bảo token không có khoảng trắng ở đầu và cuối
        const cleanToken = token.trim();
        config.headers.Authorization = `Bearer ${cleanToken}`;
      } catch (error) {
        console.error('Error setting auth header:', error);
      }
    } else {
      console.log('No token available for request');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý khi token hết hạn
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (
      error.response?.status === 401 && 
      error.response?.data?.code === 'TOKEN_EXPIRED' && 
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return adminApi(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Thực hiện refresh token
        const result = await adminAuthService.refreshToken();
        
        if (result.success) {
          // Nếu refresh token thành công
          processQueue(null, result.accessToken);
          originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
          return adminApi(originalRequest);
        } else {
          // Nếu refresh token thất bại, chuyển hướng về trang đăng nhập
          processQueue(new Error('Refresh token failed'));
          
          // Redirect tới trang login (sẽ được xử lý bởi component)
          window.dispatchEvent(new CustomEvent('auth:logout', { 
            detail: { reason: 'token_expired' } 
          }));
          
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Xử lý lỗi refresh token
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default adminApi; 