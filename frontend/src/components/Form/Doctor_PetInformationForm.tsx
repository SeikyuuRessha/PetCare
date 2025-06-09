import React, { useState } from 'react';

interface DoctorPetInformationFormProps {
  pet: {
    id: string;
    name: string;
    owner: string;
    species: string;
    breed: string;
    imageUrl: string;
  };
  onClose: () => void;
}

export default function Doctor_PetInformationForm({
  pet,
  onClose
}: DoctorPetInformationFormProps) {
  const [gender] = useState<'Đực' | 'Cái'>('Đực');
  const [health, setHealth] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [warning, setWarning] = useState('');
  const [lastExam, setLastExam] = useState('');
  const [nextExam, setNextExam] = useState('');
  const [prescriptions, setPrescriptions] = useState([
    { name: '', ingredient: '', usage: '', days: '', note: '', quantity: '' }
  ]);

  const handlePrescriptionChange = (idx: number, field: string, value: string) => {
    setPrescriptions(prescriptions =>
      prescriptions.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { name: '', ingredient: '', usage: '', days: '', note: '', quantity: '' }]);
  };

  const removePrescription = (idx: number) => {
    setPrescriptions(prescriptions => prescriptions.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[90vw]">
          <form className="bg-white rounded-2xl border border-gray-300 p-6 w-full mx-auto shadow-md max-h-[85vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div>
                <div className="flex gap-4 mb-2">
                  <div className="flex-1">
                    <label className="block text-sm mb-1 font-semibold text-black">
                      Tên thú cưng <span className="text-[#7bb12b]">*</span>
                    </label>
                    <input className="w-full border rounded px-3 py-2 bg-gray-200 font-bold" value="Shi" disabled />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1 font-semibold text-black">
                      Loài động vật <span className="text-[#7bb12b]">*</span>
                    </label>
                    <input className="w-full border rounded px-3 py-2 bg-gray-200 font-bold" value="Chó" disabled />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1 font-semibold text-black">Giống</label>
                  <input className="w-full border rounded px-3 py-2 bg-gray-200 font-bold" value="Shiba" disabled />
                </div>
                <div className="flex gap-4 mb-2">
                  <div className="flex-1">
                    <label className="block text-sm mb-1 font-semibold text-black">
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
                        disabled
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
                        disabled
                      >
                        Cái
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1 font-semibold text-black">
                      Năm sinh <span className="text-[#7bb12b]">*</span>
                    </label>
                    <input className="w-full border rounded px-3 py-2 bg-gray-200 font-bold" value="2022" disabled />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1 font-semibold text-black">
                      Màu sắc lông <span className="text-[#7bb12b]">*</span>
                    </label>
                    <input className="w-full border rounded px-3 py-2 bg-gray-200 font-bold" value="Nâu" disabled />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1 font-semibold text-black">
                    Đặc điểm nhận dạng <span className="text-[#7bb12b]">*</span>
                  </label>
                  <input className="w-full border rounded px-3 py-2 bg-gray-200 font-bold" value="Đuôi cong" disabled />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1 font-semibold text-black">
                    Tên chủ nhân<span className="text-[#7bb12b]">*</span>
                  </label>
                  <input className="w-full border rounded px-3 py-2 bg-gray-200 font-bold" value="Nguyễn Văn A" disabled />
                </div>
                {/* Editable fields */}
                <div className="mb-2">
                  <label className="block text-sm mb-1">Tình trạng sức khỏe thú cưng</label>
                  <textarea
                    className="w-full border rounded px-3 py-2 bg-white"
                    rows={3}
                    value={health}
                    onChange={e => setHealth(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Lần khám gần nhất</label>
                  <input
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={lastExam}
                    onChange={e => setLastExam(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Chẩn đoán của bác sĩ</label>
                  <textarea
                    className="w-full border rounded px-3 py-2 bg-white"
                    rows={2}
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Cảnh báo của bác sĩ</label>
                  <textarea
                    className="w-full border rounded px-3 py-2 bg-white"
                    rows={2}
                    value={warning}
                    onChange={e => setWarning(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Lịch tái khám (Nếu có)</label>
                  <input
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={nextExam}
                    onChange={e => setNextExam(e.target.value)}
                  />
                </div>
              </div>
              {/* Right column */}
              <div className="flex flex-col h-full">
                <label className="block text-sm mb-1">Ảnh thú cưng</label>
                <div className="w-full border rounded px-3 py-2 min-h-[200px] flex-1">
                  <img 
                    src="../public/images/image3.png" 
                    alt="Pet" 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    className="bg-[#7bb12b] text-white px-12 py-3 rounded-full font-semibold text-lg shadow hover:bg-[#5d990f] transition"
                    disabled
                  >
                    Lưu thông tin
                  </button>
                </div>
              </div>
            </div>
            {/* Prescription Table */}
            <div className="mt-8 w-full overflow-x-auto">
              <label className="block font-medium mb-2">Đơn thuốc <span className="text-green-700">*</span></label>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#7bb12b] text-white text-sm">
                      <th className="px-3 py-2 border-r border-white"></th>
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
                    {prescriptions.map((item, idx) => (
                      <tr className="bg-white text-center" key={idx}>
                        <td className="px-2 py-2 align-middle">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-red-500 text-lg font-bold"
                            onClick={() => removePrescription(idx)}
                            title="Xóa"
                          >
                            ×
                          </button>
                        </td>
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full border rounded px-1 py-1"
                            value={item.name}
                            onChange={e => handlePrescriptionChange(idx, 'name', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full border rounded px-1 py-1"
                            value={item.ingredient}
                            onChange={e => handlePrescriptionChange(idx, 'ingredient', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full border rounded px-1 py-1"
                            value={item.usage}
                            onChange={e => handlePrescriptionChange(idx, 'usage', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full border rounded px-1 py-1"
                            value={item.days}
                            onChange={e => handlePrescriptionChange(idx, 'days', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full border rounded px-1 py-1"
                            value={item.note}
                            onChange={e => handlePrescriptionChange(idx, 'note', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full border rounded px-1 py-1"
                            value={item.quantity}
                            onChange={e => handlePrescriptionChange(idx, 'quantity', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-[#1797a6] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#127c8a] transition"
                    onClick={addPrescription}
                  >
                    Thêm thuốc
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
