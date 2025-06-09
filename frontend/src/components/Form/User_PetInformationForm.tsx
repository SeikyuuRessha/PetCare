import React, { useState } from 'react';

interface User_PetInformationFormProps {
  onClose?: () => void;
  onSubmit?: () => void;
  readOnly?: boolean; // Add this prop
  petData?: { // Add this prop
    id: string;
    owner: string;
    petName: string;
    species: string;
    breed: string;
    gender: 'Đực' | 'Cái';
    age: number;
    color: string;
    imageUrl: string;
  };
}

export default function User_PetInformationForm({
  onClose,
  onSubmit,
  readOnly = false, // Add default value
  petData, // Add to props
}: User_PetInformationFormProps) {
  const [gender, setGender] = useState<'Đực' | 'Cái'>(petData?.gender || 'Đực');
  const [petImage, setPetImage] = useState<File | null>(null);
  const [petImageUrl, setPetImageUrl] = useState<string | null>(petData?.imageUrl || null);

  const handlePetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPetImage(file);
    if (file) {
      setPetImageUrl(URL.createObjectURL(file));
    } else {
      setPetImageUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Hồ sơ thú cưng</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#fafafa] rounded-2xl border border-gray-300 p-6 max-w-4xl mx-auto shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div>
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-sm mb-1">
                  Tên thú cưng <span className="text-[#7bb12b]">*</span>
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  defaultValue={petData?.petName || ''}
                  readOnly={readOnly}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">
                  Loài động vật <span className="text-[#7bb12b]">*</span>
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  defaultValue={petData?.species || ''}
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Giống</label>
              <input
                className="w-full border rounded px-3 py-2"
                defaultValue={petData?.breed || ''}
                readOnly={readOnly}
              />
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
                    disabled={readOnly}
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
                    disabled={readOnly}
                  >
                    Cái
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">
                  Tuổi <span className="text-[#7bb12b]">*</span>
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  defaultValue={petData?.age.toString() || ''}
                  readOnly={readOnly}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">
                  Màu sắc lông <span className="text-[#7bb12b]">*</span>
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  defaultValue={petData?.color || ''}
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">
                Đặc điểm nhận dạng <span className="text-[#7bb12b]">*</span>
              </label>
              <input
                className="w-full border rounded px-3 py-2"
                defaultValue={petData?.id || ''}
                readOnly={readOnly}
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">
                Tên chủ nhân<span className="text-[#7bb12b]">*</span>
              </label>
              <input
                className="w-full border rounded px-3 py-2"
                defaultValue={petData?.owner || ''}
                readOnly={readOnly}
              />
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
              disabled={readOnly}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-[#7bb12b] text-white px-6 py-2 rounded-full hover:bg-[#6aa11e]"
            disabled={readOnly}
          >
            Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  );
}
