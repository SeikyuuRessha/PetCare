import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../../utils/auth";
import { userService, User } from "../../services/userService";

export default function DoctorPage() {
    const navigate = useNavigate();
    const [doctorInfo, setDoctorInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDoctorInfo();
    }, []);
    const loadDoctorInfo = async () => {
        try {
            setLoading(true);
            // Use getUser() directly since we only need current user's info
            const currentUser = getUser();
            if (currentUser) {
                setDoctorInfo(currentUser);
            }
        } catch (error: any) {
            console.error("Failed to load doctor info:", error);
            if (error?.response?.status === 401) {
                await logout();
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="font-sans bg-white min-h-screen">
            {/* Top green bar */}
            <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-8 py-1">
                <span>Welcome To Our Pet Store</span>
                <span>Currency: $USD</span>
            </div>

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center py-12 px-4">
                <div className="flex flex-col md:flex-row items-start justify-center gap-16 w-full max-w-5xl mt-8">
                    {/* Doctor Image */}
                    <div className="flex-shrink-0">
                        <div className="rounded-[32px] border-2 border-black overflow-hidden w-[350px] h-[350px] flex items-center justify-center bg-white">
                            <img
                                src="../public/images/staff3.jpg"
                                alt="Doctor"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>{" "}
                    {/* Doctor Info */}
                    <div className="bg-[#ededed] border border-black rounded-lg px-10 py-8 min-w-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7bb12b]"></div>
                                <span className="ml-2">
                                    Đang tải thông tin...
                                </span>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-semibold mb-6">
                                    Bác Sĩ: {doctorInfo?.fullName || "N/A"}
                                </h2>
                                <div className="space-y-3 text-lg">
                                    <div className="flex">
                                        <span className="w-40 font-medium">
                                            Username:
                                        </span>
                                        <span>
                                            {doctorInfo?.username || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-40 font-medium">
                                            Email:
                                        </span>
                                        <span>
                                            {doctorInfo?.email || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-40 font-medium">
                                            Số điện thoại:
                                        </span>
                                        <span>
                                            {doctorInfo?.phone || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-40 font-medium">
                                            Địa chỉ:
                                        </span>
                                        <span>
                                            {doctorInfo?.address || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-40 font-medium">
                                            Vai trò:
                                        </span>
                                        <span>{doctorInfo?.role || "N/A"}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>{" "}
                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-8 mt-16 w-full max-w-6xl justify-center">
                    <button
                        onClick={() => navigate("/doctor/medical-records")}
                        className="bg-[#7bb12b] text-white text-xl font-semibold rounded-xl px-12 py-4 shadow-md border border-black hover:bg-[#6aa11e] transition"
                    >
                        TRANG BỆNH ÁN
                    </button>
                    <button
                        onClick={() => navigate("/doctor/appointments")}
                        className="bg-[#1797a6] text-white text-xl font-semibold rounded-xl px-12 py-4 shadow-md border border-black hover:bg-[#127c8a] transition"
                    >
                        TRANG LỊCH KHÁM
                    </button>
                    <button
                        onClick={() => navigate("/doctor/history")}
                        className="bg-[#9c27b0] text-white text-xl font-semibold rounded-xl px-12 py-4 shadow-md border border-black hover:bg-[#7b1fa2] transition"
                    >
                        LỊCH SỬ KHÁM BỆNH
                    </button>
                    <button
                        onClick={() => navigate("/doctor/medicines")}
                        className="bg-[#ff6b35] text-white text-xl font-semibold rounded-xl px-12 py-4 shadow-md border border-black hover:bg-[#e55a30] transition"
                    >
                        QUẢN LÝ THUỐC
                    </button>
                </div>
                {/* Logout Button */}
                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        className="bg-[#7bb12b] hover:bg-[#6aa11e] text-white px-8 py-2 rounded-lg border border-black transition font-medium"
                    >
                        Đăng xuất
                    </button>
                </div>
            </main>
        </div>
    );
}
