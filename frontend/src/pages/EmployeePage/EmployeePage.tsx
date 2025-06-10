import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeePage() {
    const navigate = useNavigate();

    return (
        <div className="font-sans bg-white min-h-screen">
            {/* Top green bar */}
            <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-0 md:px-8 py-1">
                <span className="ml-4 flex items-center gap-2">
                    Welcome To Our Pet Store
                    <span className="inline-block ml-2">
                        <i className="fa fa-truck" />
                    </span>
                    <span className="ml-2">Order Tracking</span>
                </span>
                <span className="flex items-center gap-2 mr-4">
                    <span>Currency: $USD</span>
                    <span>|</span>
                    <span>
                        Account{" "}
                        <span className="align-super text-[10px]">▼</span>
                    </span>
                </span>
            </div>
            {/* Main Content */}
            <main className="flex flex-col items-center">
                <h1 className="text-5xl font-light text-center mt-16 mb-12">
                    EMPLOYEE
                </h1>
                <div className="flex flex-col items-center gap-12">
                    <div className="flex flex-col md:flex-row gap-16 mb-8">
                        <button
                            onClick={() => navigate("/employee/appointments")}
                            className="bg-[#5d990f] text-white text-4xl rounded-2xl px-16 py-10 shadow-md border border-black hover:bg-[#7bb12b] transition min-w-[420px] mb-8 md:mb-0"
                            style={{ boxShadow: "2px 4px 8px #8888" }}
                        >
                            Quản Lí Lịch Hẹn
                        </button>
                        <button
                            onClick={() => navigate("/employee/pets")}
                            className="bg-[#1797a6] text-white text-4xl rounded-2xl px-16 py-10 shadow-md border border-black hover:bg-[#127c8a] transition min-w-[420px]"
                            style={{ boxShadow: "2px 4px 8px #8888" }}
                        >
                            Quản lí hồ sơ thú cưng
                        </button>{" "}
                    </div>{" "}
                    <div className="flex flex-col md:flex-row gap-16 mb-8">
                        <button
                            onClick={() => navigate("/employee/services")}
                            className="bg-[#d6c400] text-white text-4xl rounded-2xl px-16 py-10 shadow-md border border-black hover:bg-[#e6d700] transition min-w-[420px] mb-8 md:mb-0"
                            style={{ boxShadow: "2px 4px 8px #8888" }}
                        >
                            Quản Lí Dịch Vụ
                        </button>
                        <button
                            onClick={() => navigate("/employee/medicines")}
                            className="bg-[#ff6b35] text-white text-4xl rounded-2xl px-16 py-10 shadow-md border border-black hover:bg-[#e55a30] transition min-w-[420px]"
                            style={{ boxShadow: "2px 4px 8px #8888" }}
                        >
                            Quản Lý Thuốc
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-16 mb-8">
                        <button
                            onClick={() =>
                                navigate("/employee/service-options")
                            }
                            className="bg-[#8e44ad] text-white text-4xl rounded-2xl px-16 py-10 shadow-md border border-black hover:bg-[#732d8a] transition min-w-[420px] mb-8 md:mb-0"
                            style={{ boxShadow: "2px 4px 8px #8888" }}
                        >
                            Quản Lý Tùy Chọn Dịch Vụ
                        </button>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-16 mb-8">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-[#7bb12b] hover:bg-[#6aa11e] text-white px-8 py-2 rounded-lg border border-black transition font-medium"
                    >
                        Đăng xuất
                    </button>
                </div>
            </main>
        </div>
    );
}
