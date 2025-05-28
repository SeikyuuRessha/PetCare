import React, { useState } from 'react';

export default function User_PetInformationForm() {
  const [gender, setGender] = useState<'Đực' | 'Cái'>('Đực');
  const [petImage, setPetImage] = useState<File | null>(null);
  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);

  const handlePetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPetImage(file);
    if (file) {
      setPetImageUrl(URL.createObjectURL(file));
    } else {
      setPetImageUrl(null);
    }
  };

  return (
    <form className="bg-[#fafafa] rounded-2xl border border-gray-300 p-6 max-w-4xl mx-auto shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column */}
        <div>
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">
                Tên thú cưng <span className="text-[#7bb12b]">*</span>
              </label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">
                Loài động vật <span className="text-[#7bb12b]">*</span>
              </label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">Giống</label>
            <input className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">
                Giới tính <span className="text-[#7bb12b]">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-6 py-1 rounded-full font-semibold text-base border ${
                    gender === 'Đực'
                      ? 'bg-[#27d11a] text-white shadow'
                      : 'bg-white text-black border-gray-300'
                  }`}
                  onClick={() => setGender('Đực')}
                >
                  Đực
                </button>
                <button
                  type="button"
                  className={`px-6 py-1 rounded-full font-semibold text-base border ${
                    gender === 'Cái'
                      ? 'bg-[#27d11a] text-white shadow'
                      : 'bg-white text-black border-gray-300'
                  }`}
                  onClick={() => setGender('Cái')}
                >
                  Cái
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">
                Tuổi <span className="text-[#7bb12b]">*</span>
              </label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">
                Màu sắc lông <span className="text-[#7bb12b]">*</span>
              </label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">
              Đặc điểm nhận dạng <span className="text-[#7bb12b]">*</span>
            </label>
            <input className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">
              Tên chủ nhân<span className="text-[#7bb12b]">*</span>
            </label>
            <input className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col h-full">
          <label className="block text-sm mb-1">Ảnh thú cưng</label>
          {petImageUrl && (
            <div className="mb-2 flex justify-center">
              <img
                src={petImageUrl}
                alt="Pet"
                className="w-32 h-32 object-cover rounded-lg border border-gray-400"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="mb-2"
            onChange={handlePetImageChange}
          />
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-[#5d990f] text-white px-12 py-3 rounded-full font-semibold text-lg shadow hover:bg-[#7bb12b] transition"
            >
              Lưu thông tin
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
