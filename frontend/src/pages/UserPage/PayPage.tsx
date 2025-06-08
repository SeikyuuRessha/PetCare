import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';

export default function PayPage() {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-white min-h-screen">
      <TopBar />
      <Header />

      {/* Main Content */}
      <main className="px-8 py-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mt-4">Thanh Toán</h1>
          <button 
            onClick={() => navigate('/services/booked')}
            className="bg-[#7bb12b] text-white px-8 py-2.5 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
          >
            Xem các dịch vụ đã đặt
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 mb-6">
            <thead>
              <tr className="text-left text-gray-700 border-b">
                <th className="font-semibold pb-3 pl-2"> </th>
                <th className="font-semibold pb-3">Dịch vụ</th>
                <th className="font-semibold pb-3">Gói ưu đãi</th>
                <th className="font-semibold pb-3">Giá</th>
                <th className="font-semibold pb-3">thú cưng</th>
                <th className="font-semibold pb-3">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr className="border-b">
                <td className="py-4 pl-2 align-middle">
                  <button className="text-gray-400 hover:text-red-500 text-lg font-bold">×</button>
                </td>
                <td className="py-4 flex items-center gap-3 min-w-[200px]">
                  <div className="w-10 h-10 bg-gray-400 rounded" />
                  <span className="font-semibold">Huấn luyện Pet</span>
                </td>
                <td className="py-4">Gói bạc</td>
                <td className="py-4">$35.00</td>
                <td className="py-4">Shi</td>
                <td className="py-4">$35.00</td>
              </tr>
              {/* Row 2 */}
              <tr className="border-b">
                <td className="py-4 pl-2 align-middle">
                  <button className="text-gray-400 hover:text-red-500 text-lg font-bold">×</button>
                </td>
                <td className="py-4 flex items-center gap-3 min-w-[200px]">
                  <div className="w-10 h-10 bg-gray-400 rounded" />
                  <span className="font-semibold">Tắm cho thú cưng</span>
                </td>
                <td className="py-4">Gói vàng</td>
                <td className="py-4">$25.00</td>
                <td className="py-4">John</td>
                <td className="py-4">$75.00</td>
              </tr>
              {/* Row 3 */}
              <tr>
                <td className="py-4 pl-2 align-middle">
                  <button className="text-gray-400 hover:text-red-500 text-lg font-bold">×</button>
                </td>
                <td className="py-4 flex items-center gap-3 min-w-[200px]">
                  <div className="w-10 h-10 bg-gray-400 rounded" />
                  <span className="font-semibold">Gửi thú cưng</span>
                </td>
                <td className="py-4">---</td>
                <td className="py-4">$110.50</td>
                <td className="py-4">Bánh bèo</td>
                <td className="py-4">$110.50</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center mb-8">
          <span className="text-lg font-semibold mr-2">Tổng :</span>
          <span className="text-[#1797a6] text-xl font-bold">$ 220.50</span>
        </div>
        <div className="flex justify-center gap-4">
          <button className="bg-[#1797a6] text-white px-8 py-2 rounded font-semibold text-lg shadow hover:bg-[#127c8a] transition">
            Thanh Toán
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
