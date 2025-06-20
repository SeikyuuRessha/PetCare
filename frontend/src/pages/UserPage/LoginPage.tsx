import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, getUserRole, getRedirectPath } from "../../utils/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        navigate("/");
    };

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setLoading(true);
        try {
            const success = await login(username, password);
            if (success) {
                const role = getUserRole();
                const redirectPath = getRedirectPath(role || "USER");
                navigate(redirectPath);
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            {/* Left side with image */}
            <div className="w-1/2 bg-teal-700 flex items-center justify-center">
                {/* Khung chứa hình ảnh chó */}
                <div className="bg-white rounded-3xl overflow-hidden p-4">
                    <img
                        src="../public/images/image1.png" // Đường dẫn ảnh chó (cần thay bằng link thực tế)
                        alt="Happy Dog"
                        className="w-80 h-80 object-cover rounded-3xl"
                    />
                </div>
            </div>

            {/* Right side with form */}
            <div className="w-1/2 flex flex-col items-center justify-center relative">
                {/* Nút đóng (góc trên bên phải) */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-red-500 text-xl"
                >
                    ✕
                </button>
                {/* Link quay trở lại (góc trên bên trái) */}
                <Link
                    to="/"
                    className="absolute top-4 left-4 text-sm text-black"
                >
                    Quay trở lại
                </Link>

                <div className="flex flex-col items-center w-80">
                    {/* Logo và tiêu đề */}
                    <div className="flex items-center mb-6">
                        <img
                            src="../public/images/Group.svg" // Đường dẫn logo (cần thay bằng link thực tế)
                            alt="PetHealthy Logo"
                            className="w-12 h-12 mr-2"
                        />
                        <h1 className="text-3xl font-bold text-green-700">
                            PETHEALTHY
                        </h1>
                    </div>

                    {/* Ô nhập username */}
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />
                    {/* Ô nhập mật khẩu */}
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-1 px-4 py-2 border border-purple-400 rounded focus:outline-none"
                    />
                    <Link
                        to="/forgot-password"
                        className="self-end mb-4 text-xs text-red-500"
                    >
                        Quên mật khẩu
                    </Link>

                    {/* Nút đăng nhập */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-purple-300 hover:bg-purple-400 disabled:bg-gray-300 text-white py-2 rounded mb-4"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    {/* Đường gạch ngang phân cách */}
                    <hr className="w-full border-t border-purple-400 mb-4" />

                    {/* Link đăng ký mới */}
                    <Link to="/register" className="text-red-500 text-sm">
                        Đăng ký mới
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* Giải thích chung:
- Chia giao diện thành hai phần: bên trái (ảnh) và bên phải (form).
- Dùng Tailwind CSS để style: flexbox, chia cột, màu sắc, bo góc, padding, margin.
- Các thành phần chính gồm hình ảnh, tiêu đề/logo, ô nhập liệu, nút, và link.
- Component này có thể mở rộng thêm xử lý logic (gửi form, validate) nếu cần.
*/
