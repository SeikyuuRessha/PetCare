import React from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { logout } from '../utils/auth';

export default function UserInformationPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Xóa trạng thái đăng nhập
    navigate('/login'); // Chuyển về trang đăng nhập
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <TopBar />
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-12 pt-2 pb-12">
        <h2 className="text-2xl font-bold mt-6 mb-6">Thông tin tài khoản</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Tên tài khoản</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Giới tính <span className="text-green-700">*</span></label>
                <div className="flex gap-2">
                  <button type="button" className="bg-[#7bb12b] text-white px-8 py-1 rounded-full font-semibold text-sm shadow">Nữ</button>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Tên đầy đủ <span className="text-green-700">*</span></label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Ngày sinh <span className="text-green-700">*</span></label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Số điện thoại <span className="text-green-700">*</span></label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Email <span className="text-green-700">*</span></label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Địa chỉ thường trú</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Thú cưng <span className="text-green-700">*</span></label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          {/* Right column */}
          <div>
            <label className="block font-medium mb-1">Ảnh đại diện</label>
            <textarea className="w-full border rounded px-3 py-2 h-[180px]" />
          </div>
        </form>
        {/* Table */}
        <div className="mt-8">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#7bb12b] text-white text-sm">
                <th className="px-3 py-2 border-r border-white">STT</th>
                <th className="px-3 py-2 border-r border-white">Tên thú cưng</th>
                <th className="px-3 py-2 border-r border-white">Giới tính</th>
                <th className="px-3 py-2 border-r border-white">Giống loài</th>
                <th className="px-3 py-2 border-r border-white">Loại động vật</th>
                <th className="px-3 py-2">Tuổi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white text-center">
                <td className="px-3 py-2">Data</td>
                <td className="px-3 py-2 font-semibold bg-white">Row</td>
                <td className="px-3 py-2">Data</td>
                <td className="px-3 py-2">Data</td>
                <td className="px-3 py-2">Data</td>
                <td className="px-3 py-2">Data</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Buttons */}
        <div className="mt-8 flex gap-6">
          <button 
            type="button" 
            onClick={handleLogout}
            className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
          >
            Đăng xuất
          </button>
          <button 
            type="button" 
            className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
