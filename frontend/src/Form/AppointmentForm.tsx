import React, { useState } from 'react';

export default function AppointmentForm() {
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Simple calendar for demo (not production ready)
  function Calendar({ value, onChange }: { value: Date | null; onChange: (d: Date) => void }) {
    // For demo, show May/June 2023 only
    const months = [
      { name: 'May 2023', days: 31, firstDay: 1 }, // 1: Monday
      { name: 'June 2023', days: 30, firstDay: 4 }, // 4: Thursday
    ];
    const [monthIdx, setMonthIdx] = useState(0);

    const daysArr = Array.from({ length: months[monthIdx].days }, (_, i) => i + 1);
    const blanks = Array.from({ length: months[monthIdx].firstDay }, () => null);

    return (
      <div className="bg-white border rounded-lg p-4 shadow-md w-72">
        <div className="flex justify-between items-center mb-2">
          <button
            className="text-gray-400 hover:text-black"
            disabled={monthIdx === 0}
            onClick={() => setMonthIdx(monthIdx - 1)}
          >{'<'}</button>
          <span className="font-bold">{months[monthIdx].name}</span>
          <button
            className="text-gray-400 hover:text-black"
            disabled={monthIdx === months.length - 1}
            onClick={() => setMonthIdx(monthIdx + 1)}
          >{'>'}</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
          <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {blanks.map((_, i) => <span key={'b'+i}></span>)}
          {daysArr.map(day => {
            const selected =
              value &&
              value.getDate() === day &&
              value.getMonth() === monthIdx + 4 && // May=4, June=5
              value.getFullYear() === 2023;
            return (
              <button
                key={day}
                className={`rounded-full w-8 h-8 ${selected ? 'bg-[#5d990f] text-white' : 'hover:bg-[#e0e0e0]'}`}
                onClick={() => onChange(new Date(2023, monthIdx + 4, day))}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Simple time picker for demo
  function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const slots = [
      '08:00 - 09:00',
      '09:00 - 10:00',
      '10:00 - 11:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
    ];
    return (
      <div className="bg-white border rounded-lg p-4 shadow-md w-72">
        <div className="font-bold mb-2">Chọn khung giờ khám</div>
        <div className="flex flex-col gap-2">
          {slots.map(slot => (
            <button
              key={slot}
              className={`rounded px-3 py-2 text-left ${value === slot ? 'bg-[#5d990f] text-white' : 'hover:bg-[#e0e0e0]'}`}
              onClick={() => onChange(slot)}
              type="button"
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form className="bg-[#ededed] rounded-2xl border border-gray-400 p-6 max-w-xl mx-auto shadow" style={{ minHeight: 340 }}>
      <div className="mb-2">
        <label className="block text-sm mb-1">Tên Chủ Nhân <span className="text-[#7bb12b]">*</span></label>
        <input className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Số điện thoại <span className="text-[#7bb12b]">*</span></label>
        <input className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="block text-sm mb-1">Tên thú cưng</label>
          <input className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">Loài động vật <span className="text-[#7bb12b]">*</span></label>
          <input className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Email <span className="text-[#7bb12b]">*</span></label>
        <input className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Địa chỉ thường trú</label>
        <input className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Chọn ngày khám</label>
        <div className="relative">
          <input
            className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
            value={date ? date.toLocaleDateString() : ''}
            readOnly
            onClick={() => setShowDatePicker(v => !v)}
            placeholder="Chọn ngày"
          />
          {showDatePicker && (
            <div className="absolute z-10 mt-2">
              <Calendar value={date} onChange={d => { setDate(d); setShowDatePicker(false); }} />
            </div>
          )}
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Chọn khung giờ khám</label>
        <div className="relative">
          <input
            className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
            value={time}
            readOnly
            onClick={() => setShowTimePicker(v => !v)}
            placeholder="Chọn khung giờ"
          />
          {showTimePicker && (
            <div className="absolute z-10 mt-2">
              <TimePicker value={time} onChange={t => { setTime(t); setShowTimePicker(false); }} />
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1">Triệu chứng</label>
        <input className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex justify-start">
        <button
          type="submit"
          className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#5d990f] transition"
        >
          Đặt Lịch Khám
        </button>
      </div>
    </form>
  );
}
