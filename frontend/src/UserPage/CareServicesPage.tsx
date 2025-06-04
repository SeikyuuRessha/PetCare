import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';


export default function CareServicesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleServiceClick = (path: string) => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate after scroll animation
    setTimeout(() => {
      navigate(path, { state: { from: location.pathname } });
    }, 500);
  };

  return (
    <div className="font-sans">
      <TopBar />
      <Header />

      {/* Banner + Info */}
      <section className="flex flex-col md:flex-row items-start px-8 pt-10 pb-4 relative">
        <div className="w-full md:w-[350px] h-[300px] bg-gray-400 rounded-lg mb-6 md:mb-0" />
        <div className="md:ml-10 flex-1">
          <h1 className="text-3xl font-bold mb-2">
            Về <span className="text-[#7bb12b]">Dịch vụ chăm sóc</span>
          </h1>
          <p className="text-gray-600 mb-2">
            Chúng tôi là dịch vụ chăm sóc tốt nhất giành cho thú cưng của bạn
          </p>
          <p className="text-gray-600">
            Các dịch vụ chất lượng cao đem đến sự hài lòng cho người bạn nhỏ
          </p>
        </div>
        {/* Contact Card */}
        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-12 top-[260px] md:top-16 bg-white shadow-lg rounded-lg flex w-[420px]">
          <div className="flex-1 flex flex-col items-center justify-center py-4 border-r">
            <div className="bg-gray-200 rounded-full p-2 mb-1">
              <img src="/phone-icon.png" alt="" className="h-6" />
            </div>
            <div className="text-xs text-gray-700">
              (+990) 12346678<br />
              (+990) 26746178
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4 border-r">
            <div className="bg-gray-200 rounded-full p-2 mb-1">
              <img src="/location-icon.png" alt="" className="h-6" />
            </div>
            <div className="text-xs text-gray-700 text-center">
              Melboard Road,<br />Hà Nội
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <div className="bg-gray-200 rounded-full p-2 mb-1">
              <img src="/mail-icon.png" alt="" className="h-6" />
            </div>
            <div className="text-xs text-gray-700 text-center">
              pethealthy@gmail.com<br />
              support@gmail.com
            </div>
          </div>
        </div>
      </section>

      {/* View Booked Services Button */}
      <div className="flex justify-center mt-32 mb-16">
        <button
          onClick={() => navigate('/services/booked')}
          className="bg-[#1797a6] text-white px-12 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-[#127c8a] transition-all hover:scale-105"
        >
          Xem các dịch vụ đã đặt
        </button>
      </div>

      {/* Services */}
      <section className="pb-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">Dịch vụ của chúng tôi</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Service Card - Tắm cho Pet */}
          <div className="bg-white rounded-lg shadow p-6 w-56 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-400 rounded-full mb-4" />
            <h3 className="font-bold mb-2">Tắm cho Pet</h3>
            <p className="text-xs text-gray-500 text-center mb-4">
              Amet minim mollit non des ullamco est sit aliqua dolor do amet sint.
            </p>
            <button 
              onClick={() => handleServiceClick('/services/bathing')}
              className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:text-teal-700 transition-colors"
            >
              Đặt Ngay <span className="text-xs">✱</span>
            </button>
          </div>

          {/* Service Card - Cắt tỉa lông */}
          <div className="bg-white rounded-lg shadow p-6 w-56 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-400 rounded-full mb-4" />
            <h3 className="font-bold mb-2">Cắt tỉa lông</h3>
            <p className="text-xs text-gray-500 text-center mb-4">
              Amet minim mollit non des ullamco est sit aliqua dolor do amet sint.
            </p>
            <button 
              onClick={() => handleServiceClick('/services/grooming')}
              className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:text-teal-700 transition-colors"
            >
              Đặt Ngay <span className="text-xs">✱</span>
            </button>
          </div>

          {/* Service Card - Gửi thú cưng */}
          <div className="bg-white rounded-lg shadow p-6 w-56 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-400 rounded-full mb-4" />
            <h3 className="font-bold mb-2">Gửi thú cưng</h3>
            <p className="text-xs text-gray-500 text-center mb-4">
              Amet minim mollit non des ullamco est sit aliqua dolor do amet sint.
            </p>
            <button 
              onClick={() => handleServiceClick('/services/boarding')}
              className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:text-teal-700 transition-colors"
            >
              Đặt Ngay <span className="text-xs">✱</span>
            </button>
          </div>

          {/* Service Card - Huấn luyện Pet */}
          <div className="bg-white rounded-lg shadow p-6 w-56 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-400 rounded-full mb-4" />
            <h3 className="font-bold mb-2">Huấn luyện Pet</h3>
            <p className="text-xs text-gray-500 text-center mb-4">
              Amet minim mollit non des ullamco est sit aliqua dolor do amet sint.
            </p>
            <button 
              onClick={() => handleServiceClick('/services/training')}
              className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:text-teal-700 transition-colors"
            >
              Đặt Ngay <span className="text-xs">✱</span>
            </button>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#f6f8f5] py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Đội ngũ chăm sóc</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-56 h-72 bg-gray-400 rounded-lg flex flex-col items-center justify-end pb-6 relative">
            <span className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white font-semibold">Nhân viên<br /><span className="text-xs font-normal">chuyên ngành</span></span>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
              <span className="w-2 h-2 bg-white rounded-full inline-block" />
              <span className="w-2 h-2 bg-gray-300 rounded-full inline-block" />
              <span className="w-2 h-2 bg-gray-300 rounded-full inline-block" />
            </div>
          </div>
          <div className="w-56 h-72 bg-gray-400 rounded-lg flex flex-col justify-end pb-6 relative">
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-xs">Condet Klo</span>
          </div>
          <div className="w-56 h-72 bg-gray-400 rounded-lg flex flex-col justify-end pb-6 relative">
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-xs">Alena Jion</span>
          </div>
          <div className="w-56 h-72 bg-gray-400 rounded-lg flex flex-col justify-end pb-6 relative">
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-xs">Marken Dia.</span>
          </div>
        </div>
      </section>

      {/* Pet Happy Section */}
      <section className="flex flex-col md:flex-row items-center px-8 py-16 bg-white">
        <div className="relative w-full md:w-[400px] h-[300px]">
          <div className="absolute left-0 top-8 w-[320px] h-[220px] bg-[#1797a6] rounded-lg" />
          <div className="absolute left-10 top-0 w-[320px] h-[220px] bg-gray-400 rounded-lg flex items-center justify-center">
            <div className="w-16 h-16 bg-[#1797a6] rounded-full" />
          </div>
        </div>
        <div className="md:ml-12 mt-8 md:mt-0 flex-1">
          <h2 className="text-2xl font-bold mb-4">Thú cưng của bạn sẽ hạnh phúc</h2>
          <p className="mb-4 text-gray-700">
            Dịch vụ tiên tiến đem lại cho thú cưng của bạn trải nghiệm tốt nhất khi sử dụng dịch vụ của chúng tôi.
          </p>
          <ul className="list-none space-y-2 text-gray-600 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full inline-block" />
              Hỗ trợ thanh toán online.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full inline-block" />
              Tư vấn lựa chọn dịch vụ phù hợp
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full inline-block" />
              Theo các gói combo đơn giản, giá rẻ
            </li>
          </ul>
          <button className="mt-6 text-black font-semibold flex items-center gap-1">
            Book Now <span className="text-xs">✱</span>
          </button>
        </div>
      </section>

     <Footer />
    </div>
  );
}
