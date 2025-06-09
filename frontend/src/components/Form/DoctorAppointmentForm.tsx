import React from 'react';
import PetComponent from '../shared/PetComponent';

interface DoctorAppointmentFormProps {
  appointment: {
    ownerName: string;
    phone: string;
    pet: {
      id: string;
      name: string;
      species: string;
    };
    email: string;
    address: string;
    date: string;
    time: string;
    symptoms: string;
    status: string;
  };
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export default function DoctorAppointmentForm({ 
  appointment,
  onClose,
  onAccept,
  onReject
}: DoctorAppointmentFormProps) {
  return (
    <div className="bg-[#ededed] rounded-2xl border border-gray-400 p-6 max-w-xl mx-auto shadow">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Chi tiết lịch khám</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      {/* Appointment Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Tên Chủ Nhân</label>
          <div className="font-medium p-2 bg-white rounded">{appointment.ownerName}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Số điện thoại</label>
          <div className="font-medium p-2 bg-white rounded">{appointment.phone}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Thông tin thú cưng</label>
          <div className="font-medium p-2 bg-white rounded">
            {appointment.pet.name} - {appointment.pet.species}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <div className="font-medium p-2 bg-white rounded">{appointment.email}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Địa chỉ</label>
          <div className="font-medium p-2 bg-white rounded">{appointment.address}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Ngày khám</label>
            <div className="font-medium p-2 bg-white rounded">{appointment.date}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Giờ khám</label>
            <div className="font-medium p-2 bg-white rounded">{appointment.time}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Triệu chứng</label>
          <div className="font-medium p-2 bg-white rounded">{appointment.symptoms}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={onReject}
          className="bg-red-500 text-white px-6 py-2 rounded-full font-medium hover:bg-red-600 transition"
        >
          Từ chối lịch khám
        </button>
        <button
          onClick={onAccept}
          className="bg-[#7bb12b] text-white px-6 py-2 rounded-full font-medium hover:bg-[#6aa11e] transition"
        >
          Xác nhận lịch khám
        </button>
      </div>
    </div>
  );
}
