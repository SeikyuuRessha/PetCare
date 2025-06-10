import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../utils/auth";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegister = async () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        if (!formData.username || !formData.fullName || !formData.password) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        try {
            const success = await register({
                username: formData.username,
                email: formData.email || undefined,
                fullName: formData.fullName,
                password: formData.password,
                phone: formData.phone || undefined,
                address: formData.address || undefined,
            });

            if (success) {
                navigate("/");
            }
        } catch (error) {
            console.error("Register error:", error);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            {/* Left side with image */}
            <div className="w-1/2 bg-teal-700 flex items-center justify-center">
                <div className="bg-white rounded-3xl overflow-hidden p-4">
                    <img
                        src="../public/images/image1.png"
                        alt="Happy Dog"
                        className="w-80 h-80 object-cover rounded-3xl"
                    />
                </div>
            </div>

            {/* Right side with form */}
            <div className="w-1/2 flex flex-col items-center justify-center relative">
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 right-4 text-red-500 text-xl"
                >
                    ✕
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 text-sm text-black"
                >
                    Quay trở lại
                </button>

                <div className="flex flex-col items-center w-80">
                    <div className="flex items-center mb-6">
                        <img
                            src="../public/images/Group.svg"
                            alt="PetHealthy Logo"
                            className="w-12 h-12 mr-2"
                        />
                        <h1 className="text-3xl font-bold text-green-700">
                            PETHEALTHY
                        </h1>
                    </div>

                    <input
                        type="text"
                        name="username"
                        placeholder="Tên đăng nhập"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Họ và tên"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />

                    <button
                        onClick={handleRegister}
                        className="w-full bg-purple-300 hover:bg-purple-400 text-white py-2 rounded mb-4"
                    >
                        Đăng ký
                    </button>

                    <hr className="w-full border-t border-purple-400 mb-4" />
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
