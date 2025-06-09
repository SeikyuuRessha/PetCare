import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from '../../components/Form/AppointmentForm';
import AppointmentCard from '../../components/shared/AppointmentCard';

interface AppointmentData {
  id: string;
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
}

export default function DoctorAppointmentPage() {
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [appointments, setAppointments] = useState<AppointmentData[]>([
    {
      id: '1',
      ownerName: 'Nguyễn Văn A',
      phone: '0123456789',
      pet: {
        id: '1',
        name: 'Miu',
        species: 'Mèo',
        breed: 'Mèo Anh',
        owner: 'Nguyễn Văn A',
        imageUrl: '/pet-avatar.png'
      },
      email: 'nguyenvana@email.com',
      address: 'Hà Nội',
      date: '2024-01-20',
      time: '09:00 - 10:00',
      symptoms: 'Ho, sốt nhẹ',
      status: 'pending' as const
    },
  ]);

  const handleAccept = (appointmentId: string) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentId 
        ? { ...app, status: 'success' as const }
        : app
    ));
    alert('Đã xác nhận lịch khám');
    setSelectedAppointment(null);
  };

  const handleReject = (appointmentId: string) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentId 
        ? { ...app, status: 'rejected' as const }
        : app
    ));
    alert('Đã từ chối lịch khám');
    setSelectedAppointment(null);
  };

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
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onClick={() => setSelectedAppointment(appointment)}
            />
          ))}
        </div>
      </main>

      {/* Modal for AppointmentForm */}
      {selectedAppointment && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedAppointment(null)}
        >
          <div 
            className="mx-4 max-w-2xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <AppointmentForm
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
              onAccept={() => handleAccept(selectedAppointment.id)}
              onReject={() => handleReject(selectedAppointment.id)}
              readOnly={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
