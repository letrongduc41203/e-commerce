import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Service để quản lý xác thực admin
class AdminAuthService {
  // Lưu thông tin đăng nhập admin
  setAuthData(admin, accessToken, refreshToken) {
    if (!accessToken || !refreshToken) {
      console.error('Missing tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
      return;
    }

    console.log('Saving auth data:',
      { adminId: admin.id, 
        tokenLength: accessToken.length, 
        refreshTokenLength: refreshToken.length
      }
    );
    
    localStorage.setItem('admin_data', JSON.stringify(admin));
    localStorage.setItem('admin_token', accessToken);
    localStorage.setItem('admin_refresh_token', refreshToken);
  }

  // Xóa thông tin đăng nhập
  clearAuthData() {
    localStorage.removeItem('admin_data');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
  }

  // Lấy access token
  getAccessToken() {
    return localStorage.getItem('admin_token');
  }

  // Lấy refresh token
  getRefreshToken() {
    return localStorage.getItem('admin_refresh_token');
  }

  // Lấy thông tin admin
  getAdminData() {
    const adminData = localStorage.getItem('admin_data');
    return adminData ? JSON.parse(adminData) : null;
  }

  // Kiểm tra admin đã đăng nhập chưa
  isLoggedIn() {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  // Đăng nhập admin
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      console.log('Login response:', {
        success: response.data.success,
        hasAccessToken: !!response.data.accessToken,
        hasRefreshToken: !!response.data.refreshToken,
        admin: !!response.data.admin
      });
      
      const { admin, accessToken, refreshToken } = response.data;
      
      // Lưu thông tin đăng nhập
      this.setAuthData(admin, accessToken, refreshToken);
      
      return { success: true, admin };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  }

  // Đăng xuất admin
  async logout() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (refreshToken) {
        await axios.post(`${API_URL}/logout`, { refreshToken });
      }
      
      this.clearAuthData();
      return { success: true };
    } catch (error) {
      this.clearAuthData(); // Vẫn xóa dữ liệu local dù có lỗi
      return { 
        success: true, 
        message: 'Đã đăng xuất khỏi thiết bị này' 
      };
    }
  }

  // Làm mới access token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('Không có refresh token');
      }
      
      const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
      
      // Lưu access token mới
      localStorage.setItem('admin_token', response.data.accessToken);
      
      return { 
        success: true, 
        accessToken: response.data.accessToken 
      };
    } catch (error) {
      console.error('Lỗi làm mới token:', error);
      
      // Nếu refresh token không hợp lệ, đăng xuất
      if (error.response?.status === 401) {
        this.clearAuthData();
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Không thể làm mới token' 
      };
    }
  }
}

export default new AdminAuthService(); 