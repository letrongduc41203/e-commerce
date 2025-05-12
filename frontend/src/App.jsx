import React from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home.jsx';
import Checkout from './pages/Checkout.jsx';
import Collections from "./pages/Collections";
import Gifts from "./pages/Gifts";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./pages/CartPage";
import Login from "./components/Login";
import Register from "./components/Register";
import UserInfo from "./pages/UserInfo.jsx";
import NewArrHer from "./pages/NewArrHer";
// import NewArrHim from "./pages/NewArrHim";
// import Accessories from "./pages/Accessories";
import MyOrder from "./pages/MyOrder";
import OrderDetails from "./pages/OrderDetails";
import Men from "./pages/men";

// Admin imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import OrderManagement from './pages/admin/OrderManagement';
import AdminOrderDetails from './pages/admin/OrderDetails';
import ProductManagement from './pages/admin/ProductManagement';
import ProductForm from './pages/admin/ProductForm';

function isAdminRoute(pathname) {
    return pathname.startsWith('/admin');
}

function App() {
    const [user, setUser] = React.useState(() => {
        const saved = localStorage.getItem('lv_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [cartItems, setCartItems] = React.useState(() => {
        const savedUser = localStorage.getItem('lv_user');
        const username = savedUser ? JSON.parse(savedUser).username : 'guest';
        const stored = localStorage.getItem(`cartItems_${username}`);
        return stored ? JSON.parse(stored) : [];
    });
    const [isCartOpen, setIsCartOpen] = React.useState(false);

    const addToCart = (product) => {
        setCartItems(prev => {
            const found = prev.find(item => item.id === product.id);
            if (found) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    // Tăng số lượng
    const handleIncrease = (id) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    // Giảm số lượng
    const handleDecrease = (id) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        ));
    };

    // Xóa sản phẩm
    const handleRemove = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    React.useEffect(() => {
        const username = user ? user.username : 'guest';
        localStorage.setItem(`cartItems_${username}`, JSON.stringify(cartItems));
    }, [cartItems, user]);

    // Hàm load lại cart khi user thay đổi (login/logout)
    React.useEffect(() => {
        const username = user ? user.username : 'guest';
        const stored = localStorage.getItem(`cartItems_${username}`);
        setCartItems(stored ? JSON.parse(stored) : []);
    }, [user]);

    // Khi logout, lưu lại cart hiện tại vào localStorage theo user, không xóa cart của user
    const handleLogout = () => {
        if (user) {
            localStorage.setItem(`cartItems_${user.username}`, JSON.stringify(cartItems));
            localStorage.removeItem('lv_user');
        }
        setUser(null);
        // Khi trở thành guest, load cart guest hoặc để rỗng
        const guestCart = localStorage.getItem('cartItems_guest');
        setCartItems(guestCart ? JSON.parse(guestCart) : []);
    };


    // Hàm login thành công
    const handleLogin = (userObj) => {
        setUser(userObj);
        localStorage.setItem('lv_user', JSON.stringify(userObj));
        // Khi login xong, load lại cart của user
        const stored = localStorage.getItem(`cartItems_${userObj.username}`);
        setCartItems(stored ? JSON.parse(stored) : []);
    };

    // Simple navbar chỉ có logo
    const location = useLocation();
    const SimpleNavbar = () => (
        <nav className="w-full h-14 flex items-center px-6 border-b bg-white">
            <Link to="/" className="text-xl font-bold tracking-widest">Linea della Vita</Link>
        </nav>
    );

    return (
        <div>
            {location.pathname === '/login' || location.pathname === '/register' ? <SimpleNavbar /> : (
                <Navbar
                    cartItems={cartItems}
                    isCartOpen={isCartOpen}
                    setIsCartOpen={setIsCartOpen}
                    user={user}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                />
            )}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections/:season" element={<Collections />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
                <Route path="/cart" element={<CartPage cartItems={cartItems} onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/user-info" element={<UserInfo />} />
                <Route path="/new-arrivals-for-her" element={<NewArrHer />} />
                {/* <Route path="/new-arrivals-for-him" element={<NewArrHim />} /> */}
                {/* <Route path="/accessories" element={<NewArrHer />} /> */}
                <Route path="/my-order" element={<MyOrder />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route path="/men" element={<Men />} />
                {/* <Route path="/women" element={<Women />} /> */}
           

                {/* Admin Login Route */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Routes (Protected) */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="orders/:id" element={<AdminOrderDetails />} />
                    <Route path="orders/pending" element={<OrderManagement />} />
                    <Route path="orders/completed" element={<OrderManagement />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="products/add" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                    <Route path="products/categories" element={<Navigate to="/admin/products" />} />
                </Route>
            </Routes>
            {!isAdminRoute(location.pathname) && <Footer />}
        </div>
    );
}

export default App;