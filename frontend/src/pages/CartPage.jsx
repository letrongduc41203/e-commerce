import React from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage({ cartItems, onIncrease, onDecrease, onRemove }) {
    // Tính tổng tiền
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const total = subtotal + shipping;
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row p-8 gap-8 pt-20">
            {/* Left: Danh sách sản phẩm */}
            <div className="bg-white rounded shadow-md flex-1 p-6">
                <h2 className="font-bold mb-4 text-lg">SHOPPING BAG</h2>
                {cartItems.length === 0 ? (
                    <>
                        <div>Giỏ hàng của bạn trống.</div>
                        <div className="w-full flex justify-center items-center mb-6">
                            <button
                                className="bg-white border border-black px-6 py-2 rounded font-semibold shadow hover:bg-gray-50 transition"
                                onClick={() => navigate('/')}
                            >
                                ← Quay lại mua sắm
                            </button>
                        </div>
                    </>
                ) : (
                    cartItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center mb-6 border-b pb-4">
                            <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded" />
                            <div className="flex-1">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-gray-600 text-sm mb-1">{item.description}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span>Quantity:</span>
                                    <button onClick={() => onDecrease(item.id)} className="border rounded px-2">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => onIncrease(item.id)} className="border rounded px-2">+</button>
                                </div>
                                <div className="mt-2">Price: <span className="font-bold">{item.price.toLocaleString('vi-VN')} ₫</span></div>
                            </div>
                            <button onClick={() => onRemove(item.id)} className="text-red-500 text-lg font-bold ml-2">×</button>
                        </div>
                    ))
                )}

            </div>

            {/* Right: Tổng tiền và thanh toán */}
            <div className="bg-white rounded shadow-md w-full md:w-96 p-6 flex flex-col gap-4">
                <div className="text-xs mb-2">YOU HAVE {cartItems.length} ITEM{cartItems.length !== 1 ? 'S' : ''} IN YOUR SHOPPING BAG</div>
                <div className="flex justify-between py-2 border-b">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span>Total</span>
                    <span>{total.toLocaleString('vi-VN')} ₫</span>
                </div>
                <button className="w-full border border-black py-3 font-bold rounded flex items-center justify-center gap-2">
                    <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="w-6 h-6" /> PayPal
                </button>

                <button
                    className="w-full bg-black text-white py-3 font-bold rounded"
                    onClick={() => {
                        let user = null;
                        try {
                            user = JSON.parse(localStorage.getItem('lv_user'));
                        } catch { }
                        if (!user) {
                            alert('Bạn cần đăng nhập để thanh toán!');
                            window.location.href = '/login';
                            return;
                        }
                        // Nếu đã đăng nhập, chuyển đến trang checkout
                        window.location.href = '/checkout';
                    }}
                >
                    Checkout
                </button>

            </div>
        </div>
    );
}
