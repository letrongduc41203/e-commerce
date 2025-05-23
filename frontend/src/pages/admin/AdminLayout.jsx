import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import adminAuthService from '../../services/adminAuthService';
import adminApi from '../../services/api/adminApi';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState({});

  useEffect(() => {
    // Kiểm tra đăng nhập
    const isLoggedIn = adminAuthService.isLoggedIn();
    console.log('Checking login status:', isLoggedIn);
    
    if (!isLoggedIn) {
      console.log('Not logged in, redirecting to login page');
      navigate('/admin/login');
      return;
    }

    // Lấy thông tin admin
    const adminData = adminAuthService.getAdminData();
    setUser(adminData);
    
    // Hiển thị token debug
    const token = adminAuthService.getAccessToken();
    if (token) {
      console.log('Current token:', token.substring(0, 10) + '...');
    }
    
    // Kiểm tra token còn hạn không bằng cách gọi API /admin/me
    const validateToken = async () => {
      try {
        console.log('Validating token with API...');
        const response = await adminApi.get('/admin/me');
        
        if (response.data.success) {
          console.log('Token validation successful');
          // Cập nhật thông tin admin mới nhất
          localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
          setUser(response.data.admin);
        }
      } catch (error) {
        console.error('Lỗi xác thực admin:', error);
        // Lỗi xác thực sẽ được xử lý bởi interceptor
      }
    };
    
    validateToken();

    // Thêm listener cho sự kiện logout
    const handleAuthLogout = (event) => {
      adminAuthService.clearAuthData();
      navigate('/admin/login');
    };
    
    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [navigate]);

  // Toggle submenu
  const toggleSubmenu = (id) => {
    setIsSubmenuOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Kiểm tra đường dẫn hiện tại để active menu item
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  // Responsive sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Xử lý logout
  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      // Vẫn chuyển về trang đăng nhập ngay cả khi có lỗi
      navigate('/admin/login');
    }
  };

  // Menu items admin
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      path: '/admin'
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: <ShoppingCart size={18} />,
      path: '/admin/orders',
      subItems: [
        { id: 'all-orders', label: 'Tất cả đơn hàng', path: '/admin/orders' },
        { id: 'pending-orders', label: 'Đơn chờ xử lý', path: '/admin/orders/pending' },
        { id: 'completed-orders', label: 'Đơn hoàn thành', path: '/admin/orders/completed' }
      ]
    },
    {
      id: 'products',
      label: 'Quản lý sản phẩm',
      icon: <Package size={18} />,
      path: '/admin/products',
      subItems: [
        { id: 'all-products', label: 'Tất cả sản phẩm', path: '/admin/products' },
        { id: 'add-product', label: 'Thêm sản phẩm mới', path: '/admin/products/add' },
        { id: 'categories', label: 'Danh mục', path: '/admin/products/categories' }
      ]
    }

  ];

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={toggleSidebar}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 bg-white shadow-lg`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {/* Menu Item */}
                {item.subItems ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </div>
                      {isSubmenuOpen[item.id] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {/* Submenu */}
                    {isSubmenuOpen[item.id] && (
                      <ul className="pl-8 space-y-1 mt-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              to={subItem.path}
                              className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                                location.pathname === subItem.path
                                  ? 'bg-gray-200 text-gray-900 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}

            <li className="mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
                <span className="ml-3">Đăng xuất</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <h2 className="text-lg font-medium">Linea della Vita Admin</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-500">Xin chào, </span>
              <span className="font-medium">{user.firstName} {user.lastName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
