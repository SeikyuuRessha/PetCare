import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { checkIsLoggedIn } from "../../utils/auth";
import Notification from "../Notification/Notification";

interface HeaderProps {
    className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => checkIsLoggedIn());
    const [showNotification, setShowNotification] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(checkIsLoggedIn());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setShowNotification(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const getLinkClassName = (path: string) => {
        const baseClass =
            "hover:text-[#1797a6] hover:border-b-2 hover:border-[#1797a6] pb-1 transition-all duration-200";
        const isActive =
            location.pathname === path ||
            (path === "/services" &&
                location.pathname.startsWith("/services/"));
        return isActive
            ? `text-[#1797a6] font-semibold border-b-2 border-[#1797a6] pb-1 ${baseClass}`
            : baseClass;
    };

    return (
        <header
            className={`flex justify-between items-center px-16 py-4 bg-transparent ${className}`}
        >
            <Link
                to="/"
                className="flex items-center space-x-3 pr-4 hover:opacity-80 transition-opacity"
            >
                <img
                    src="../public/images/Group.svg"
                    alt="PetHealthy Logo"
                    className="h-8"
                />
                <span className="font-bold text-[#7bb12b] text-2xl">
                    PETHEALTHY
                </span>
            </Link>{" "}
            <nav className="flex space-x-8 text-base font-medium items-center h-12">
                <Link to="/" className={getLinkClassName("/")}>
                    Trang chủ
                </Link>

                <Link to="/services" className={getLinkClassName("/services")}>
                    Dịch vụ chăm sóc
                </Link>

                {isLoggedIn && (
                    <>
                        <Link
                            to="/pet-info"
                            className={getLinkClassName("/pet-info")}
                        >
                            Thông tin thú cưng
                        </Link>
                        <Link
                            to="/appointment"
                            className={getLinkClassName("/appointment")}
                        >
                            Đặt lịch khám
                        </Link>{" "}
                        <Link
                            to="/payment"
                            className={getLinkClassName("/payment")}
                        >
                            Thanh toán
                        </Link>
                        <Link
                            to="/user/medical-history"
                            className={getLinkClassName(
                                "/user/medical-history"
                            )}
                        >
                            Lịch sử khám
                        </Link>
                    </>
                )}

                {isLoggedIn ? (
                    <div className="flex items-center gap-6 ml-4">
                        <div className="relative" ref={notificationRef}>
                            <img
                                className="w-[35px] h-[35px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                alt="Notification"
                                src="https://c.animaapp.com/C4UbZLbg/img/image-12@2x.png"
                                onClick={() =>
                                    setShowNotification(!showNotification)
                                }
                            />
                            {/* Notification Dropdown */}
                            {showNotification && (
                                <div className="absolute right-0 top-[42px] z-50">
                                    <Notification />
                                </div>
                            )}
                        </div>
                        <Link
                            to="/account"
                            className="hover:opacity-80 transition-opacity"
                        >
                            <div className="flex flex-col items-center gap-1">
                                <img
                                    alt="Account"
                                    src="https://c.animaapp.com/C4UbZLbg/img/kh-c.svg"
                                    className="w-6 h-6"
                                />
                                <div className="font-['Inter',Helvetica] text-sm text-[#0b0b0b]">
                                    Tài khoản
                                </div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="bg-[#1797a6] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#127c8a] transition-colors ml-4"
                    >
                        Đăng nhập
                    </Link>
                )}
            </nav>
        </header>
    );
}
