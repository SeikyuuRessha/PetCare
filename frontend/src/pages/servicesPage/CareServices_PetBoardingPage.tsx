import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';
import PackageCard from '../../components/shared/PackageCard';
import ChoosePetComponent from '../../components/shared/ChoosePetComponent';

// Component PetInfoCard với khung và màu sắc riêng biệt, nhận props cho thông tin
function PetInfoCard({
  petName = "Shi",
  ownerName = "Nguyễn Văn A",
  species = "Chó",
  breed = "Shiba",
  imageUrl = "../public/images/image1.png"
}) {
  return (
    <div className="flex items-center gap-6 mb-4 bg-[#eaf1ef] border-2 border-[#7bb12b] rounded-xl px-6 py-4 shadow">
      <div className="w-36 h-36 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden border-2 border-[#1797a6]">
        <img src={imageUrl} alt="Pet" className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-col gap-1 text-base">
        <span className="font-semibold text-lg text-[#1797a6]">Thú Cưng: <span className="text-black">{petName}</span></span>
        <span className="text-[#7bb12b]">Chủ Nhân: <span className="text-black">{ownerName}</span></span>
        <span className="text-[#7bb12b]">Loài: <span className="text-black">{species}</span></span>
        <span className="text-[#7bb12b]">Giống: <span className="text-black">{breed}</span></span>
      </div>
    </div>
  );
}

export default function CareServices_PetBoardingPage() {
  const navigate = useNavigate();
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const boardingPackage = {
    title: "Dịch vụ giữ Pet",
    description: "Chăm sóc thú cưng của bạn khi bạn đi xa",
    price: "200.000đ/ngày",
    features: [
      "Chăm thú cưng tử tế",
      "Chăm sóc chu đáo",
      "Phòng riêng thoải mái",
      "Thức ăn đầy đủ"
    ],
    type: "Pet Care" as const // Fix the type by adding 'as const'
  };

  const calculatePrice = (start: string, end: string) => {
    if (!start || !end) return;
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    const days = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 3600 * 24));
    const pricePerDay = 200000; // 200.000đ/ngày
    setTotalPrice(days * pricePerDay);
  };

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

      {/* Boarding Section */}
      <section className="flex flex-col md:flex-row items-start px-12 mt-2 mb-8">
        <div className="flex-1 pt-4">
          <h1 className="text-4xl font-bold mb-2">Gửi thú cưng</h1>
          <p className="mb-4 text-gray-700 text-base max-w-xl">
            Dịch vụ gửi thú cưng, giúp bạn yên tâm đi xa mà thú cưng của bạn vẫn được chăm sóc tốt nhất.
          </p>
          <ul className="mb-4 space-y-2 text-base">
            <li className="flex items-center text-[#7bb12b]">
              <span className="mr-2">✔</span>
              <span className="text-black">Phòng rộng lớn các bé thú cưng vui chơi.</span>
            </li>
            <li className="flex items-center text-[#7bb12b]">
              <span className="mr-2">✔</span>
              <span className="text-black">Nhân viên chăm sóc tận tụy.</span>
            </li>
            <li className="flex items-center text-[#7bb12b]">
              <span className="mr-2">✔</span>
              <span className="text-black">Thức ăn giàu chất dinh dưỡng.</span>
            </li>
          </ul>
          <a href="#" className="text-[#1797a6] font-semibold text-base flex items-center gap-1 mb-4">
            Đọc thêm <span className="text-xl">✱</span>
          </a>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="relative w-[340px] h-[220px]">
            <img 
              src="../public/images/board.jpg" 
              alt="Boarding 1"
              className="absolute left-24 top-0 w-[140px] h-[100px] object-cover rounded-lg"
            />
            <img 
              src="../public/images/board.jpg" 
              alt="Boarding 2"
              className="absolute left-12 top-8 w-[180px] h-[140px] object-cover rounded-lg"
            />
            <img 
              src="../public/images/board.jpg" 
              alt="Boarding 3"
              className="absolute left-0 top-16 w-[180px] h-[140px] object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Package Section */}
      <section className="px-12 py-8">
        <h2 className="text-4xl font-bold text-center mb-8 text-[#7bb12b]">Dịch Vụ Trông Giữ</h2>
        <div className="flex justify-center">
          <PackageCard
            {...boardingPackage}
            onBooking={() => setShowPetSelector(true)}
          />
        </div>
      </section>

      {/* Instagram Section */}
      <section className="px-12 py-12">
        <h2 className="text-3xl font-bold mb-8 text-[#7bb12b]"><span className="text-black">#</span>Instagram</h2>
        <div className="flex gap-8 justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="relative w-40 h-40 rounded-lg overflow-hidden border-b-4 border-[#1797a6]">
              <img 
                src={`../public/images/staff${i}.jpg`}
                alt={`Instagram post ${i}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute left-2 top-2 text-xs text-white">Thú cưng cùng chủ nhân đáng yêu!</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pet Selection Modal with Custom Booking Form */}
      {showPetSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPetSelector(false)}>
          <div className="max-w-xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <ChoosePetComponent 
              pet={selectedPet}
              onSelectPet={(pet) => setSelectedPet(pet)}
            >
              {/* Booking Form */}
              <div className="space-y-4 w-full">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Ngày gửi</label>
                    <input 
                      type="date" 
                      className="w-full border rounded px-2 py-1"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        calculatePrice(e.target.value, endDate);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Ngày đón về</label>
                    <input 
                      type="date" 
                      className="w-full border rounded px-2 py-1"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        calculatePrice(startDate, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Chọn Phòng</label>
                  <select className="w-full border rounded px-2 py-1">
                    <option value="standard">Phòng A </option>
                    <option value="vip">Phòng B </option>
                    <option value="luxury">Phòng C </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Ghi chú thêm</label>
                  <textarea
                    className="w-full border rounded px-2 py-1"
                    rows={3}
                    placeholder="Nhập yêu cầu đặc biệt của bạn..."
                  />
                </div>
              </div>
              {/* Price and Confirm Button */}
              <div className="flex justify-between items-center mt-8">
                <div className="text-gray-600">
                  <span className="font-medium">
                    Giá dịch vụ: <span className="text-[#1797a6]">200.000đ/ngày</span>
                  </span>
                  {totalPrice > 0 && (
                    <div className="mt-1">
                      <span className="font-medium">
                        Tổng tiền: <span className="text-[#ff3c00] text-xl">{totalPrice.toLocaleString()}đ</span>
                      </span>
                    </div>
                  )}
                </div>
                <button className="bg-[#7bb12b] text-white px-12 py-2.5 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition min-w-[200px]">
                  Xác nhận đặt lịch
                </button>
              </div>
            </ChoosePetComponent>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#f5f7f5] px-0 pt-12 pb-0 text-sm mt-16">
        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto px-12">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <img src="../public/images/logo.png" alt="PetHealthy Logo" className="h-8" />
              <span className="font-bold text-[#7bb12b] text-2xl">PETHEALTHY</span>
            </div>
            <p className="text-gray-600 mt-2 max-w-xs">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            </p>
            <div className="flex items-center mt-4 gap-2">
              <img src="../public/images/hotline.png" alt="Hotline" className="h-6" />
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
                  <img src="../public/images/facebook.png" alt="Facebook" className="h-4" />
                  <img src="../public/images/twitter.png" alt="Twitter" className="h-4" />
                  <img src="../public/images/linkedin.png" alt="LinkedIn" className="h-4" />
                  <img src="../public/images/youtube.png" alt="YouTube" className="h-4" />
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
