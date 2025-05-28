import React from 'react';

export default function AppointmentComponent() {
  return (
    <div className="bg-[#dbdbdb] rounded-[48px] px-12 py-8 flex flex-col justify-center w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[2rem] font-medium text-[#222]">
        <div className="space-y-6">
          <div className="flex items-center">
            <span className="mr-2">Lịch Khám :</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Tên chủ nhân :</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Trạng Thái :</span>
            <span className="bg-white border border-[#7bb12b] text-[#4d9900] font-bold rounded px-4 py-1 ml-2 text-[1.3rem] leading-none">
              Thành công
            </span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center">
            <span className="mr-2">Khung giờ khám :</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Tên thú cưng :</span>
          </div>
        </div>
      </div>
    </div>
  );
}
