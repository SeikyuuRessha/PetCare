import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

export default function CareServices_PetBathingPage() {
  const navigate = useNavigate();
  
    return (
      <div className="font-sans bg-white min-h-screen">
              <TopBar />
              <Header />
  
        {/* Back arrow */}
        <div 
          className="mt-8 ml-12 cursor-pointer" 
          onClick={() => navigate('/services')}
        >
          <svg width="60" height="32" viewBox="0 0 60 32" fill="none">
            <path d="M40 16H8M8 16L20 28M8 16L20 4" stroke="#7bb12b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

      {/* Bathing Section */}
      <section className="flex flex-col md:flex-row items-start px-12 mt-2 mb-8">
        <div className="flex-1 pt-4">
          <h1 className="text-4xl font-bold mb-2">Tắm cho thú cưng</h1>
          <p className="mb-4 text-gray-700 text-lg max-w-xl">
            Tắm rửa sạch sẽ cho thú cưng của bạn 1 cách thơm tho, hỗ trợ sấy tạo kiểu lông kiểu lông sành điệu.
          </p>
          <ul className="mb-4 space-y-2 text-base">
            <li className="flex items-center text-[#7bb12b]"><span className="mr-2">✔</span><span className="text-black">Sạch sẽ dù có bị lấm lem.</span></li>
            <li className="flex items-center text-[#7bb12b]"><span className="mr-2">✔</span><span className="text-black">Sấy lông tạo kiểu  điệu.</span></li>
            <li className="flex items-center text-[#7bb12b]"><span className="mr-2">✔</span><span className="text-black">Hỗ trợ các dịch vụ tắm cao cấp.</span></li>
          </ul>
          <a href="#" className="text-[#1797a6] font-semibold text-lg flex items-center gap-1 mb-4">
            Đọc thêm <span className="text-xl">✱</span>
          </a>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="relative w-[320px] h-[220px]">
            <div className="absolute left-16 top-0 w-[180px] h-[140px] bg-gray-300 rounded-lg" />
            <div className="absolute left-8 top-8 w-[180px] h-[140px] bg-gray-400 rounded-lg" />
            <div className="absolute left-0 top-16 w-[180px] h-[140px] bg-gray-500 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Combo Packages */}
      <section className="px-12 py-8">
        <h2 className="text-4xl font-bold text-center mb-8 text-[#7bb12b]">Gói Ưu Đãi</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Bronze */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 w-[320px] flex flex-col items-center">
            <span className="text-[#1797a6] text-sm mb-1">Pet Care</span>
            <h3 className="font-bold text-2xl mb-1">Gói Đồng</h3>
            <div className="text-gray-500 mb-2 text-sm">Gói rẻ nhất phúc lợi vẫn đầy đủ</div>
            <div className="text-[#ff3c00] text-2xl font-bold mb-2">$50</div>
            <div className="w-full border-t border-b border-gray-200 py-2 mb-2 text-center font-semibold">Bao gồm dịch vụ</div>
            <ul className="mb-8 space-y-2 text-base w-full">
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Tắm rửa sạch sẽ.</span>
              </li>
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Sấy tạo kiểu lông sành điệu.</span>
              </li>
            </ul>
            <button className="bg-[#1797a6] text-white px-8 py-2 rounded font-semibold text-lg shadow hover:bg-[#127c8a] transition mt-auto">
              Đặt ngay
            </button>
          </div>
          {/* Silver */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 w-[320px] flex flex-col items-center">
            <span className="text-[#1797a6] text-sm mb-1">Pet Care</span>
            <h3 className="font-bold text-2xl mb-1">Gói Bạc</h3>
            <div className="text-gray-500 mb-2 text-sm">Dịch vụ tắm trọn thêm nhiều ưu đãi</div>
            <div className="text-[#ff3c00] text-2xl font-bold mb-2">$450</div>
            <div className="w-full border-t border-b border-gray-200 py-2 mb-2 text-center font-semibold">Bao gồm dịch vụ</div>
            <ul className="mb-8 space-y-2 text-base w-full">
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Tắm rửa sạch sẽ.</span>
              </li>
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Sấy tạo kiểu lông sành điệu.</span>
              </li>
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Dịch vụ tư vấn sữa tắm cao cấp.</span>
              </li>
            </ul>
            <button className="bg-[#1797a6] text-white px-8 py-2 rounded font-semibold text-lg shadow hover:bg-[#127c8a] transition mt-auto">
              Đặt ngay
            </button>
          </div>
          {/* Gold */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 w-[320px] flex flex-col items-center">
            <span className="text-[#1797a6] text-sm mb-1">Pet Care & Veterinary</span>
            <h3 className="font-bold text-2xl mb-1">Gói Vàng</h3>
            <div className="text-gray-500 mb-2 text-sm">Dịch vụ Vip PRO</div>
            <div className="text-[#ff3c00] text-2xl font-bold mb-2">$900</div>
            <div className="w-full border-t border-b border-gray-200 py-2 mb-2 text-center font-semibold">Bao gồm dịch vụ</div>
            <ul className="mb-8 space-y-2 text-base w-full">
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Tắm rửa sạch sẽ.</span>
              </li>
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Sấy tạo kiểu lông sành điệu.</span>
              </li>
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Dịch vụ tư vấn sữa tắm cao cấp.</span>
              </li>
              <li className="flex items-center text-[#7bb12b]">
                <span className="mr-2">✔</span>
                <span className="text-black">Dịch vụ Spa khi tắm cho thú cưng--</span>
              </li>
            </ul>
            <button className="bg-[#1797a6] text-white px-8 py-2 rounded font-semibold text-lg shadow hover:bg-[#127c8a] transition mt-auto">
              Đặt ngay
            </button>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="px-12 py-12">
        <h2 className="text-3xl font-bold mb-8 text-[#7bb12b]"><span className="text-black">#</span>Instagram</h2>
        <div className="flex gap-8 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative w-40 h-40 bg-gray-300 rounded-lg flex items-end justify-center overflow-hidden border-b-4 border-[#1797a6]">
              <span className="absolute left-2 top-2 text-xs text-white">Thú cưng cùng chủ nhân đáng yêu!</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f7f5] px-0 pt-12 pb-0 text-sm mt-16">
        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto px-12">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <img src="/logo.png" alt="PetHealthy Logo" className="h-8" />
              <span className="font-bold text-[#7bb12b] text-2xl">PETHEALTHY</span>
            </div>
            <p className="text-gray-600 mt-2 max-w-xs">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            </p>
            <div className="flex items-center mt-4 gap-2">
              <img src="/hotline-icon.png" alt="" className="h-6" />
              <span className="text-[#1797a6] font-bold">(+990) 123456789</span>
            </div>
            <div className="w-20 h-20 bg-gray-400 rounded mt-8" />
          </div>
          <div className="flex space-x-16 mt-6 md:mt-0">
            <div>
              <h4 className="font-bold mb-2">Link</h4>
              <ul className="space-y-1">
                <li>About Us</li>
                <li>Pricing Plan</li>
                <li>Blogs</li>
                <li>Shop</li>
                <li>Gellary</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Legal</h4>
              <ul className="space-y-1">
                <li>Privacy Policy</li>
                <li>Terms of use</li>
                <li>Trems & conditions</li>
                <li>My Account</li>
                <li>Order List</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Contact Us</h4>
              <ul className="space-y-1">
                <li>Bellbron Road, New York</li>
                <li>Cell : 99001654789532</li>
                <li>E-mail : petology.us@gmail.com</li>
                <li className="flex space-x-2 mt-2">
                  <img src="/facebook-icon.png" alt="Facebook" className="h-4" />
                  <img src="/twitter-icon.png" alt="Twitter" className="h-4" />
                  <img src="/linkedin-icon.png" alt="LinkedIn" className="h-4" />
                  <img src="/youtube-icon.png" alt="YouTube" className="h-4" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-[#1797a6] text-white text-xs py-3 mt-12 flex justify-between px-12">
          <span>Copyright © 2022  Petology All Rights Reserved.</span>
          <span>
            Privacy & Terms
            <span className="mx-2">|</span>
            FAQ
          </span>
        </div>
      </footer>
    </div>
  );
}
