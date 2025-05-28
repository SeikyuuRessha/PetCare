import React from 'react';

import Header from '../components/Header';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

export default function PetInformationPage() {
  return (
    <div className="font-sans bg-white min-h-screen">
      <TopBar />
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-12 pt-2 pb-12">
        <h2 className="text-2xl font-bold mt-6 mb-6">Thông tin thú cưng</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Tên thú cưng</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Loài động vật <span className="text-green-700">*</span></label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Giống</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Giới tính</label>
                <div className="flex gap-2">
                  <button type="button" className="bg-[#7bb12b] text-white px-5 py-1 rounded-full font-semibold text-sm shadow">Đực</button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Tuổi</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Màu sắc lông <span className="text-green-700">*</span></label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Đặc điểm nhận dạng <span className="text-green-700">*</span></label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Tên chủ nhân<span className="text-green-700">*</span></label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Bác sĩ phụ trách</label>
              <input className="w-full border rounded px-3 py-2 bg-gray-100" disabled />
            </div>
            <div>
              <label className="block font-medium mb-1">Tình trạng sức khỏe thú cưng</label>
              <textarea className="w-full border rounded px-3 py-2 bg-gray-100" rows={3} placeholder="Notes about your order, e.g. special notes for delivery." />
            </div>
            <div>
              <label className="block font-medium mb-1">Lần khám gần nhất</label>
              <input className="w-full border rounded px-3 py-2 bg-gray-100" disabled />
            </div>
            <div>
              <label className="block font-medium mb-1">Chẩn đoán của bác sĩ</label>
              <textarea className="w-full border rounded px-3 py-2 bg-gray-100" rows={2} disabled />
            </div>
            <div>
              <label className="block font-medium mb-1">Cảnh báo của bác sĩ</label>
              <textarea className="w-full border rounded px-3 py-2 bg-gray-100" rows={2} disabled />
            </div>
          </div>
          {/* Right column */}
          <div>
            <label className="block font-medium mb-1">Ảnh thú cưng</label>
            <textarea className="w-full border rounded px-3 py-2 h-[180px]" />
            <div className="mt-8 flex justify-end">
              <button type="button" className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition">
                Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        </form>
        {/* Đơn thuốc */}
        <div className="mt-8">
          <label className="block font-medium mb-2">Đơn thuốc <span className="text-green-700">*</span></label>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#7bb12b] text-white text-sm">
                  <th className="px-3 py-2 border-r border-white">STT</th>
                  <th className="px-3 py-2 border-r border-white">Tên thuốc</th>
                  <th className="px-3 py-2 border-r border-white">Thành phần</th>
                  <th className="px-3 py-2 border-r border-white">Cách dùng</th>
                  <th className="px-3 py-2 border-r border-white">Số ngày dùng</th>
                  <th className="px-3 py-2 border-r border-white">Ghi chú thêm</th>
                  <th className="px-3 py-2">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 text-center">
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2 font-semibold bg-white">Row</td>
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2">Data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Thêm hồ sơ thú cưng */}
        <div className="mt-8">
          <button type="button" className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition">
            Thêm hồ sơ thú cưng
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
