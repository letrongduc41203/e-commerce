import React, { useState } from 'react';
import { login } from '../services/authService';

const Checkout = () => {
    // Lấy giỏ hàng từ localStorage (giống App.jsx)
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('lv_user') : null;
    const username = savedUser ? JSON.parse(savedUser).username : 'guest';
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem(`cartItems_${username}`);
        return stored ? JSON.parse(stored) : [];
    });

    const [step, setStep] = useState(1);
    // Lấy thông tin user đã đăng nhập từ localStorage (nếu có)
    const userInfo = savedUser ? JSON.parse(savedUser) : null;

    const [email, setEmail] = useState(userInfo ? userInfo.email || userInfo.username || '' : '');
    const [newsletter, setNewsletter] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // Phân biệt guest hay login
    const [isGuest, setIsGuest] = useState(false);
    // Thêm state cho bước Shipping

    const [password, setPassword] = useState(userInfo ? userInfo.password || '' : '');
    const [passwordError, setPasswordError] = useState('');

    // Validate email
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleContinueEmail = () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        setEmailError('');
        setShowPassword(true);
    };

    const handleEditEmail = () => {
        setShowPassword(false);
        setPassword('');
        setPasswordError('');
    };

    const handleContinueAsGuest = () => {
        setIsGuest(true);
        setStep(2);
    };

    // Khi login thành công thì sang step 2 và không phải guest
    const handleLoginAccount = async () => {
        if (!password) {
            setPasswordError('Please enter your password');
            return;
        }
        setPasswordError('');
        setEmailError('');
        try {
            const res = await login(email, password);
            if (res && res.user) {
                localStorage.setItem('lv_user', JSON.stringify(res.user));
                setIsGuest(false);
                setStep(2);
            } else {
                setPasswordError('Email or password is incorrect');
            }
        } catch (err) {
            setPasswordError('Email or password is incorrect');
        }
    };


    const [shipping, setShipping] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        phoneCode: 'vn',
    });
    const [shippingErrors, setShippingErrors] = useState({});

    const handleShippingChange = (e) => {
        const { id, value } = e.target;
        setShipping(prev => ({ ...prev, [id]: value }));
    };
    const handleShippingSelectChange = (e) => {
        setShipping(prev => ({ ...prev, phoneCode: e.target.value }));
    };

    const handleContinueShipping = () => {
        const errors = {};
        if (!shipping.country) errors.country = 'Please select country';
        if (!shipping.address) errors.address = 'Please enter address';
        if (!shipping.city) errors.city = 'Please enter city';
        if (!shipping.state) errors.state = 'Please enter state';
        if (!shipping.phone) {
            errors.phone = 'Please enter phone number';
        } else if (shipping.phoneCode === 'vn') {
            // Kiểm tra số điện thoại Việt Nam hợp lệ
            const vnPhoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
            if (!vnPhoneRegex.test(shipping.phone)) {
                errors.phone = 'Số điện thoại Việt Nam không hợp lệ (bắt đầu bằng 03, 05, 07, 08, 09 và đủ 10 số)';
            }
        }
        setShippingErrors(errors);
        if (Object.keys(errors).length === 0) {
            setStep(3);
        }
    };



    return (
        <div className="flex justify-center mt-24 mb-24">
            {/* Left: Steps */}
            <div className="w-[800px] bg-white rounded-lg p-8 mr-8">
                {/* Step 1: Your Information */}
                <div>
                    <div className="flex items-center mb-6">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 font-semibold text-white ${step === 1 ? 'bg-black' : 'bg-gray-400'}`}>{1}</div>
                        <div className="font-semibold text-lg tracking-wide">YOUR INFORMATION</div>
                    </div>
                    {step === 1 && !showPassword && (
                        <>
                            <div className="mb-4 flex items-end gap-6">
                                <div>
                                    <div className="font-medium mb-1">* EMAIL</div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Email"
                                        className="w-60 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <button
                                    className="ml-6 px-12 py-2 bg-black text-white rounded-full font-medium text-base hover:bg-gray-900 transition"
                                    onClick={handleContinueEmail}
                                >Continue</button>
                            </div>
                            {emailError && <div className="text-red-500 text-sm mb-2">{emailError}</div>}
                            <div className="text-sm text-gray-700 mb-2 font-medium">NEWSLETTER</div>
                            <div className="text-sm text-gray-700 mb-3">
                                If you wish, you may subscribe to our newsletter and receive updates on LV branded products, services, initiatives and events. Consult the <a href="#" target="_blank" className="underline">Newsletter Privacy Policy</a> for further information.
                            </div>
                            <div className="mb-4 flex items-center">
                                <input type="checkbox" id="newsletter" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} className="mr-2" />
                                <label htmlFor="newsletter" className="text-sm">I want to receive the LV Newsletter</label>
                            </div>
                        </>
                    )}
                    {step === 1 && showPassword && (
                        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="text-gray-700 text-base">Hello</div>
                                    <div className="font-medium text-lg">{email}</div>
                                </div>
                                <button onClick={handleEditEmail} className="px-4 py-1 border border-gray-300 rounded bg-white font-medium hover:bg-gray-100 transition">Edit</button>
                            </div>
                            <div className="border-t border-gray-200 mb-4" />
                            <div className="font-medium mb-1">* PASSWORD</div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-3 rounded border border-gray-300 text-base mb-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
                            <div className="text-sm mb-4">
                                <a href="#" className="text-gray-800 underline">Forgot your Password?</a>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 py-3 border border-black rounded-full bg-white text-black font-medium text-base hover:bg-gray-100 transition"
                                    onClick={handleContinueAsGuest}
                                >Continue as guest</button>
                                <button
                                    className="flex-1 py-3 border-none rounded-full bg-black text-white font-medium text-base hover:bg-gray-900 transition"
                                    onClick={handleLoginAccount}
                                >Log in to your account</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step 2: Shipping */}
                <div className="mt-8">
                    <div className="flex items-center mb-6">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 font-semibold text-white ${step === 2 ? 'bg-black' : 'bg-gray-400'}`}>{2}</div>
                        <div className="font-semibold text-lg tracking-wide">SHIPPING</div>
                    </div>
                    {step === 2 && (
                        <>
                            {isGuest ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex flex-col">
                                    <form className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
                                        {/* TITLE */}
                                        <div>
                                            <label className="font-medium text-base mb-1 block" htmlFor="title">
                                                <span className="text-red-500 mr-1">*</span>TITLE
                                            </label>
                                            <select id="title" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white">
                                                <option value="">Select</option>
                                                <option value="mr">Mr.</option>
                                                <option value="ms">Ms.</option>
                                                <option value="mrs">Mrs.</option>
                                            </select>
                                        </div>
                                        {/* FIRST NAME & LAST NAME */}
                                        <div className="flex gap-6">
                                            <div className="flex-1">
                                                <label className="font-medium text-base mb-1 block" htmlFor="firstName">
                                                    <span className="text-red-500 mr-1">*</span>FIRST NAME
                                                </label>
                                                <input id="firstName" type="text" placeholder="First Name" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="font-medium text-base mb-1 block" htmlFor="lastName">
                                                    <span className="text-red-500 mr-1">*</span>LAST NAME
                                                </label>
                                                <input id="lastName" type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white" />
                                            </div>
                                        </div>
                                        {/* COUNTRY SELECT */}
                                        <div>
                                            <label className="font-medium text-base mb-1 block" htmlFor="country">
                                                <span className="text-red-500 mr-1">*</span>DELIVERY TO:
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <select id="country" value={shipping.country} onChange={handleShippingChange} className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white">
                                                    <option value="">Select Country</option>
                                                    <option value="VIETNAM">VIETNAM</option>
                                                    <option value="FRANCE">FRANCE</option>
                                                    {/* ...other countries */}
                                                </select>
                                                {shippingErrors.country && <div className="text-red-500 text-sm mt-1">{shippingErrors.country}</div>}
                                            </div>
                                        </div>
                                        {/* ADDRESS */}
                                        <div>
                                            <label className="font-medium text-base mb-1 block" htmlFor="address">
                                                <span className="text-red-500 mr-1">*</span>ADDRESS (HOUSE NUMBER, STREET NAME)
                                            </label>
                                            <input id="address" type="text" value={shipping.address} onChange={handleShippingChange} placeholder="Address (House Number, Street Name)" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black" />
                                            {shippingErrors.address && <div className="text-red-500 text-sm mt-1">{shippingErrors.address}</div>}
                                        </div>
                                        {/* CITY & STATE */}
                                        <div className="flex gap-6">
                                            <div className="flex-1">
                                                <label className="font-medium text-base mb-1 block" htmlFor="city">
                                                    <span className="text-red-500 mr-1">*</span>CITY
                                                </label>
                                                <input id="city" type="text" value={shipping.city} onChange={handleShippingChange} placeholder="City" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white" />
                                                {shippingErrors.city && <div className="text-red-500 text-sm mt-1">{shippingErrors.city}</div>}
                                            </div>
                                            <div className="flex-1">
                                                <label className="font-medium text-base mb-1 block" htmlFor="state">
                                                    <span className="text-red-500 mr-1">*</span>STATE
                                                </label>
                                                <input id="state" type="text" value={shipping.state} onChange={handleShippingChange} placeholder="State" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white" />
                                                {shippingErrors.state && <div className="text-red-500 text-sm mt-1">{shippingErrors.state}</div>}
                                            </div>
                                        </div>
                                        {/* PHONE NUMBER */}
                                        <div className="flex gap-6">
                                            <div className="flex-1">
                                                <label className="font-medium text-base mb-1 block" htmlFor="phoneCode">
                                                    <span className="text-red-500 mr-1">*</span>PHONE NUMBER
                                                </label>
                                                <select id="phoneCode" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white">
                                                    <option value="">Select Phone Code</option>
                                                    <option value="vn">VN (+84)</option>
                                                    <option value="fr">FRANCE (+33)</option>
                                                    {/* ...other codes */}
                                                </select>
                                                {shippingErrors.phone && <div className="text-red-500 text-sm mt-1">{shippingErrors.phone}</div>}
                                            </div>
                                            <div className="flex-1 flex items-end">
                                                <div className="w-full">
                                                    <input id="phone" type="tel" value={shipping.phone} onChange={handleShippingChange} onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} placeholder="Phone number" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white" />
                                                    {shippingErrors.phone && <div className="text-red-500 text-sm mt-1">{shippingErrors.phone}</div>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* CONTINUE BUTTON */}
                                        <button type="button" className="w-full mt-4 py-3 rounded-full bg-black text-white font-medium text-base hover:bg-gray-900 transition" style={{ borderRadius: 9999 }} onClick={handleContinueShipping}>Continue</button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex flex-col">
                                    <form className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
                                        {/* COUNTRY SELECT */}
                                        <div>
                                            <label className="font-medium text-base mb-1 block" htmlFor="country">
                                                <span className="text-red-500 mr-1">*</span>DELIVERY TO:
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <select id="country" value={shipping.country} onChange={handleShippingChange} className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white">
                                                    <option value="">Select Country</option>
                                                    <option value="vn">VIETNAM</option>
                                                    <option value="fr">FRANCE</option>
                                                    {/* ...other countries */}
                                                </select>
                                                {shippingErrors.country && <div className="text-red-500 text-sm mt-1">{shippingErrors.country}</div>}
                                            </div>
                                        </div>
                                        {/* ADDRESS */}
                                        <div>
                                            <label className="font-medium text-base mb-1 block" htmlFor="address">
                                                <span className="text-red-500 mr-1">*</span>ADDRESS (HOUSE NUMBER, STREET NAME)
                                            </label>
                                            <input id="address" type="text" value={shipping.address} onChange={handleShippingChange} placeholder="Address (House Number, Street Name)" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black" />
                                            {shippingErrors.address && <div className="text-red-500 text-sm mt-1">{shippingErrors.address}</div>}
                                        </div>
                                        {/* CITY & STATE */}
                                        <div className="flex gap-6">
                                            <div className="flex-1">
                                                <label className="font-medium text-base mb-1 block" htmlFor="city">
                                                    <span className="text-red-500 mr-1">*</span>CITY
                                                </label>
                                                <input id="city" type="text" value={shipping.city} onChange={handleShippingChange} placeholder="City" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white" />
                                                {shippingErrors.city && <div className="text-red-500 text-sm mt-1">{shippingErrors.city}</div>}
                                            </div>
                                            <div className="flex-1">
                                                <label className="font-medium text-base mb-1 block" htmlFor="state">
                                                    <span className="text-red-500 mr-1">*</span>STATE
                                                </label>
                                                <input id="state" type="text" value={shipping.state} onChange={handleShippingChange} placeholder="State" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white" />
                                                {shippingErrors.state && <div className="text-red-500 text-sm mt-1">{shippingErrors.state}</div>}
                                            </div>
                                        </div>
                                        {/* PHONE NUMBER */}
                                        <div className="flex gap-6">
                                            <div className="flex-1">
                                                <label className="font-medium text-base mb-1 block" htmlFor="phoneCode">
                                                    <span className="text-red-500 mr-1">*</span>PHONE NUMBER
                                                </label>
                                                <select id="phoneCode" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white">
                                                    <option value="">Select Phone Code</option>
                                                    <option value="vn">VN (+84)</option>
                                                    <option value="fr">FRANCE (+33)</option>
                                                    {/* ...other codes */}
                                                </select>
                                                {shippingErrors.phone && <div className="text-red-500 text-sm mt-1">{shippingErrors.phone}</div>}
                                            </div>
                                            <div className="flex-1 flex items-end">
                                                <div className="w-full">
                                                    <input id="phone" type="tel" value={shipping.phone} onChange={handleShippingChange} onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} placeholder="Phone number" className="w-full px-4 py-3 rounded border border-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-black bg-white" />
                                                    {shippingErrors.phone && <div className="text-red-500 text-sm mt-1">{shippingErrors.phone}</div>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* CONTINUE BUTTON */}
                                        <button type="button" className="w-full mt-4 py-3 rounded-full bg-black text-white font-medium text-base hover:bg-gray-900 transition" style={{ borderRadius: 9999 }} onClick={handleContinueShipping}>Continue</button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Step 3: Payment */}
                <div className="mt-8">
                    <div className="flex items-center mb-6">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 font-semibold text-white ${step === 3 ? 'bg-black' : 'bg-gray-400'}`}>{3}</div>
                        <div className="font-semibold text-lg tracking-wide">PAYMENT</div>
                    </div>
                    {step === 3 && (
                        <div style={{ marginBottom: 24 }}>
                            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="font-semibold text-base mb-3">Shipping Information</div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <div><span className="font-medium">Country:</span> {shipping.country || '-'}</div>
                                    <div><span className="font-medium">Address:</span> {shipping.address || '-'}</div>
                                    <div><span className="font-medium">City:</span> {shipping.city || '-'}</div>
                                    <div><span className="font-medium">State:</span> {shipping.state || '-'}</div>
                                    <div><span className="font-medium">Phone:</span> ({shipping.phoneCode ? shipping.phoneCode.toUpperCase() : ''}) {shipping.phone || '-'}</div>
                                </div>
                            </div>
                            {/* Thêm form thanh toán tại đây */}
                            <div style={{ color: '#888' }}>Enjoy free delivery on all orders.</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Shopping Bag */}
            <div className="w-[500px] bg-gray-50 rounded-lg p-8">
                {/* Shopping Bag thực tế */}
                <div className="text-center font-semibold text-lg mb-5">SHOPPING BAG</div>
                <div className="text-sm text-gray-700 mb-3">
                    You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your Shopping Bag
                </div>
                {/* Danh sách sản phẩm thực tế */}
                {cartItems.length === 0 ? (
                    <div className="text-center text-gray-400">Your shopping bag is empty.</div>
                ) : (
                    <>
                        {cartItems.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 mb-4">
                                <div className="flex gap-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                        {item.size && <div className="text-xs mt-1">Size {item.size}</div>}
                                        <div className="text-xs">Quantity {item.quantity}</div>
                                        <div className="font-medium mt-2">Price {item.price.toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Tổng kết */}
                        <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="flex justify-between text-base mb-2">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg mb-2">
                                <span>Subtotal</span>
                                <span>{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('vi-VN')} ₫</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Checkout;

