import React from 'react';

interface AppointmentData {
  id: string;
  ownerName: string;
  phone: string;
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    owner: string;
    imageUrl: string;
  };
  email: string;
  address: string;
  date: string;
  time: string;
  symptoms: string;
  status: 'pending' | 'success' | 'rejected';
}

interface AppointmentCardProps {
  appointment: AppointmentData;
  onDelete?: () => void;
  onClick?: () => void;
  isUserView?: boolean;
}

export default function AppointmentCard({ 
  appointment, 
  onDelete, 
  onClick,
  isUserView = false 
}: AppointmentCardProps) {
  console.log('Rendering AppointmentCard with data:', appointment);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Đang chờ duyệt',
          className: 'border-yellow-500 text-yellow-500'
        };
      case 'success':
        return {
          text: 'Thành công',
          className: 'border-[#7bb12b] text-[#7bb12b]'
        };
      case 'rejected':
        return {
          text: 'Từ chối',
          className: 'border-red-500 text-red-500'
        };
      default:
        return {
          text: 'Không xác định',
          className: 'border-gray-500 text-gray-500'
        };
    }
  };

  const status = getStatusDisplay(appointment.status);

  return (
    <div 
      className="bg-[#e5e5e5] rounded-2xl px-8 py-6 max-w-3xl mb-8 cursor-pointer hover:bg-[#e0e0e0] transition"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row md:gap-16 gap-2">
        <div className="flex-1 space-y-3">
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Lịch Khám:</span>
            <span className="font-bold text-lg text-black">{appointment.date}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Tên chủ nhân:</span>
            <span className="font-bold text-lg text-black">{appointment.ownerName}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Số điện thoại:</span>
            <span className="font-bold text-lg text-black">{appointment.phone}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Trạng Thái:</span>
            <span className={`bg-white border ${status.className} font-semibold rounded px-2 py-0.5 ml-2 text-base`}>
              {status.text}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Khung giờ khám:</span>
            <span className="font-bold text-lg text-black">{appointment.time}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Tên thú cưng:</span>
            <span className="font-bold text-lg text-black">{appointment.pet.name}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Loài:</span>
            <span className="font-bold text-lg text-black">{appointment.pet.species}</span>
          </div>
          {isUserView && onDelete && (
            <div className="mt-6">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
              >
                Xóa Lịch Khám
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
