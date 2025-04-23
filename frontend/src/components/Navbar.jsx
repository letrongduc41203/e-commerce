import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartPopup from './CartPopup';
import { Menu, X, Search, UserRound } from 'lucide-react';
// import { collections } from '../data/collections'; // Đã chuyển sang lấy từ API MongoDB

export function Navbar({ cartItems, isCartOpen, setIsCartOpen, onIncrease, onDecrease, onRemove, user, onLogout }) {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const popupRef = React.useRef(null);
    // Ẩn popup khi click ra ngoài
    React.useEffect(() => {
        if (!showUserInfo) return;
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowUserInfo(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserInfo]);
    // user và setUser được quản lý từ App, không cần useState ở đây
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredId, setHoveredId] = useState(null);

    const menuItems = [
        { id: 1, title: "Qùa tặng", path: "/gifts" },
        { id: 2, title: "Sản phẩm mới", path: "/new-arrivals" },
        { id: 3, title: "Túi và Phụ kiện bằng da", path: "/bags-accessories" },
        { id: 4, title: "Đồ Nữ", path: "/women" },
        { id: 5, title: "Đồ Nam", path: "/men" },
        { id: 6, title: "Trang sức", path: "/jewelry" },
        { id: 7, title: "Đồng hồ", path: "/watches" },
        { id: 8, title: "Nước hoa", path: "/perfumes" }
    ];

    // Lấy collections từ API MongoDB
    const [collections, setCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(true);
    const [errorCollections, setErrorCollections] = useState(null);
    React.useEffect(() => {
        import('../services/api/collectionApi').then(({ fetchCollections }) => {
            fetchCollections()
                .then(data => {
                    setCollections(data);
                    setLoadingCollections(false);
                })
                .catch(err => {
                    setErrorCollections(err.message);
                    setLoadingCollections(false);
                });
        });
    }, []);

    // Gom tất cả sản phẩm từ các collection
    const allProducts = collections.flatMap(col => col.products || []);
    const [search, setSearch] = useState('');
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const keywordTags = ['giày', 'vòng tay', 'khăn', 'áo khoác'];
    const navigate = useNavigate();
    const searchResults = search.trim()
        ? allProducts.filter(p => p.name && p.name.toLowerCase().includes(search.toLowerCase()))
        : [];

    return (
        <>
            <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 border-b bg-white z-50">
                {/* Menu + Search group */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <button
                        className="text-lg font-medium flex items-center gap-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-6 h-6" /> Menu
                    </button>
                    <div className="relative hidden md:block">
                        <button
                            className="flex items-center gap-2 px-2 py-1 bg-transparent hover:bg-gray-100 rounded transition-colors select-none"
                            onClick={() => setShowSearchOverlay(true)}
                            tabIndex={0}
                            type="button"
                        >
                            <Search className="w-5 h-5 text-black" />
                            <span className="text-base text-black">Tìm kiếm</span>
                        </button>
                    </div>
                    {/* Overlay Search UI */}
                    {showSearchOverlay && (
                        <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center px-2 pt-8 animate-fade-in">
                            {/* Close button */}
                            <button
                                className="absolute top-4 right-6 text-xl text-gray-500 hover:text-black"
                                onClick={() => { setShowSearchOverlay(false); setSearch(''); }}
                                aria-label="Đóng tìm kiếm"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            {/* Logo */}
                            <div className="text-2xl font-bold mb-6 mt-2">LOUIS VUITTON</div>
                            {/* Search input */}
                            <div className="w-full max-w-2xl flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
                                <Search className="w-5 h-5 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent outline-none text-base"
                                    placeholder="Tìm các mẫu thiết kế"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoFocus
                                />
                                {search && (
                                    <button className="ml-2 text-gray-400 hover:text-black" onClick={() => setSearch('')}>Xóa</button>
                                )}
                            </div>
                            {/* Tag gợi ý */}
                            <div className="flex items-center gap-3 mb-6 flex-wrap justify-center">
                                <span className="text-xs text-gray-400 uppercase tracking-widest mr-2">CÁC TỪ KHÓA PHỔ BIẾN</span>
                                {keywordTags.map(tag => (
                                    <button key={tag} className="px-3 py-1 rounded-full border text-xs hover:bg-gray-100 bg-white" onClick={() => setSearch(tag)}>{tag}</button>
                                ))}
                            </div>
                            {/* Grid sản phẩm */}
                            {loadingCollections ? (
                                <div className="w-full text-center py-8">Đang tải sản phẩm...</div>
                            ) : errorCollections ? (
                                <div className="w-full text-center py-8 text-red-500">Lỗi: {errorCollections}</div>
                            ) : (
                                <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mx-auto">
                                    {(search ? searchResults : allProducts.slice(0, 10)).map(product => (
                                        <div key={product.id} className="flex flex-col items-center group cursor-pointer" onClick={() => { setShowSearchOverlay(false); setSearch(''); navigate(`/product/${product.id}`); }}>
                                            <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-2">
                                                <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200" />
                                            </div>
                                            <div className="text-xs text-gray-600 text-center mb-1">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.price?.toLocaleString('vi-VN') || ''} ₫</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    )}
                </div>
                <Link to="/" className="text-xl font-bold">LOUIS VUITTON</Link>

                <div className="flex items-center gap-2 relative">
                    {/* Đăng nhập/Đăng xuất */}
                    {user && user.firstName && user.lastName ? (
                        <button
                            className="flex items-center gap-1 text-xs px-2 py-1 border rounded hover:bg-gray-100 relative"
                            onClick={() => setShowUserInfo(v => !v)}
                            type="button"
                        >
                            <span className="font-semibold text-sm cursor-pointer">{user.firstName} {user.lastName}</span>

                            {/* Popup nhỏ khi click */}

                            {showUserInfo && (
                                <div ref={popupRef} className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border rounded shadow px-3 py-2 text-xs whitespace-nowrap z-50 flex items-center gap-2 min-w-[120px]">
                                    <span>{user.firstName} {user.lastName}</span>
                                    <button
                                        className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs font-medium hover:bg-gray-300 transition"
                                        onClick={onLogout}
                                        type="button"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </button>
                    ) : (
                        <button
                            className="flex items-center gap-1 text-xs px-2 py-1 border rounded hover:bg-gray-100 relative"
                            onClick={() => navigate('/login')}
                            type="button"
                        >
                            <UserRound className="w-5 h-5 cursor-pointer" />
                        </button>
                    )}

                    <button
                        className="relative mr-2"
                        onClick={e => { e.preventDefault(); setIsCartOpen(!isCartOpen); }}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                    >
                        <span className="text-2xl">🛒</span>
                    </button>
                    {isCartOpen && (
                        <>
                            {/* Overlay */}
                            <div
                                className="fixed inset-0 bg-black bg-opacity-0 z-40"
                                onClick={() => setIsCartOpen(false)}
                            />
                            {/* Popup */}
                            <div
                                className="absolute right-0 top-full mt-2 z-50"
                                onClick={e => e.stopPropagation()}
                            >
                                <CartPopup
                                    cartItems={cartItems}
                                    onClose={() => setIsCartOpen(false)}
                                    onIncrease={onIncrease}
                                    onDecrease={onDecrease}
                                    onRemove={onRemove}
                                />
                            </div>
                        </>
                    )}
                    <button className="text-sm">Liên hệ với chúng tôi</button>
                </div>
            </nav>

            {/* Menu overlay */}
            <div
                className={`fixed inset-0 transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'} bg-black z-40`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Sliding menu */}
            <div className={`
                fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Nút đóng */}
                <button
                    className="absolute top-4 left-4 text-lg font-medium flex items-center gap-2 hover:text-gray-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <X className="w-6 h-6" /> Đóng
                </button>

                <div className="px-8 py-4 space-y-8 mt-20">
                    {menuItems.map(item => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`block text-lg font-bold transition-all duration-200
                                ${hoveredId === item.id ? 'font-bold underline' :
                                    hoveredId ? 'opacity-50' : ''}
                            `}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
