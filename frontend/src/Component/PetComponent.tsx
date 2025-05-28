import React from 'react';

export default function PetComponent() {
  return (
    <div className="bg-[#f3f8f7] border-2 border-[#8bc34a] rounded-xl p-6 flex items-center min-w-[380px] max-w-[420px]">
      <div>
        <img
          src="/pet-avatar.png"
          alt="Pet"
          className="w-32 h-32 object-cover rounded border-2 border-[#1cb0b8] bg-gray-300"
        />
      </div>
      <div className="ml-8 flex flex-col gap-1 text-base">
        <div>
          <span className="text-[#1797a6] font-semibold">Thú Cưng:</span>
          <span className="font-bold text-black ml-1">Shi</span>
        </div>
        <div>
          <span className="text-[#b2c800] font-semibold">Chủ Nhân:</span>
          <span className="text-black ml-1">Nguyễn Văn A</span>
        </div>
        <div>
          <span className="text-[#8bc34a] font-semibold">Loài:</span>
          <span className="text-black ml-1">Chó</span>
        </div>
        <div>
          <span className="text-[#b2c800] font-semibold">Giống:</span>
          <span className="text-black ml-1">Shiba</span>
        </div>
      </div>
    </div>
  );
}
