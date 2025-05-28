import React from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen">
      {/* Left side with image */}
      <div className="w-1/2 bg-teal-700 flex items-center justify-center">
        <div className="bg-white rounded-3xl overflow-hidden p-4">
          <img
            src="https://i.imgur.com/5Z6L8gB.jpg"
            alt="Happy Dog"
            className="w-80 h-80 object-cover rounded-3xl"
          />
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex flex-col items-center justify-center relative">
        <button onClick={() => navigate('/')} className="absolute top-4 right-4 text-red-500 text-xl">✕</button>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-sm text-black">Quay trở lại</button>

        <div className="flex flex-col items-center w-80">
          <div className="flex items-center mb-6">
            <img
              src="https://i.imgur.com/HWm9hA9.png"
              alt="PetHealthy Logo"
              className="w-12 h-12 mr-2"
            />
            <h1 className="text-3xl font-bold text-green-700">PETHEALTHY</h1>
          </div>

          <input
            type="text"
            placeholder="Tên người dùng"
            className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="w-full mb-4 px-4 py-2 border border-purple-400 rounded focus:outline-none"
          />

          <button className="w-full bg-purple-300 hover:bg-purple-400 text-white py-2 rounded mb-4">
            Đăng ký
          </button>

          <hr className="w-full border-t border-purple-400 mb-4" />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPageWithRouter() {
  return (
    <Router>
      <RegisterPage />
    </Router>
  );
}

/*
Fix:
- Đặt RegisterPage vào trong BrowserRouter để hook useNavigate hoạt động mà không lỗi.
- Export component bọc sẵn Router: RegisterPageWithRouter.
- Khi import vào app, chỉ cần dùng RegisterPageWithRouter.
*/
