import React from 'react';

export default function DoctorMedicalRecordPage() {
  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Top green bar */}
      <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-0 md:px-8 py-1">
        <span className="ml-4">Welcome To Our Pet Store</span>
        <span className="flex items-center gap-2 mr-4">
          <span>Currency: $USD</span>
          <span>|</span>
          <span>Account <span className="align-super text-[10px]">▼</span></span>
        </span>
      </div>
      {/* Back arrow */}
      <div className="mt-8 ml-8">
        <svg width="60" height="32" viewBox="0 0 60 32" fill="none">
          <path d="M40 16H8M8 16L20 28M8 16L20 4" stroke="#7bb12b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* Title */}
      <div className="flex justify-center mt-2 mb-8">
        <div className="bg-[#7bb12b] text-white text-3xl font-normal rounded-xl px-16 py-4 shadow border border-black">
          TRANG BỆNH ÁN
        </div>
      </div>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4">
        <div className="flex items-stretch w-full max-w-5xl mt-4">
          {/* Pet image */}
          <div className="flex-shrink-0">
            <div className="rounded-lg border-2 border-black overflow-hidden w-[180px] h-[180px] bg-white flex items-center justify-center">
              <img
                src="/doctor-doraemon.jpg"
                alt="Pet"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          {/* Info box */}
          <div className="flex-1 bg-[#e5e5e5] border border-black rounded-r-lg rounded-l-none px-8 py-8 flex flex-col justify-center shadow -ml-1">
            <div className="text-2xl font-normal leading-relaxed space-y-2">
              <div>Thú Cưng :</div>
              <div>Tên Chủ Nhân :</div>
              <div>Loài Động Vật :</div>
              <div>Giống:</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
