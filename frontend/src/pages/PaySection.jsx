import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";

export default function PaySection({ cartItems, shipping }) {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, error
  const [message, setMessage] = useState('');

  // Hàm xử lý khi thanh toán thành công
  const handlePaymentSuccess = async () => {
    try {
      setPaymentStatus('processing');
      setMessage('Đang xử lý thanh toán...');

      // Lấy thông tin user từ localStorage
      const userJson = localStorage.getItem('lv_user');
      if (!userJson) {
        throw new Error('Vui lòng đăng nhập để thanh toán');
      }
      const user = JSON.parse(userJson);

      // Tính tổng tiền
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );
      const shippingFee = 30000;

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        userDetails: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: shipping.phone,
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          country: shipping.country
        },
        products: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          description: item.description,
          size: item.size
        })),
        totalAmount,
        shippingFee
      };

      // Gửi dữ liệu đơn hàng lên server
      const response = await createOrder(orderData);

      // Xóa giỏ hàng sau khi thanh toán thành công
      localStorage.removeItem('cartItems');
      
      // Lưu thông tin đơn hàng mới nhất vào localStorage (để có thể hiển thị ngay cả khi API chưa update)
      localStorage.setItem('latest_order', JSON.stringify(response));

      setPaymentStatus('success');
      setMessage('Thanh toán thành công!');
      
      // Chuyển hướng đến trang MyOrder sau 2 giây
      setTimeout(() => {
        navigate('/my-order');
      }, 2000);

    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      setPaymentStatus('error');
      setMessage(error.message || 'Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-900 transition mb-3"
        onClick={() => setShowQR(true)}
        type="button"
        disabled={paymentStatus === 'processing'}
      >
        Pay
      </button>

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center relative min-w-[320px]">
            {paymentStatus === 'pending' && (
              <>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=DemoBankTransfer123456"
                  alt="Bank QR Code"
                  className="mb-4 rounded border"
                />
                <div className="mb-2 text-center font-semibold text-base">Quét mã QR để thanh toán</div>
                <div className="flex gap-3 mt-4">
                  <button
                    className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 font-medium"
                    onClick={handlePaymentSuccess}
                    type="button"
                  >
                    Đã thanh toán
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-medium"
                    onClick={() => setShowQR(false)}
                    type="button"
                  >
                    Đóng
                  </button>
                </div>
              </>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto mb-4"></div>
                <div className="font-medium text-base">{message}</div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="font-medium text-base text-green-600">{message}</div>
                <div className="text-sm text-gray-500 mt-2">Đang chuyển hướng đến trang đơn hàng...</div>
              </div>
            )}

            {paymentStatus === 'error' && (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div className="font-medium text-base text-red-600">{message}</div>
                <button
                  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-medium"
                  onClick={() => {
                    setPaymentStatus('pending');
                    setMessage('');
                  }}
                  type="button"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
