import React, { useState, useEffect } from "react";
import { getUserOrders } from "../services/orderService";
import { useNavigate } from "react-router-dom";

export default function MyOrder() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const saved = localStorage.getItem('lv_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState([]);
  const [latestOrder, setLatestOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra user đã đăng nhập
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-20 bg-white rounded-lg shadow mt-8 text-center mb-70">
        <h2 className="text-xl font-bold text-red-600 mb-4">Bạn chưa đăng nhập!</h2>
        <p>Vui lòng đăng nhập để xem thông tin đơn hàng.</p>
        <button 
          className="mt-6 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800"
          onClick={() => navigate('/login')}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  // Lấy đơn hàng từ API
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        
        // Kiểm tra nếu có đơn hàng mới nhất trong localStorage (đơn vừa thanh toán)
        const latestOrderJson = localStorage.getItem('latest_order');
        if (latestOrderJson) {
          const latestOrderData = JSON.parse(latestOrderJson);
          setLatestOrder(latestOrderData);
          // Xóa thông tin đơn hàng mới nhất sau khi đã hiển thị
          localStorage.removeItem('latest_order');
        }
        
        // Lấy tất cả đơn hàng từ API
        const fetchedOrders = await getUserOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Thông tin đơn hàng</h1>
      
      {loading ? (
        <div className="bg-white rounded shadow p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          <div className="ml-3 font-medium">Đang tải...</div>
        </div>
      ) : error ? (
        <div className="bg-white rounded shadow p-6 text-center text-red-500">
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      ) : (
        <>
          {/* Hiển thị đơn hàng mới nhất nếu có */}
          {latestOrder && (
            <div className="bg-white rounded shadow p-6 mb-8 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="font-semibold text-lg text-green-700">Đơn hàng mới nhất</h2>
              </div>
              
              {/* Thông tin khách hàng */}
              <div className="bg-gray-50 p-4 rounded mb-6">
                <h3 className="font-medium text-base mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Họ tên:</span> {latestOrder.userDetails.name}</div>
                  <div><span className="font-medium">Email:</span> {latestOrder.userDetails.email}</div>
                  <div><span className="font-medium">Số điện thoại:</span> {latestOrder.userDetails.phone}</div>
                  <div className="md:col-span-2"><span className="font-medium">Địa chỉ:</span> {latestOrder.userDetails.address}, {latestOrder.userDetails.city}, {latestOrder.userDetails.state}, {latestOrder.userDetails.country}</div>
                </div>
              </div>
              
              {/* Danh sách sản phẩm */}
              <div>
                <h3 className="font-medium text-base mb-3">Sản phẩm đã thanh toán</h3>
                <div className="space-y-4">
                  {latestOrder.products.map((item, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-3">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          {item.description && <div className="text-xs text-gray-500">{item.description}</div>}
                          {item.size && <div className="text-xs mt-1">Size {item.size}</div>}
                          <div className="text-xs">Số lượng: {item.quantity}</div>
                          <div className="font-medium mt-1">{item.price.toLocaleString('vi-VN')} ₫</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Tổng kết */}
                <div className="mt-4 bg-white border rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Phí vận chuyển</span>
                    <span>{latestOrder.shippingFee.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base">
                    <span>Tổng cộng</span>
                    <span>{latestOrder.totalAmount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Danh sách đơn hàng */}
          {orders && orders.length > 0 ? (
            <div className="bg-white rounded shadow p-6 mb-8">
              <h2 className="font-semibold text-lg mb-4">Lịch sử đơn hàng</h2>
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div key={order._id || index} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-medium">Mã đơn: {order._id}</h3>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">{order.status}</span>
                        <p className="font-semibold mt-1">{order.totalAmount.toLocaleString('vi-VN')} ₫</p>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p><span className="font-medium">Sản phẩm:</span> {order.products.length} sản phẩm</p>
                      <p><span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethod}</p>
                    </div>
                    
                    <button 
                      className="mt-3 w-full py-2 border border-black text-sm hover:bg-black hover:text-white transition"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : !latestOrder ? (
            <div className="bg-white rounded shadow p-6 mb-8 text-center">
              <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
              <button
                className="mt-4 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800"
                onClick={() => navigate('/')}
              >
                Mua sắm ngay
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
