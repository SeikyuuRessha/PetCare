import React from 'react';

interface AppointmentCardProps {
  onDelete: () => void;
}

export default function AppointmentCard({ onDelete }: AppointmentCardProps) {
  return (
    <div className="bg-[#e5e5e5] rounded-2xl px-8 py-6 max-w-3xl mb-8">
      <div className="flex flex-col md:flex-row md:gap-16 gap-2">
        <div className="flex-1 space-y-3">
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Lịch Khám :</span>
            <span className="font-bold text-lg text-black"></span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Tên chủ nhân :</span>
            <span className="font-bold text-lg text-black"></span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Trạng Thái :</span>
            <span className="bg-white border border-[#7bb12b] text-[#7bb12b] font-semibold rounded px-2 py-0.5 ml-2 text-base">
              Thành công
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Khung giờ khám :</span>
            <span className="font-bold text-lg text-black"></span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">Tên thú cưng :</span>
            <span className="font-bold text-lg text-black"></span>
          </div>
          <div className="mt-6">
            <button 
              onClick={onDelete}
              className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
            >
              Xóa Lịch Khám
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
