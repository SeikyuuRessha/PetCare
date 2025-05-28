import React from 'react';

export default function ChoosePetComponent({ pet }: { pet?: any }) {
  return (
    <div className="bg-[#ededed] border border-gray-400 rounded-xl relative min-h-[260px] flex flex-col items-center justify-center" style={{ height: 260 }}>
      {/* Label */}
      <div className="absolute left-2 top-2 text-gray-400 text-sm select-none">ChoosePetInformation</div>
      {/* Content */}
      {pet ? (
        // ...render pet info here...
        <div>{/* ...existing code for showing pet... */}</div>
      ) : (
        <span className="text-gray-500 text-base mb-12">Chọn Pet cho dịch vụ của bạn ở đây </span>
      )}
      {/* Button */}
      <button
        type="button"
        className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#5d990f] transition absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        Chọn thú cưng
      </button>
    </div>
  );
}
