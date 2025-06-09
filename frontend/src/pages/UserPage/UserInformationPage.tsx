import React, { useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';
import { logout } from '../../utils/auth';
import UserInformationForm from '../../components/Form/UserInformationForm';

export default function UserInformationPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const handleLogout = () => {
    logout(); // Xóa trạng thái đăng nhập
    navigate('/login'); // Chuyển về trang đăng nhập
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarImage(imageUrl);
    }
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
            <div className="border rounded-lg p-4 bg-gray-50 min-h-[180px] flex flex-col items-center justify-center">
              {avatarImage ? (
                <div className="relative">
                  <img 
                    src={avatarImage} 
                    alt="Avatar preview" 
                    className="w-32 h-32 object-cover rounded-full border-2 border-[#7bb12b]"
                  />
                  <button
                    type="button"
                    onClick={() => setAvatarImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-image"
                  />
                  <label
                    htmlFor="avatar-image"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl text-gray-500">+</span>
                    </div>
                    <span className="text-gray-500">Click để tải ảnh lên</span>
                  </label>
                </>
              )}
            </div>
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
            onClick={() => setShowModal(true)}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </main>

      {/* Modal Dialog */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white p-6 rounded-2xl w-full max-w-5xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <UserInformationForm />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
