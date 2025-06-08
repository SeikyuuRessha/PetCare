import React, { useState } from 'react';
import User_PetInformationForm from '../Form/User_PetInformationForm';

interface PetInfoSectionProps {
  petId?: string;
}

export default function PetInfoSection({ petId }: PetInfoSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [petImage, setPetImage] = useState<string | null>(null);
  const [gender, setGender] = useState<'Đực' | 'Cái'>('Đực');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPetImage(imageUrl);
    }
  };

  return (
    <div className="bg-[#f3f3f3] rounded-xl p-8 shadow-lg">
      <section className="bg-white rounded-lg p-6">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Tên thú cưng</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Loài động vật <span className="text-green-700">*</span></label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Giống</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Giới tính</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setGender('Đực')} 
                    className={`px-5 py-1 rounded-full font-semibold text-sm shadow ${
                      gender === 'Đực' ? 'bg-[#7bb12b] text-white' : 'bg-white text-gray-700 border'
                    }`}
                  >
                    Đực
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGender('Cái')}
                    className={`px-5 py-1 rounded-full font-semibold text-sm shadow ${
                      gender === 'Cái' ? 'bg-[#7bb12b] text-white' : 'bg-white text-gray-700 border'
                    }`}
                  >
                    Cái
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Tuổi</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Màu sắc lông <span className="text-green-700">*</span></label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Kích thước</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Cân nặng</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Tình trạng sức khỏe</label>
                <input className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Lịch sử tiêm chủng</label>
              <textarea className="w-full border rounded px-3 py-2" rows={3}></textarea>
            </div>
            <div>
              <label className="block font-medium mb-1">Ghi chú thêm</label>
              <textarea className="w-full border rounded px-3 py-2" rows={3}></textarea>
            </div>
          </div>

          {/* Right column */}
          <div>
            <label className="block font-medium mb-1">Ảnh thú cưng</label>
            <div className="border rounded-lg p-4 bg-gray-50 min-h-[180px] flex flex-col items-center justify-center">
              {petImage ? (
                <div className="relative">
                  <img 
                    src={petImage} 
                    alt="Pet preview" 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setPetImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id={`pet-image-${petId}`}
                  />
                  <label
                    htmlFor={`pet-image-${petId}`}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl text-gray-500">+</span>
                    </div>
                    <span className="text-gray-500">Click để tải ảnh lên</span>
                  </label>
                </>
              )}
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                type="button" 
                className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
                onClick={() => setShowModal(true)}
              >
                Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        </form>

        {/* Prescription Table */}
        <div className="mt-8">
          <label className="block font-medium mb-2">Đơn thuốc <span className="text-green-700">*</span></label>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#7bb12b] text-white text-sm">
                  <th className="px-3 py-2 border-r border-white">STT</th>
                  <th className="px-3 py-2 border-r border-white">Tên thuốc</th>
                  <th className="px-3 py-2 border-r border-white">Thành phần</th>
                  <th className="px-3 py-2 border-r border-white">Cách dùng</th>
                  <th className="px-3 py-2 border-r border-white">Số ngày dùng</th>
                  <th className="px-3 py-2 border-r border-white">Ghi chú thêm</th>
                  <th className="px-3 py-2">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 text-center">
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2 font-semibold bg-white">Row</td>
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2">Data</td>
                  <td className="px-3 py-2">Data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Dialog */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              <User_PetInformationForm />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
