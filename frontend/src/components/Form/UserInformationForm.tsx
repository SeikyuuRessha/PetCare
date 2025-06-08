import React, { useState } from 'react';

export default function UserInformationForm() {
  const [gender, setGender] = useState<'Nữ' | 'Nam'>('Nữ');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    } else {
      setAvatarUrl(null);
    }
  };

  return (
    <form className="bg-[#ededed] rounded-2xl border border-black p-6 max-w-5xl mx-auto shadow-md" style={{ minHeight: 600 }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left + Middle columns */}
        <div className="md:col-span-2">
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-base mb-1">
                Tên tài khoản <span className="text-[#7bb12b]">*</span>
              </label>
              <input className="w-full border rounded px-3 py-2 text-base" />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-base mb-1">
                Giới tính <span className="text-[#7bb12b]">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`w-full py-2 rounded-lg font-semibold text-base transition ${
                    gender === 'Nữ'
                      ? 'bg-[#27d11a] text-white shadow'
                      : 'bg-white text-black border border-gray-300'
                  }`}
                  onClick={() => setGender('Nữ')}
                >
                  Nữ
                </button>
                <button
                  type="button"
                  className={`w-full py-2 rounded-lg font-semibold text-base transition ${
                    gender === 'Nam'
                      ? 'bg-[#27d11a] text-white shadow'
                      : 'bg-white text-black border border-gray-300'
                  }`}
                  onClick={() => setGender('Nam')}
                >
                  Nam
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-base mb-1">
                Tên đầy đủ <span className="text-[#7bb12b]">*</span>
              </label>
              <input className="w-full border rounded px-3 py-2 text-base" />
            </div>
            <div className="flex-1">
              <label className="block text-base mb-1">
                Ngày sinh <span className="text-[#7bb12b]">*</span>
              </label>
              <input className="w-full border rounded px-3 py-2 text-base" />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-base mb-1">
              Số điện thoại <span className="text-[#7bb12b]">*</span>
            </label>
            <input className="w-full border rounded px-3 py-2 text-base" />
          </div>
          <div className="mb-2">
            <label className="block text-base mb-1">
              Email <span className="text-[#7bb12b]">*</span>
            </label>
            <input className="w-full border rounded px-3 py-2 text-base" />
          </div>
          <div className="mb-2">
            <label className="block text-base mb-1">Địa chỉ thường trú</label>
            <input className="w-full border rounded px-3 py-2 text-base" />
          </div>
        </div>
        {/* Right column */}
        <div>
          <label className="block text-base mb-1">Ảnh đại diện</label>
          {avatarUrl && (
            <div className="mb-2 flex justify-center">
              <img src={avatarUrl} alt="Avatar" className="w-32 h-32 object-cover rounded-full border border-gray-400" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="mb-2"
            onChange={handleAvatarChange}
          />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="bg-[#5d990f] text-white px-10 py-3 rounded-full font-semibold text-lg shadow hover:bg-[#7bb12b] transition"
          style={{ boxShadow: '2px 4px 8px #8888' }}
        >
          Lưu thông tin
        </button>
      </div>
    </form>
  );
}
