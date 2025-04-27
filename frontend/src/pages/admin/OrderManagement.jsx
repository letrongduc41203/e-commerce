import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Sorting
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Filtering
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch orders with pagination, sorting, filtering, and search
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token found');
        }
        
        // Build query params
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', limit);
        params.append('sortField', sortField);
        params.append('sortOrder', sortOrder);
        
        // Add filters
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.minAmount) params.append('minAmount', filters.minAmount);
        if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
        
        // Add search term
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await axios.get(`${API_URL}/orders/admin/all?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentPage, limit, sortField, sortOrder, filters, searchTerm]);

  // Handle sort change
  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    setSearchTerm('');
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already triggered by useEffect
  };
  
  // Toggle filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }
      
      await axios.patch(`${API_URL}/orders/admin/${orderId}/status`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.');
    }
  };

  // Calculate status options based on current status
  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const currentIndex = allStatuses.indexOf(currentStatus);
    
    // Can only progress forward or cancel
    return allStatuses.filter((status, index) => 
      index > currentIndex || status === 'Cancelled'
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading && orders.length === 0) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center px-4 py-2 bg-white rounded-md shadow hover:shadow-md"
        >
          <RefreshCw size={16} className="mr-2" />
          <span>Làm mới</span>
        </button>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search */}
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text"
                placeholder="Tìm theo mã đơn, email khách hàng..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={18} />
                </button>
              )}
            </form>
          </div>
          
          {/* Filter toggle */}
          <div className="flex gap-2">
            <button 
              onClick={toggleFilter}
              className={`flex items-center px-4 py-2 rounded-md ${
                isFilterOpen ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={18} className="mr-2" />
              <span>Bộ lọc</span>
            </button>
            
            {Object.values(filters).some(v => v !== '') && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
              >
                <X size={18} className="mr-2" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Filter panel */}
        {isFilterOpen && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="Pending">Chờ xử lý</option>
                  <option value="Processing">Đang xử lý</option>
                  <option value="Shipped">Đang giao</option>
                  <option value="Delivered">Đã giao</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá từ
                  </label>
                  <input
                    type="number"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VND"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá đến
                  </label>
                  <input
                    type="number"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VND"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('_id')}
                >
                  <div className="flex items-center">
                    Mã đơn
                    {sortField === '_id' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Ngày đặt
                    {sortField === 'createdAt' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Trạng thái
                    {sortField === 'status' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    Tổng tiền
                    {sortField === 'totalAmount' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order._id.substring(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.userDetails?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{order.userDetails?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalAmount.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="px-3 py-1 bg-blue-50 text-blue-500 rounded hover:bg-blue-100"
                        >
                          Chi tiết
                        </Link>
                        
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <select
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-gray-700 bg-white hover:shadow-sm"
                            defaultValue=""
                          >
                            <option value="" disabled>Cập nhật</option>
                            {getStatusOptions(order.status).map(status => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <select
                    className="mx-1 border border-gray-300 rounded"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  {' '}mục trên mỗi trang
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-3 py-1 border rounded ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
