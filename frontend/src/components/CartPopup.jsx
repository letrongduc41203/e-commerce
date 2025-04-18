import React from "react";

export default function CartPopup({ cartItems, onClose, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="w-96 bg-white border rounded shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <span className="font-bold mx-auto">ADDED TO SHOPPING BAG</span>
                <button onClick={onClose} className="text-xl font-bold">×</button>
            </div>
            {/* Danh sách sản phẩm - chỉ phần này scroll */}
            <div className="p-4 flex flex-col gap-4 max-h-64 overflow-y-auto">
                {cartItems.length === 0 ? (
                    <div>Your bag is empty.</div>
                ) : (
                    cartItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            <img src={item.image} alt="" className="w-16 h-16 object-cover" />
                            <div className="flex-1">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-lg font-medium">{item.price.toLocaleString('vi-VN')} ₫</div>
                                <div className="text-xs text-gray-600">ID: {item.id}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <button onClick={() => onDecrease(item.id)} className="border rounded px-2">-</button>
                                    <span className="text-xs">{item.quantity}</span>
                                    <button onClick={() => onIncrease(item.id)} className="border rounded px-2">+</button>
                                </div>
                            </div>
                            <button onClick={() => onRemove(item.id)} className="text-red-500 text-lg font-bold ml-2">×</button>
                        </div>
                    ))
                )}
            </div>
            {/* Footer */}
            <div className="p-4 border-t flex flex-col gap-3">
                <button className="w-full bg-black text-white py-3 font-bold rounded">CHECKOUT</button>
                <button
                  className="w-full border border-black py-3 font-bold rounded"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/cart';
                    }
                    if (onClose) onClose();
                  }}
                >
                  VIEW SHOPPING BAG
                </button>
            </div>
        </div>
    );
}