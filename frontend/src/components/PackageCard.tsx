import React from 'react';

interface PackageCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  type?: 'Pet Care' | 'Pet Care & Veterinary';
  onBooking: () => void;
}

export default function PackageCard({
  title,
  description,
  price,
  features,
  type = 'Pet Care',
  onBooking
}: PackageCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 w-[320px] flex flex-col items-center">
      <span className="text-[#1797a6] text-sm mb-1">{type}</span>
      <h3 className="font-bold text-2xl mb-1">{title}</h3>
      <div className="text-gray-500 mb-2 text-sm">{description}</div>
      <div className="text-[#ff3c00] text-2xl font-bold mb-2">{price}</div>
      
      <div className="w-full border-t border-b border-gray-200 py-2 mb-2 text-center font-semibold">
        Bao gồm dịch vụ
      </div>
      
      <ul className="mb-8 space-y-2 text-base w-full">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-[#7bb12b]">
            <span className="mr-2">✔</span>
            <span className="text-black">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={onBooking}
        className="bg-[#1797a6] text-white px-8 py-2 rounded font-semibold text-lg shadow hover:bg-[#127c8a] transition mt-auto"
      >
        Đặt ngay
      </button>
    </div>
  );
}
