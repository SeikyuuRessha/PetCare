import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';
import ChoosePetComponent from '../../components/shared/ChoosePetComponent';
import PackageCard from '../../components/shared/PackageCard';
import BookedServiceCard from '../../components/shared/BookedServiceCard';

export default function ViewBookedServicesPage() {
  const navigate = useNavigate();

  // Mock data cho các dịch vụ đã đặt
  const bookedServices = [
    {
      pet: {
        id: '1',
        name: 'Shi',
        owner: 'Nguyễn Văn A',
        species: 'Chó',
        breed: 'Shiba',
        imageUrl: '/pet-avatar.png'
      },
      package: {
        title: "Dịch vụ tắm",
        description: "Gói Vàng",
        price: "$900",
        features: [
          "Tắm rửa sạch sẽ",
          "Sấy tạo kiểu lông sành điệu",
          "Dịch vụ Spa"
        ],
        type: "Pet Care" as const,
        serviceDetails: {
          date: "2024-01-20",
          time: "09:00",
          notes: "Yêu cầu sấy khô kỹ",
          totalAmount: "$950" // Tổng tiền sau thuế và phí
        }
      }
    },
    {
      pet: {
        id: '2',
        name: 'Miu',
        owner: 'Trần Thị B',
        species: 'Mèo',
        breed: 'Anh Lông Ngắn',
        imageUrl: '/pet-avatar.png'
      },
      package: {
        title: "Gửi thú cưng",
        description: "Dịch vụ trông giữ",
        price: "$10/ngày",
        features: ["Chăm sóc chu đáo", "Phòng riêng thoải mái"],
        type: "Pet Care" as const,
        serviceDetails: {
          startDate: "2024-01-20",
          endDate: "2024-01-25",
          room: "Phòng VIP",
          notes: "Cần cho ăn đúng giờ",
          totalAmount: "$80" // Tổng tiền cho 5 ngày + phí phòng VIP
        }
      }
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

      <main className="px-12 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Dịch vụ đã đặt</h1>
        
        <div className="space-y-8">
          {bookedServices.map((service, index) => (
            <BookedServiceCard
              key={index}
              pet={service.pet}
              service={service.package}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
