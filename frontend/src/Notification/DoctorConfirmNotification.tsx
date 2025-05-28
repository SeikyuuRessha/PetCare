import React from 'react';

export default function DoctorConfirmNotification() {
  return (
    <div className="bg-[#dbdbdb] rounded-3xl px-8 py-8 flex flex-col items-center max-w-2xl mx-auto">
      <div className="text-4xl font-medium mb-8 text-center">Đồng ý nhận lịch khám</div>
      <div className="flex gap-12 w-full justify-center">
        <button
          className="bg-[#1797a6] text-white text-2xl font-normal rounded-xl px-16 py-4 shadow border border-black hover:bg-[#127c8a] transition"
        >
          Đồng ý
        </button>
        <button
          className="bg-[#d60000] text-white text-2xl font-normal rounded-xl px-16 py-4 shadow border border-black hover:bg-[#b30000] transition"
        >
          Từ chối
        </button>
      </div>
    </div>
  );
}
