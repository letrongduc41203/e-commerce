import React, { useState } from "react";

export default function UserInfo() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('lv_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        title: user?.title || 'Mr.',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        dob: user?.dob || ''
    });
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu mới và xác nhận không khớp.");
            return;
        }
        setMessage("");
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage("Bạn cần đăng nhập lại để đổi mật khẩu.");
                return;
            }
            // Gọi API đổi mật khẩu
            const { changePassword } = await import('../services/authService');
            await changePassword({ oldPassword, newPassword, token });
            setMessage("Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setMessage(err.message || "Đổi mật khẩu thất bại");
        }
    };

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto p-20 bg-white rounded-lg shadow mt-8 text-center mb-70">
                <h2 className="text-xl font-bold text-red-600 mb-4">Bạn chưa đăng nhập!</h2>
                <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
            </div>
        );
    }
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-20 mb-10">
            {/* MY PERSONAL DETAILS */}
            <h2 className="text-3xl mb-8 tracking-wide">MY PERSONAL DETAILS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider">Title*</label>
                    <select
                        value={editMode ? editData.title : user.title || 'Mr.'}
                        disabled={!editMode}
                        className={`w-full border rounded px-3 py-2 ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                        onChange={e => setEditData(ed => ({ ...ed, title: e.target.value }))}
                    >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider">First Name*</label>
                    <input
                        type="text"
                        value={editMode ? editData.firstName : user.firstName || ''}
                        readOnly={!editMode}
                        className={`w-full border rounded px-3 py-2 ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                        onChange={e => setEditData(ed => ({ ...ed, firstName: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider">Last Name*</label>
                    <input
                        type="text"
                        value={editMode ? editData.lastName : user.lastName || ''}
                        readOnly={!editMode}
                        className={`w-full border rounded px-3 py-2 ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                        onChange={e => setEditData(ed => ({ ...ed, lastName: e.target.value }))}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider">Phone</label>
                    <input
                        type="text"
                        value={editMode ? editData.phone : user.phone || ''}
                        readOnly={!editMode}
                        className={`w-full border rounded px-3 py-2 ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                        onChange={e => setEditData(ed => ({ ...ed, phone: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider">Date of Birth*</label>
                    <input
                        type="date"
                        value={editMode ? editData.dob : user.dob || ''}
                        readOnly={!editMode}
                        disabled={!editMode}
                        className={`w-full border rounded px-3 py-2 ${editMode ? 'bg-white' : 'bg-gray-100'}`}
                        onChange={e => setEditData(ed => ({ ...ed, dob: e.target.value }))}
                    />
                </div>
            </div>
            <div className="mb-8 flex gap-2">
                {editMode ? (
                    <>
                        <button
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                            onClick={() => {
                                setUser(u => {
                                    const updated = { ...u, ...editData };
                                    localStorage.setItem('lv_user', JSON.stringify(updated));
                                    return updated;
                                });
                                setEditMode(false);
                                window.location.reload();
                            }}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                            onClick={() => {
                                setEditData({
                                    firstName: user.firstName || '',
                                    lastName: user.lastName || '',
                                    phone: user.phone || ''
                                });
                                setEditMode(false);
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                        onClick={() => setEditMode(true)}
                    >
                        Edit
                    </button>
                )}
            </div>
            {/* MY CREDENTIALS */}
            <h2 className="text-3xl mb-4 tracking-wide mt-10">MY CREDENTIALS</h2>
            <div className="mb-8">
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider">Email*</label>
                <input type="email" value={user.email || ''} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
            </div>
            {/* Đổi mật khẩu */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form className="space-y-4 max-w-md" onSubmit={handleChangePassword}>
                    <div>
                        <label className="block mb-1">Old Password</label>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && (
                        <div className="text-sm text-red-500">{message}</div>
                    )}
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                    >
                        Confirm
                    </button>
                </form>
            </div>
        </div>
    );
}
