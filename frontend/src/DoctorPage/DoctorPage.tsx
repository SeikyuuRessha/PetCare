import React from 'react';

export default function DoctorPage() {
  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Top green bar */}
      <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-8 py-1">
        <span>Welcome To Our Pet Store</span>
        <span>
          <span className="mr-4">Currency: $USD</span>
          <span>|</span>
          <span className="ml-4">Account <span className="align-super text-[10px]">▼</span></span>
        </span>
      </div>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center py-12 px-4">
        <div className="flex flex-col md:flex-row items-start justify-center gap-16 w-full max-w-5xl mt-8">
          {/* Doctor Image */}
          <div className="flex-shrink-0">
            <div className="rounded-[32px] border-2 border-black overflow-hidden w-[350px] h-[350px] flex items-center justify-center bg-white">
              <img
                src="/doctor-doraemon.jpg"
                alt="Doctor"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          {/* Doctor Info */}
          <div className="bg-[#ededed] border border-black rounded-lg px-10 py-8 min-w-[400px]">
            <h2 className="text-3xl font-semibold mb-6">Bác Sĩ : Trịnh Minh Đạt</h2>
            <div className="space-y-3 text-lg">
              <div className="flex">
                <span className="w-40 font-medium">Chuyên Khoa :</span>
                <span>Chuyên gia về bệnh lý động vật</span>
              </div>
              <div className="flex">
                <span className="w-40 font-medium">Bằng cấp :</span>
                <span>Thạc sĩ Thú y</span>
              </div>
              <div className="flex">
                <span className="w-40 font-medium">Kinh nghiệm :</span>
                <span>6 năm</span>
              </div>
              <div className="flex">
                <span className="w-40 font-medium">Giờ làm việc :</span>
                <span>8h  -  17h ( Thứ 2-Thứ 6)</span>
              </div>
              <div className="flex">
                <span className="w-40 font-medium">Số điện thoại :</span>
                <span>0999999999</span>
              </div>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-12 mt-16 w-full max-w-4xl justify-center">
          <button className="bg-[#7bb12b] text-white text-2xl font-semibold rounded-xl px-16 py-5 shadow-md border border-black hover:bg-[#6aa11e] transition">
            TRANG BỆNH ÁN
          </button>
          <button className="bg-[#1797a6] text-white text-2xl font-semibold rounded-xl px-16 py-5 shadow-md border border-black hover:bg-[#127c8a] transition">
            TRANG LỊCH KHÁM
          </button>
        </div>
      </main>
    </div>
  );
}
