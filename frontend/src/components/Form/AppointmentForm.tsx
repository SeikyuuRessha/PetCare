import React, { useState } from 'react';
import PetComponent from '../shared/PetComponent';

interface AppointFormData {
  ownerName: string;
  phone: string;
  pet: Pet;
  email: string;
  address: string;
  date: string;
  time: string;
  symptoms: string;
}

interface AppointmentFormProps {
  appointment?: {
    ownerName: string;
    phone: string;
    pet: {
      id: string;
      name: string;
      species: string;
      breed: string;
      owner: string;
      imageUrl: string;
    };
    email: string;
    address: string;
    date: string;
    time: string;
    symptoms: string;
    status: 'pending' | 'success' | 'rejected';
  };
  onClose?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  readOnly?: boolean;
  onSubmit?: (formData: AppointFormData) => void;
}

interface Pet {
  id: string;
  name: string;
  owner: string;
  species: string;
  breed: string;
  imageUrl: string;
}

export default function AppointmentForm({ onSubmit, ...props }: AppointmentFormProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPetList, setShowPetList] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Update mock data image paths
  const availablePets = [
    { 
      id: '1', 
      name: 'Shi', 
      owner: 'Nguyễn Văn A', 
      species: 'Chó', 
      breed: 'Shiba',
      imageUrl: '../public/images/image1.png'
    },
    { 
      id: '2', 
      name: 'Miu', 
      owner: 'Trần Thị B', 
      species: 'Mèo', 
      breed: 'Anh Lông Ngắn',
      imageUrl: '../public/images/image3.png'
    },
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet) {
      alert('Vui lòng chọn thú cưng!');
      return;
    }

    if (!date || !time) {
      alert('Vui lòng chọn ngày và giờ khám!');
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData: AppointFormData = {
      ownerName: form.ownerName.value,
      phone: form.phone.value,
      pet: selectedPet,
      email: form.email.value,
      address: form.address.value || '',
      date: date.toLocaleDateString(),
      time: time,
      symptoms: form.symptoms.value || ''
    };

    // Debug log
    console.log('Form Data:', formData);

    // Gọi onSubmit và đảm bảo nó tồn tại
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#ededed] rounded-2xl border border-gray-400 p-6 max-w-xl mx-auto shadow" style={{ minHeight: 340 }}>
      <div className="mb-2">
        <label className="block text-sm mb-1">Tên Chủ Nhân <span className="text-[#7bb12b]">*</span></label>
        <input 
          name="ownerName"
          required
          className={`w-full border rounded px-3 py-2 ${props.readOnly ? 'bg-gray-50' : ''}`}
          defaultValue={props.appointment?.ownerName || ''}
          readOnly={props.readOnly}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Số điện thoại <span className="text-[#7bb12b]">*</span></label>
        <input 
          name="phone"
          required
          className={`w-full border rounded px-3 py-2 ${props.readOnly ? 'bg-gray-50' : ''}`}
          defaultValue={props.appointment?.phone || ''}
          readOnly={props.readOnly}
        />
      </div>
      {/* Pet selection section */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Thông tin thú cưng <span className="text-[#7bb12b]">*</span></label>
        {props.readOnly ? (
          <div className="mb-2">
            <PetComponent 
              pet={props.appointment!.pet}
              onViewDetails={() => {}}
              hideViewDetails={true}
            />
          </div>
        ) : (
          <>
            {selectedPet ? (
              <div className="mb-2">
                <PetComponent 
                  pet={selectedPet}
                  onViewDetails={() => {}}
                  hideViewDetails={true}
                />
              </div>
            ) : (
              <div className="text-gray-500 mb-2">Vui lòng chọn thú cưng</div>
            )}
            <button
              type="button"
              className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#5d990f] transition"
              onClick={() => setShowPetList(true)}
            >
              Chọn thú cưng
            </button>
          </>
        )}
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Email <span className="text-[#7bb12b]">*</span></label>
        <input 
          name="email"
          required
          type="email"
          className={`w-full border rounded px-3 py-2 ${props.readOnly ? 'bg-gray-50' : ''}`}
          defaultValue={props.appointment?.email || ''}
          readOnly={props.readOnly}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Địa chỉ thường trú</label>
        <input 
          className={`w-full border rounded px-3 py-2 ${props.readOnly ? 'bg-gray-50' : ''}`}
          defaultValue={props.appointment?.address || ''}
          readOnly={props.readOnly}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Ngày khám</label>
        <input 
          className={`w-full border rounded px-3 py-2 ${props.readOnly ? 'bg-gray-50' : ''}`}
          defaultValue={props.readOnly ? props.appointment?.date || '' : date?.toLocaleDateString() || ''}
          readOnly={true}
          onClick={() => !props.readOnly && setShowDatePicker(v => !v)}
        />
        {!props.readOnly && showDatePicker && (
          <div className="absolute z-10 mt-2">
            <Calendar value={date} onChange={d => { setDate(d); setShowDatePicker(false); }} />
          </div>
        )}
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Khung giờ khám</label>
        <input 
          className={`w-full border rounded px-3 py-2 ${props.readOnly ? 'bg-gray-50' : ''}`}
          defaultValue={props.readOnly ? props.appointment?.time || '' : time}
          readOnly={true}
          onClick={() => !props.readOnly && setShowTimePicker(v => !v)}
        />
        {!props.readOnly && showTimePicker && (
          <div className="absolute z-10 mt-2">
            <TimePicker value={time} onChange={t => { setTime(t); setShowTimePicker(false); }} />
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1">Triệu chứng</label>
        <input 
          className={`w-full border rounded px-3 py-2 ${props.readOnly ? 'bg-gray-50' : ''}`}
          defaultValue={props.appointment?.symptoms || ''}
          readOnly={props.readOnly}
        />
      </div>
      {props.readOnly ? (
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={props.onReject}
            className="bg-red-500 text-white px-6 py-2 rounded-full font-medium hover:bg-red-600 transition"
          >
            Từ chối lịch khám
          </button>
          <button
            type="button"
            onClick={props.onAccept}
            className="bg-[#7bb12b] text-white px-6 py-2 rounded-full font-medium hover:bg-[#6aa11e] transition"
          >
            Xác nhận lịch khám
          </button>
        </div>
      ) : (
        <div className="flex justify-start">
          <button
            type="submit"
            className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#5d990f] transition"
          >
            Đặt Lịch Khám
          </button>
        </div>
      )}

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
                    setSelectedPet(availablePet);
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
    </form>
  );
}
