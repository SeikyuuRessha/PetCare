import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';

import { checkIsLoggedIn } from '../../utils/auth';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(checkIsLoggedIn());
  }, []);

  return (
    <div className="font-sans bg-white min-h-screen relative">
      <TopBar className="relative z-50" />
      <Header className="relative z-50" />

      {/* Background Shapes Container */}
      <div className="absolute w-[569px] h-[663px] right-0 top-[150px]">
        <img
          className="absolute w-[139px] h-36 top-[88px] right-[408px]"
          alt="Vector"
          src="https://c.animaapp.com/VSoEJPH3/img/vector.svg"
        />
        <img
          className="absolute w-[296px] h-72 top-[300px] right-[300px]"
          alt="Ellipse"
          src="https://c.animaapp.com/VSoEJPH3/img/ellipse-27.svg"
        />
        <img
          className="absolute w-[509px] h-[768px] top-[-125px] right-0"
          alt="Frame"
          src="https://c.animaapp.com/VSoEJPH3/img/frame-1.svg"
        />
      </div>

      {/* Main Section */}
      <section className="relative z-10 flex flex-col md:flex-row items-center px-4 sm:px-8 md:px-12 lg:px-16 pt-8 pb-20 bg-transparent mb-40">
        <div className="flex-1 pt-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Sức khỏe <span className="text-[#7bb12b]">Pet Cưng</span>
          </h1>
          <p className="mb-6 sm:mb-8 max-w-md text-gray-700 text-base sm:text-lg">
            Chăm sóc thú cưng của bạn 1 cách tốt nhất, vì sức khỏe của người bạn nhỏ của bạn
          </p>
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/appointment')}
              className="bg-[#1797a6] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-[#127c8a] transition"
            >
              Đặt lịch khám ngay
            </button>
          ) : (
            <Link
              to="/register" // Thay đổi button thành Link và trỏ đến /register
              className="bg-[#1797a6] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-[#127c8a] transition"
            >
              Đăng ký
            </Link>
          )}
        </div>
        <div className="flex-1 flex justify-center md:justify-end items-center relative min-h-[200px] sm:min-h-[500px] mt-6 md:mt-0">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden"></div>

          {/* Main Puppy Image */}
          <img
            src="../public/images/image1.png"
            alt="Puppy"
            className="relative z-10 rounded-lg shadow-lg w-full max-w-[200px] sm:max-w-[300px] md:max-w-[320px] h-auto object-cover"
          />
        </div>
      </section>

      {/* Promotions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-4 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-24">
        <div className="bg-[#fffbe9] p-4 sm:p-6 rounded-xl flex items-center gap-7 sm:gap-10">
          <div>
            <h3 className="font-bold text-3xl sm:text-4xl mb-2">
              Giảm giá <span className="text-[#ffb800]">25%</span>
            </h3>
            <p className="text-2xl sm:text-3xl">cho mọi dịch vụ</p>
          </div>
          <img
            src="../public/images/image4.png"
            alt="Discount Dog"
            className="rounded-lg w-35 sm:w-42 h-30 sm:h-36 object-cover"
          />
        </div>
        <div className="bg-[#fffbe9] p-4 sm:p-6 rounded-xl flex items-center gap-4 sm:gap-6">
          <div>
            <h3 className="font-bold text-3xl sm:text-4xl mb-2">Chăm sóc thú cưng của bạn</h3>
          </div>
          <img
            src="../public/images/image3.png"
            alt="Cat Care"
            className="rounded-lg w-20 sm:w-28 h-30 sm:h-30 object-cover"
          />
        </div>
      </section>

      {/* Pet Home Section */}
      <section className="flex flex-col md:flex-row items-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 bg-white">
        <img
          src="../public/images/image2.png"
          alt="Pet Home"
          className="w-full max-w-[300px] sm:max-w-[420px] rounded-2xl object-cover"
        />
        <div className="md:ml-8 mt-6 md:mt-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ngôi nhà của Pet</h2>
          <p className="mb-4 text-gray-700 text-base sm:text-lg">
            Dịch vụ của chúng tôi luôn đem đến cho Pet cưng của bạn dịch vụ tốt nhất, tận tụy nhất
          </p>
          <ul className="list-decimal list-inside space-y-2 text-gray-700 text-sm sm:text-base mb-4">
            <li>Căn nhà rộng rãi cho các bạn Pet thỏa thích nô đùa</li>
            <li>Bác sĩ có chuyên môn cao, chăm sóc sức khỏe thú cưng tốt nhất</li>
            <li>Các dịch vụ tiên tiến.</li>
          </ul>
          <div className="flex flex-col sm:flex-row sm:space-x-8 mt-4 sm:mt-6">
            <span className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="inline-block w-5 h-5 bg-[#7bb12b] rounded text-white flex items-center justify-center">
                <svg width="16" height="16" fill="white">
                  <rect width="16" height="16" rx="3" />
                </svg>
              </span>
              <span className="font-semibold text-sm sm:text-base">Hỗ trợ 24/7</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="inline-block w-5 h-5 bg-[#7bb12b] rounded text-white flex items-center justify-center">
                <svg width="16" height="16" fill="white">
                  <rect width="16" height="16" rx="3" />
                </svg>
              </span>
              <span className="font-semibold text-sm sm:text-base">Pet là khách Vip</span>
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}