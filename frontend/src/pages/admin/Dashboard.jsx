import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getUserOrders } from '../../services/orderService';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersData = await getUserOrders();

        // Tính toán thống kê từ dữ liệu
        const totalOrders = ordersData.length;
        const pendingOrders = ordersData.filter(order => order.status === 'Pending').length;
        const processingOrders = ordersData.filter(order => ['Processing', 'Shipped'].includes(order.status)).length;
        const completedOrders = ordersData.filter(order => order.status === 'Delivered').length;

        // Tính tổng doanh thu
        const totalRevenue = ordersData.reduce((sum, order) =>
          order.status !== 'Cancelled' ? sum + order.totalAmount : sum, 0);

        // Lấy 5 đơn hàng gần nhất
        const recentOrders = [...ordersData]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalOrders,
          pendingOrders,
          processingOrders,
          completedOrders,
          totalRevenue,
          recentOrders
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Lỗi khi tải dữ liệu thống kê');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Dữ liệu cho biểu đồ trạng thái đơn hàng
  const orderStatusData = [
    { name: 'Chờ xử lý', value: stats.pendingOrders },
    { name: 'Đang xử lý', value: stats.processingOrders },
    { name: 'Hoàn thành', value: stats.completedOrders }
  ];

  // Dữ liệu giả cho biểu đồ doanh thu theo tháng
  const revenueData = [
    { name: 'T1', revenue: 4000 },
    { name: 'T2', revenue: 3000 },
    { name: 'T3', revenue: 5000 },
    { name: 'T4', revenue: 2780 },
    { name: 'T5', revenue: 1890 },
    { name: 'T6', revenue: 2390 },
    { name: 'T7', revenue: 3490 },
    { name: 'T8', revenue: 4820 },
    { name: 'T9', revenue: 5290 },
    { name: 'T10', revenue: 4290 },
    { name: 'T11', revenue: 3290 },
    { name: 'T12', revenue: 6290 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-lg font-medium">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <ShoppingCart className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tổng đơn hàng</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <Package className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Đơn đã hoàn thành</h3>
            <p className="text-2xl font-bold">{stats.completedOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex">
          <div className="bg-yellow-100 rounded-full p-3 mr-4">
            <Package className="text-yellow-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Đơn đang xử lý</h3>
            <p className="text-2xl font-bold">{stats.pendingOrders + stats.processingOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex">
          <div className="bg-indigo-100 rounded-full p-3 mr-4">
            <DollarSign className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Doanh thu</h3>
            <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('vi-VN')} ₫</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')} ₫`, 'Doanh thu']} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order._id.substring(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.userDetails.name}</div>
                      <div className="text-xs text-gray-500">{order.userDetails.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalAmount.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
