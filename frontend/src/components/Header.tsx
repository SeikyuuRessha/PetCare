import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { checkIsLoggedIn } from '../utils/auth';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => checkIsLoggedIn());
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(checkIsLoggedIn());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getLinkClassName = (path: string) => {
    const baseClass = 'hover:text-[#1797a6] hover:border-b-2 hover:border-[#1797a6] pb-1 transition-all';
    const isActive = location.pathname === path || 
                    (path === '/services' && location.pathname.startsWith('/services/'));
    return isActive
      ? `text-[#1797a6] font-semibold border-b-2 border-[#1797a6] pb-1 ${baseClass}`
      : baseClass;
  };

  return (
    <header className={`flex justify-between items-center px-16 pt-8 pb-0 bg-transparent ${className}`}>
      <div className="flex items-center space-x-2 pr-4">
        <img src="../public/images/Group.svg" alt="PetHealthy Logo" className="h-8" />
        <span className="font-bold text-[#7bb12b] text-2xl">PETHEALTHY</span>
      </div>
      <nav className="flex space-x-5 text-lg font-medium">
        <Link to="/" className={getLinkClassName('/')}>
          Trang chủ
        </Link>
        <Link to="/pet-info" className={getLinkClassName('/pet-info')}>
          Thông tin thú cưng
        </Link>
        <Link to="/services" className={getLinkClassName('/services')}>
          Dịch vụ chăm sóc
        </Link>
        <Link to="/appointment" className={getLinkClassName('/appointment')}>
          Đặt lịch khám
        </Link>
        <Link to="/payment" className={getLinkClassName('/payment')}>
          Thanh toán
        </Link>
        {isLoggedIn ? (
           <div className="flex items-center gap-4">
            <img
              className="w-[50px] h-[50px] object-cover"
              alt="Notification"
              src="https://c.animaapp.com/C4UbZLbg/img/image-12@2x.png"
            />
            <Link to="/account" className="hover:opacity-80 transition-opacity">
              <div className="flex flex-col items-center gap-[6.56px]">
                <img
                  alt="Account"
                  src="https://c.animaapp.com/C4UbZLbg/img/kh-c.svg"
                />
                <div className="font-['Inter',Helvetica] text-[15.7px] text-[#0b0b0b]">
                  Tài khoản
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-[#1797a6] text-white px-6 py-2 rounded-full font-semibold ml-4 hover:bg-[#127c8a] transition-colors"
          >
            Đăng nhập
          </Link>
        )}
      </nav>
    </header>
  );
}