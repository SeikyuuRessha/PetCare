import React, { useState } from "react";
import { userService, User } from "../../services/userService";

interface UserInformationFormProps {
    onClose?: () => void;
    onSuccess?: () => void;
    userData?: User;
}

export default function UserInformationForm({
    onClose,
    onSuccess,
    userData,
}: UserInformationFormProps) {
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: userData?.username || "",
        fullName: userData?.fullName || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        address: userData?.address || "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAvatar(file);
        if (file) {
            setAvatarUrl(URL.createObjectURL(file));
        } else {
            setAvatarUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username.trim() || !formData.fullName.trim()) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                username: formData.username.trim(),
                fullName: formData.fullName.trim(),
                email: formData.email.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                address: formData.address.trim() || undefined,
            };

            await userService.updateProfile(updateData);
            alert("Cập nhật thông tin thành công!");
            onSuccess?.();
            onClose?.();
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert(
                error.response?.data?.message ||
                    "Có lỗi xảy ra khi cập nhật thông tin!"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="relative">
            {/* Close button */}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
                >
                    ×
                </button>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-[#ededed] rounded-2xl border border-black p-6 max-w-5xl mx-auto shadow-md"
                style={{ minHeight: 600 }}
            >
                <h3 className="text-xl font-semibold mb-6 text-center">
                    Chỉnh sửa thông tin tài khoản
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left + Middle columns */}
                    <div className="md:col-span-2">
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-base mb-1">
                                    Tên tài khoản{" "}
                                    <span className="text-[#7bb12b]">*</span>
                                </label>
                                <input
                                    name="username"
                                    className="w-full border rounded px-3 py-2 text-base bg-gray-100"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    readOnly
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-base mb-1">
                                    Tên đầy đủ{" "}
                                    <span className="text-[#7bb12b]">*</span>
                                </label>
                                <input
                                    name="fullName"
                                    className="w-full border rounded px-3 py-2 text-base"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-base mb-1">
                                Email <span className="text-[#7bb12b]">*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                className="w-full border rounded px-3 py-2 text-base"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-base mb-1">
                                Số điện thoại
                            </label>
                            <input
                                name="phone"
                                className="w-full border rounded px-3 py-2 text-base"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-base mb-1">
                                Địa chỉ thường trú
                            </label>
                            <input
                                name="address"
                                className="w-full border rounded px-3 py-2 text-base"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Right column */}
                    <div>
                        <label className="block text-base mb-1">
                            Ảnh đại diện
                        </label>
                        {avatarUrl && (
                            <div className="mb-2 flex justify-center">
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="w-32 h-32 object-cover rounded-full border border-gray-400"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="mb-2"
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow hover:bg-gray-600 transition"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-[#5d990f] text-white px-10 py-3 rounded-full font-semibold text-lg shadow hover:bg-[#7bb12b] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        style={{ boxShadow: "2px 4px 8px #8888" }}
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : "Lưu thông tin"}
                    </button>
                </div>
            </form>
        </div>
    );
}
