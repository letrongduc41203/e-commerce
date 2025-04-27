import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="bg-gray-100 text-black">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Về chúng tôi</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/about" className="text-black">Giới thiệu</Link></li>
                            <li><Link to="/careers" className="text-black">Tuyển dụng</Link></li>
                            <li><Link to="/news" className="text-black">Tin tức</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Hỗ trợ</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/faq" className="text-black">FAQ</Link></li>
                            <li><Link to="/shipping" className="text-black">Vận chuyển</Link></li>
                            <li><Link to="/returns" className="text-black">Đổi trả</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Chính sách</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/terms" className="text-black">Điều khoản</Link></li>
                            <li><Link to="/privacy" className="text-black">Bảo mật</Link></li>
                            <li><Link to="/cookies" className="text-black">Cookie</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Kết nối</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-black">Facebook</a></li>
                            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-black">Instagram</a></li>
                            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-black">Twitter</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <p className="text-center text-2xl font-bold mb-6 mt-2">Linea della Vita</p>
                </div>
            </div>
        </footer>
    );
} 