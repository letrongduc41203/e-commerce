import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Giai đoạn đơn hàng - dùng để hiển thị timeline
  const orderStages = [
    { key: 'ordered', label: 'Đã đặt hàng', icon: '📝' },
    { key: 'confirmed', label: 'Đã xác nhận', icon: '✅' },
    { key: 'processing', label: 'Đang xử lý', icon: '🔄' },
    { key: 'shipped', label: 'Đã giao cho đơn vị vận chuyển', icon: '🚚' },
    { key: 'delivered', label: 'Đã giao hàng', icon: '📦' }
  ];

  // Mapping trạng thái đơn hàng trong database với timeline
  const statusToStageMap = {
    'Pending': 'ordered',
    'Processing': 'confirmed',
    'Shipped': 'shipped',
    'Delivered': 'delivered',
    'Cancelled': 'cancelled'
  };

  // Fetch thông tin đơn hàng theo ID
  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Helper để lấy trạng thái hiện tại của đơn hàng
  const getCurrentStage = () => {
    if (!order) return 'ordered';
    return statusToStageMap[order.status] || 'ordered';
  };

  // Helper để kiểm tra xem giai đoạn nào đã hoàn thành
  const isStageCompleted = (stageKey) => {
    const currentStage = getCurrentStage();
    const currentIndex = orderStages.findIndex(stage => stage.key === currentStage);
    const stageIndex = orderStages.findIndex(stage => stage.key === stageKey);
    
    return stageIndex <= currentIndex;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 mt-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <span className="ml-3 text-lg font-medium">Đang tải thông tin đơn hàng...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 mt-20">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
            onClick={() => navigate('/my-order')}
          >
            Quay lại đơn hàng của tôi
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 mt-20">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-lg mb-4">Không tìm thấy thông tin đơn hàng.</div>
          <button
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
            onClick={() => navigate('/my-order')}
          >
            Quay lại đơn hàng của tôi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 mt-20">
      {/* Thanh điều hướng */}
      <div className="mb-6 flex items-center text-sm">
        <Link to="/" className="text-gray-500 hover:text-black">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/my-order" className="text-gray-500 hover:text-black">Đơn hàng của tôi</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">Chi tiết đơn hàng #{order._id.substring(0, 8)}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div className="bg-gray-50 p-5 border-b">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-xl font-bold">Chi tiết đơn hàng #{order._id.substring(0, 8)}</h1>
            <div className="flex items-center mt-2 sm:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-5 py-6">
          <h2 className="font-semibold mb-4">Trạng thái đơn hàng</h2>
          <div className="flex flex-wrap items-center justify-between mb-4">
            {orderStages.map((stage, index) => {
              const isCompleted = isStageCompleted(stage.key);
              const isActive = getCurrentStage() === stage.key;
              
              // Skip displaying if order is cancelled
              if (order.status === 'Cancelled' && index > 0) return null;
              
              return (
                <div key={stage.key} className="flex flex-col items-center mb-4 w-1/2 sm:w-auto">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-xl mb-2 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? stage.icon : '○'}
                  </div>
                  <div className={`text-center text-xs ${isActive ? 'font-medium' : ''}`}>
                    {stage.label}
                  </div>
                  {index < orderStages.length - 1 && (
                    <div className="hidden sm:block absolute h-1 bg-gray-200 top-1/2 transform -translate-y-1/2"
                      style={{ left: `${100 / (orderStages.length - 1) * index + 5}%`, 
                               right: `${100 - (100 / (orderStages.length - 1) * (index + 1) - 5)}%` }}>
                      <div className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} 
                        style={{ width: isCompleted ? '100%' : '0%' }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {order.status === 'Cancelled' && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              <div className="font-medium">Đơn hàng đã bị hủy</div>
              <p className="text-sm mt-1">Đơn hàng này đã bị hủy vào ngày {new Date(order.updatedAt).toLocaleDateString('vi-VN')}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main content area - 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-30">
        {/* Left column - Products and payment info */}
        <div className="lg:col-span-2">
          {/* Products */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-5 py-4 border-b">
              <h2 className="font-semibold">Sản phẩm ({order.products.length})</h2>
            </div>
            <div className="divide-y">
              {order.products.map((item, index) => (
                <div key={index} className="p-5 flex">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded flex-shrink-0" />
                  <div className="ml-5 flex-grow">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                    {item.size && <div className="text-sm mt-1">Size: {item.size}</div>}
                    <div className="flex justify-between items-end mt-2">
                      <div className="text-sm">Số lượng: {item.quantity}</div>
                      <div className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-5 py-4 border-b">
              <h2 className="font-semibold">Thông tin thanh toán</h2>
            </div>
            <div className="p-5">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Phương thức thanh toán</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tạm tính</span>
                <span>{(order.totalAmount - order.shippingFee).toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>{order.shippingFee.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between py-2 font-medium text-lg">
                <span>Tổng cộng</span>
                <span>{order.totalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Customer info and shipping */}
        <div className="lg:col-span-1">
          {/* Customer info */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-5 py-4 border-b">
              <h2 className="font-semibold">Thông tin khách hàng</h2>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <div className="font-medium">{order.userDetails.name}</div>
                <div className="text-sm text-gray-600">{order.userDetails.email}</div>
                <div className="text-sm text-gray-600">{order.userDetails.phone}</div>
              </div>
            </div>
          </div>

          {/* Shipping info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-5 py-4 border-b">
              <h2 className="font-semibold">Địa chỉ giao hàng</h2>
            </div>
            <div className="p-5">
              <div className="text-sm">
                <p className="mb-1">{order.userDetails.name}</p>
                <p className="mb-1">{order.userDetails.phone}</p>
                <p className="mb-1">
                  {order.userDetails.address},
                  {order.userDetails.city && ` ${order.userDetails.city},`}
                  {order.userDetails.state && ` ${order.userDetails.state},`}
                  {order.userDetails.country && ` ${order.userDetails.country}`}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col space-y-3">
            <button
              onClick={() => window.print()}
              className="w-full py-2 border border-black text-black hover:bg-black hover:text-white transition flex items-center justify-center"
            >
              <span className="mr-2">🖨️</span> In đơn hàng
            </button>
            <button
              onClick={() => navigate('/my-order')}
              className="w-full py-2 bg-black text-white hover:bg-gray-800 transition"
            >
              Quay lại đơn hàng của tôi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;