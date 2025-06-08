import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';
import ChoosePetComponent from '../../components/shared/ChoosePetComponent';
import PackageCard from '../../components/shared/PackageCard';

export default function CareServices_PetTrainingPage() {
  const navigate = useNavigate();
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null); // Thêm state này

  const packages = [
    {
      title: "Gói Đồng",
      description: "Gói rẻ nhất phúc lợi vẫn đầy đủ",
      price: "$50",
      features: [
        "Dạy cho thú cưng vệ sinh đúng chỗ.",
        "Dạy nghe hiệu tên, bắt tay."
      ]
    },
    {
      title: "Gói Bạc",
      description: "Chuyên gia kinh nghiệm",
      price: "$450",
      features: [
        "Dạy cho thú cưng vệ sinh đúng chỗ.",
        "Dạy nghe hiệu tên, bắt tay.",
        "Huấn luyện ném đĩa, bóng."
      ]
    },
    {
      title: "Gói Vàng",
      description: "Huấn luyện đỉnh cao",
      price: "$900",
      features: [
        "Dạy cho thú cưng vệ sinh đúng chỗ.",
        "Dạy nghe hiệu tên, bắt tay.",
        "Huấn luyện ném đĩa, bóng.",
        "Huấn luyện nâng cao phối hợp"
      ]
    }
  ];

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

      {/* Pet Training Section */}
      <section className="flex flex-col md:flex-row items-start px-12 mt-2 mb-8">
        <div className="flex-1 pt-4">
          <h1 className="text-4xl font-bold mb-2">Huấn luyện Pet</h1>
          <p className="mb-4 text-gray-700 text-lg max-w-xl">
            Huấn luyện thú cưng của bạn từ cơ bản đến nâng cao, giúp thú cưng của bạn vâng lời hơn.
          </p>
          <ul className="mb-4 space-y-2 text-base">
            <li className="flex items-center text-[#7bb12b]"><span className="mr-2">✔</span><span className="text-black">Huấn luyện đi vệ sinh đúng chỗ.</span></li>
            <li className="flex items-center text-[#7bb12b]"><span className="mr-2">✔</span><span className="text-black">Huấn luyện nhận dạng các cử chỉ của chủ nhân.</span></li>
            <li className="flex items-center text-[#7bb12b]"><span className="mr-2">✔</span><span className="text-black">Diễn trò cùng chủ nhân.</span></li>
          </ul>
          <a href="#" className="text-[#1797a6] font-semibold text-lg flex items-center gap-1">
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
          {packages.map((pkg, index) => (
            <PackageCard
              key={index}
              {...pkg}
              onBooking={() => setShowPetSelector(true)}
              type={pkg.title === "Gói Vàng" ? "Pet Care & Veterinary" : "Pet Care"}
            />
          ))}
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

      {/* Pet Selection Modal */}
      {showPetSelector && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPetSelector(false)}
        >
          <div 
            className="max-w-xl w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <ChoosePetComponent 
              pet={selectedPet}
              onSelectPet={(pet) => setSelectedPet(pet)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
