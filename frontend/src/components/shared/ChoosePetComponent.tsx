import React, { useState } from 'react';
import PetComponent from './PetComponent';

interface Pet {
  id: string;
  name: string;
  owner: string;
  species: string;
  breed: string;
  imageUrl: string;
}

interface ChoosePetComponentProps {
  pet?: Pet;
  onSelectPet?: (selectedPet: Pet) => void;
  children?: React.ReactNode; // Add this line
}

export default function ChoosePetComponent({ 
  pet, 
  onSelectPet,
  children
}: ChoosePetComponentProps) {
  const [showPetList, setShowPetList] = useState(false);

  // Mock data for pets list
  const availablePets = [
    { 
      id: '1', 
      name: 'Shi', 
      owner: 'Nguyễn Văn A', 
      species: 'Chó', 
      breed: 'Shiba',
      imageUrl: '/pet-avatar.png'
    },
    { 
      id: '2', 
      name: 'Miu', 
      owner: 'Trần Thị B', 
      species: 'Mèo', 
      breed: 'Anh Lông Ngắn',
      imageUrl: '/pet-avatar.png'
    },
  ];

  return (
    <div className="w-full flex justify-center px-4">
      <div className="bg-[#ededed] border border-gray-400 rounded-xl p-8 w-full overflow-x-auto"
        style={{ minWidth: '1200px', maxWidth: '1400px' }}>
        <div className="flex flex-col md:flex-row gap-y-8 md:gap-x-16 justify-center">
          {/* Left Column - Pet Selection */}
          <div className="bg-white rounded-lg p-8 min-h-[450px] flex flex-col w-[450px] items-center justify-center shadow">
            <h3 className="text-lg font-semibold mb-8">Chọn thú cưng</h3>
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              {pet ? (
                <div className="w-full flex flex-col items-center mb-6">
                  <div className="w-[220px] h-[220px] flex items-center justify-center">
                    <PetComponent 
                      pet={pet}
                      onViewDetails={() => {}}
                      hideViewDetails={true}
                    />
                  </div>
                </div>
              ) : (
                <span className="text-gray-500 text-base mb-4 text-center w-full">Chọn Pet cho dịch vụ của bạn ở đây</span>
              )}

              <button
                type="button"
                className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#5d990f] transition mt-6"
                onClick={() => setShowPetList(true)}
              >
                Chọn thú cưng
              </button>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="flex-1 flex flex-col justify-between w-full md:w-[600px] pl-0 md:pl-12">
            {children ? (
              children
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Ngày sử dụng dịch vụ</label>
                    <input className="w-full border rounded px-2 py-1" type="date" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Chọn khung giờ</label>
                    <select className="w-full border rounded px-2 py-1">
                      <option value="">9:00</option>
                      <option value="standard">15:00</option>
                      <option value="vip">17:00</option>
                      <option value="luxury">19:00</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Ghi chú thêm</label>
                    <textarea
                      className="w-full border rounded px-2 py-1"
                      rows={3}
                      placeholder="Nhập yêu cầu đặc biệt của bạn..."
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-8">
                  <div className="text-gray-600">
                    <span className="font-medium text-base">
                      Tổng tiền: <span className="text-[#ff3c00] text-xl">$50</span>
                    </span>
                  </div>
                  <button className="bg-[#7bb12b] text-white px-12 py-2.5 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition min-w-[200px]">
                    Xác nhận đặt lịch
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pet Selection Modal */}
      {showPetList && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setShowPetList(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4 text-center">Danh sách thú cưng</h3>
            <div className="grid gap-4">
              {availablePets.map((availablePet) => (
                <div
                  key={availablePet.id}
                  className="cursor-pointer hover:bg-[#f3f7e7] rounded transition"
                  onClick={() => {
                    if (onSelectPet) {
                      onSelectPet(availablePet);
                    }
                    setShowPetList(false);
                  }}
                >
                  <PetComponent 
                    pet={availablePet}
                    onViewDetails={() => {}}
                    hideViewDetails={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
