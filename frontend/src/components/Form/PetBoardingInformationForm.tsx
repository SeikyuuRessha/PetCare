import React, { useState } from 'react';

export default function PetBoardingInformationForm() {
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
    <form className="bg-[#fafafa] rounded-2xl border border-gray-400 p-6 max-w-5xl mx-auto shadow" style={{ minHeight: 340 }}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Chọn thú cưng */}
        <div className="flex flex-col items-center justify-center bg-[#eef3f0] border-2 border-[#8bc34a] rounded-xl px-8 py-6 min-w-[340px] min-h-[220px]">
          <button
            type="button"
            className="bg-white border-2 border-[#1797a6] text-[#1797a6] font-semibold px-8 py-4 rounded-lg text-lg shadow hover:bg-[#eaf1ef] transition"
          >
            Chọn thú cưng
          </button>
        </div>
        {/* Right: Form fields */}
        <div className="flex-1">
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">Ngày gửi</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Ngày đón về</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">Chọn phòng</label>
            <input className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-2">
            <label className="block text-sm mb-1">Ghi chú khi gửi</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} />
          </div>
          <div className="flex gap-4 justify-end mt-6">
            <button
              type="submit"
              className="bg-[#8bc34a] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#7bb12b] transition"
            >
              Lưu thông tin
            </button>
            <button
              type="button"
              className="bg-[#e53935] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#b71c1c] transition"
            >
              Xóa lịch gửi
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
