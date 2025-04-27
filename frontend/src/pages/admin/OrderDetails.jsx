import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Check, 
  X, 
  Clock, 
  Truck, 
  Package, 
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No auth token found');
        }
        
        const response = await axios.get(`${API_URL}/orders/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err, err.response?.data);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No auth token found');
      }
      
      await axios.patch(`${API_URL}/orders/admin/${id}/status`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setOrder(prev => ({
        ...prev,
        status: newStatus
      }));
      
      setUpdatingStatus(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.');
      setUpdatingStatus(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
  
  // Calculate status options based on current status
  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const currentIndex = allStatuses.indexOf(currentStatus);
    
    // Can only progress forward or cancel
    return allStatuses.filter((status, index) => 
      index > currentIndex || status === 'Cancelled'
    );
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="text-gray-500" />;
      case 'Processing':
        return <Package className="text-yellow-500" />;
      case 'Shipped':
        return <Truck className="text-blue-500" />;
      case 'Delivered':
        return <Check className="text-green-500" />;
      case 'Cancelled':
        return <X className="text-red-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };

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
            onClick={() => navigate('/admin/orders')}
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg text-center">
          <div className="text-gray-500 mb-4">Không tìm thấy đơn hàng</div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => navigate('/admin/orders')}
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between print:hidden">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order._id.substring(0, 8)}</h1>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Printer size={18} className="mr-2" />
            <span>In đơn hàng</span>
          </button>
          
          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <select
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={updatingStatus}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:shadow-sm"
              defaultValue=""
            >
              <option value="" disabled>Cập nhật trạng thái</option>
              {getStatusOptions(order.status).map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      {/* Order Summary Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-lg font-semibold">Đơn hàng #{order._id.substring(0, 8)}</h2>
              <p className="text-gray-500 text-sm mt-1">
                Đặt lúc: {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span
                className={`px-3 py-1 inline-flex items-center text-sm font-medium rounded-full ${
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
                <span className="mr-1.5">{getStatusIcon(order.status)}</span>
                {order.status}
              </span>
            </div>
          </div>
        </div>
        
        {/* Order Timeline */}
        <div className="p-6 border-b bg-gray-50 print:hidden">
          <h3 className="font-medium mb-4">Trạng thái đơn hàng</h3>
          <ol className="relative border-l border-gray-200 ml-3">
            <li className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                <Check className="w-3 h-3 text-green-500" />
              </span>
              <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
                Đơn đã đặt thành công
              </h3>
              <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                {formatDate(order.createdAt)}
              </time>
            </li>
            
            {order.status !== 'Cancelled' && (
              <>
                <li className={`mb-6 ml-6 ${order.status === 'Pending' ? 'opacity-50' : ''}`}>
                  <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${
                    order.status !== 'Pending' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <Package className={`w-3 h-3 ${
                      order.status !== 'Pending' ? 'text-yellow-500' : 'text-gray-500'
                    }`} />
                  </span>
                  <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
                    Đang xử lý
                  </h3>
                  {order.status !== 'Pending' && (
                    <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                      {formatDate(new Date())}
                    </time>
                  )}
                </li>
                
                <li className={`mb-6 ml-6 ${['Pending', 'Processing'].includes(order.status) ? 'opacity-50' : ''}`}>
                  <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${
                    !['Pending', 'Processing'].includes(order.status) ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Truck className={`w-3 h-3 ${
                      !['Pending', 'Processing'].includes(order.status) ? 'text-blue-500' : 'text-gray-500'
                    }`} />
                  </span>
                  <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
                    Đang giao hàng
                  </h3>
                  {!['Pending', 'Processing'].includes(order.status) && (
                    <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                      {formatDate(new Date())}
                    </time>
                  )}
                </li>
                
                <li className={`ml-6 ${order.status !== 'Delivered' ? 'opacity-50' : ''}`}>
                  <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${
                    order.status === 'Delivered' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Check className={`w-3 h-3 ${
                      order.status === 'Delivered' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                  </span>
                  <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
                    Giao hàng thành công
                  </h3>
                  {order.status === 'Delivered' && (
                    <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                      {formatDate(new Date())}
                    </time>
                  )}
                </li>
              </>
            )}
            
            {order.status === 'Cancelled' && (
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-red-100 rounded-full -left-3 ring-8 ring-white">
                  <X className="w-3 h-3 text-red-500" />
                </span>
                <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
                  Đơn hàng đã hủy
                </h3>
                <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                  {formatDate(new Date())}
                </time>
              </li>
            )}
          </ol>
        </div>
        
        {/* Customer & Shipping Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
          {/* Customer Info */}
          <div>
            <h3 className="font-medium mb-3">Thông tin khách hàng</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm mb-2">
                <span className="font-medium">Tên khách hàng:</span> {order.userDetails?.name || 'N/A'}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Email:</span> {order.userDetails?.email || 'N/A'}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Số điện thoại:</span> {order.shippingAddress?.phone || 'N/A'}
              </p>
              <p className="text-sm">
                <span className="font-medium">User ID:</span> {order.user || 'N/A'}
              </p>
            </div>
          </div>
          
          {/* Shipping Info */}
          <div>
            <h3 className="font-medium mb-3">Thông tin vận chuyển</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm mb-2">
                <span className="font-medium">Địa chỉ:</span> {order.shippingAddress?.address || 'N/A'}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Thành phố:</span> {order.shippingAddress?.city || 'N/A'}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Tỉnh/Bang:</span> {order.shippingAddress?.state || 'N/A'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Quốc gia:</span> {order.shippingAddress?.country || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="p-6">
          <h3 className="font-medium mb-4">Sản phẩm ({order.orderItems.length})</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-14 w-14 flex-shrink-0">
                          <img 
                            className="h-14 w-14 rounded-md object-cover" 
                            src={item.image} 
                            alt={item.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.size && (
                            <div className="text-sm text-gray-500">Size: {item.size}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                ))}
              </tbody>
              
              {/* Order Summary */}
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    Tổng tiền hàng
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    {order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    Phí vận chuyển
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    {order.shippingFee ? order.shippingFee.toLocaleString('vi-VN') + ' ₫' : 'Miễn phí'}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    Tổng thanh toán
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    <span className="text-base font-semibold">{order.totalAmount.toLocaleString('vi-VN')} ₫</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="p-6 border-t bg-gray-50">
          <h3 className="font-medium mb-3">Thông tin thanh toán</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-2">
                <span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethod || 'N/A'}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Mã thanh toán:</span> {order.paymentId || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm mb-2">
                <span className="font-medium">Trạng thái thanh toán:</span>{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </p>
              {order.isPaid && order.paidAt && (
                <p className="text-sm">
                  <span className="font-medium">Ngày thanh toán:</span> {formatDate(order.paidAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
