import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorAppointmentForm from '../../components/Form/DoctorAppointmentForm';

export default function DoctorAppointmentPage() {
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Mock data
  const appointments = [
    {
      id: '1',
      ownerName: 'Nguyễn Văn A',
      phone: '0123456789',
      petName: 'Miu',
      species: 'Mèo',
      email: 'nguyenvana@email.com',
      address: 'Hà Nội',
      date: '2024-01-20',
      time: '09:00 - 10:00',
      symptoms: 'Ho, sốt nhẹ'
    },
    // ...more appointments
  ];

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Top green bar */}
      <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-0 md:px-8 py-1">
        <span className="ml-4">Welcome To Our Pet Store</span>
        <span className="flex items-center gap-2 mr-4">
          <span>Currency: $USD</span>
          <span>|</span>
          <span>Account <span className="align-super text-[10px]">▼</span></span>
        </span>
      </div>
      {/* Back arrow */}
      <div 
        className="mt-8 ml-8 cursor-pointer" 
        onClick={() => navigate('/doctor')}
      >
        <svg width="60" height="32" viewBox="0 0 60 32" fill="none">
          <path d="M40 16H8M8 16L20 28M8 16L20 4" stroke="#7bb12b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* Title */}
      <div className="flex justify-center mt-2 mb-8">
        <div className="bg-[#1797a6] text-white text-3xl font-normal rounded-xl px-16 py-4 shadow border border-black">
          TRANG LỊCH KHÁM
        </div>
      </div>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          {appointments.map(appointment => (
            <div 
              key={appointment.id}
              className="bg-[#dbdbdb] rounded-2xl px-10 py-8 mb-6 cursor-pointer hover:bg-[#d0d0d0] transition"
              onClick={() => setSelectedAppointment(appointment)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[1.5rem] font-medium text-[#222]">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <span className="mr-2">Lịch Khám:</span>
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Tên chủ nhân:</span>
                    <span>{appointment.ownerName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Trạng Thái:</span>
                    <span className="bg-white border border-[#7bb12b] text-[#7bb12b] font-semibold rounded px-2 py-0.5 ml-2 text-base">
                      Chờ xác nhận
                    </span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <span className="mr-2">Khung giờ khám:</span>
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Tên thú cưng:</span>
                    <span>{appointment.petName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Appointment Form Modal */}
      {selectedAppointment && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedAppointment(null)}
        >
          <div 
            className="mx-4 max-w-2xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <DoctorAppointmentForm
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
              onAccept={() => {
                // Handle accept logic
                alert('Đã xác nhận lịch khám');
                setSelectedAppointment(null);
              }}
              onReject={() => {
                // Handle reject logic
                alert('Đã từ chối lịch khám');
                setSelectedAppointment(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
