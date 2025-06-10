import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import TopBar from "../../components/layouts/TopBar";
import Footer from "../../components/layouts/Footer";
import { logout } from "../../utils/auth";
import { userService, User } from "../../services/userService";
import UserInformationForm from "../../components/Form/UserInformationForm";

export default function UserInformationPage() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [avatarImage, setAvatarImage] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const userProfile = await userService.getProfile();
            setUser(userProfile);
        } catch (error) {
            console.error("Failed to load user profile:", error);
            // If token is invalid, redirect to login
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatarImage(imageUrl);
        }
    };

    if (loading) {
        return (
            <div className="font-sans bg-white min-h-screen">
                <TopBar />
                <Header />
                <main className="relative z-10 px-12 pt-2 pb-12">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Đang tải thông tin...</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="font-sans bg-white min-h-screen">
                <TopBar />
                <Header />
                <main className="relative z-10 px-12 pt-2 pb-12">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-red-500">
                            Không thể tải thông tin người dùng
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="font-sans bg-white min-h-screen">
            <TopBar />
            <Header />

            {/* Main Content */}
            <main className="relative z-10 px-12 pt-2 pb-12">
                <h2 className="text-2xl font-bold mt-6 mb-6">
                    Thông tin tài khoản
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block font-medium mb-1">
                                    Tên đăng nhập
                                </label>
                                <input
                                    className="w-full border rounded px-3 py-2 bg-gray-50"
                                    value={user.username}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block font-medium mb-1">
                                    Tên đầy đủ
                                </label>
                                <input
                                    className="w-full border rounded px-3 py-2 bg-gray-50"
                                    value={user.fullName}
                                    readOnly
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    className="w-full border rounded px-3 py-2 bg-gray-50"
                                    value={user.email || "Chưa cập nhật"}
                                    readOnly
                                />
                            </div>
                        </div>{" "}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block font-medium mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    className="w-full border rounded px-3 py-2 bg-gray-50"
                                    value={user.phone || "Chưa cập nhật"}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">
                                Địa chỉ
                            </label>
                            <textarea
                                className="w-full border rounded px-3 py-2 bg-gray-50 h-20 resize-none"
                                value={user.address || "Chưa cập nhật"}
                                readOnly
                            />
                        </div>
                    </div>
                    {/* Right column - Avatar */}
                    <div className="flex flex-col items-center">
                        <label className="block font-medium mb-3">
                            Ảnh đại diện
                        </label>
                        <div className="relative">
                            {avatarImage ? (
                                <div className="relative">
                                    <img
                                        src={avatarImage}
                                        alt="Avatar"
                                        className="w-40 h-40 object-cover rounded-full border-4 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setAvatarImage(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        id="avatar-image"
                                    />
                                    <label
                                        htmlFor="avatar-image"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mb-2 border-2 border-dashed border-gray-400 hover:border-gray-600 transition">
                                            <span className="text-4xl text-gray-500">
                                                +
                                            </span>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                                            Click để tải ảnh lên
                                        </span>
                                    </label>
                                </>
                            )}
                        </div>
                    </div>{" "}
                </div>

                {/* Buttons */}
                <div className="mt-8 flex gap-6">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
                    >
                        Đăng xuất
                    </button>
                    <button
                        type="button"
                        className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
                        onClick={() => setShowModal(true)}
                    >
                        Chỉnh sửa thông tin
                    </button>
                </div>
            </main>

            {/* Modal Dialog */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white p-6 rounded-2xl w-full max-w-5xl mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <UserInformationForm
                            onClose={() => setShowModal(false)}
                            onSuccess={loadUserProfile}
                            userData={user}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
