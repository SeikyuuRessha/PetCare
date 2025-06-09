import React, { useState } from 'react';
import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';
import AppointmentCard from '../../components/shared/AppointmentCard';
import AppointmentForm from '../../components/Form/AppointmentForm';

interface FormData {
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
}

interface Appointment {
  id: string;
  ownerName: string;
  phone: string;
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    imageUrl: string;
    owner: string;
  };
  email: string;
  address: string;
  date: string;
  time: string;
  symptoms: string;
  status: 'pending' | 'success' | 'rejected';
}

export default function AppointmentPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleSubmitAppointment = (formData: FormData) => {
    // Tạo appointment mới từ form data
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ownerName: formData.ownerName,
      phone: formData.phone,
      pet: formData.pet,
      email: formData.email,
      address: formData.address,
      date: formData.date,
      time: formData.time,
      symptoms: formData.symptoms,
      status: 'pending'
    };

    // Debug log để kiểm tra dữ liệu
    console.log('New Appointment Data:', newAppointment);

    // Cập nhật state để hiển thị card mới
    setAppointments(prev => {
      const updated = [...prev, newAppointment];
      console.log('Updated Appointments List:', updated);
      return updated;
    });

    // Đóng form và hiển thị thông báo
    setShowForm(false);
    alert('Đặt lịch khám thành công!');
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  console.log('Current Appointments:', appointments);

  return (
    <div className="font-sans bg-white min-h-screen flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1 relative z-10 px-8 pt-10 pb-12 min-h-[calc(100vh-200px)]">
        <h2 className="text-xl font-semibold mb-6">Lịch khám hiện tại</h2>

        {/* Debug info */}
        <div className="text-sm text-gray-500 mb-2">
          Số lượng lịch khám: {appointments.length}
        </div>

        {/* Display appointments */}
        <div className="space-y-4">
          {appointments.map(appointment => (
            <AppointmentCard 
              key={appointment.id}
              appointment={appointment}
              onDelete={() => handleDelete(appointment.id)}
              onClick={() => setSelectedAppointment(appointment)}
              isUserView={true}
            />
          ))}
        </div>

        {/* Add new appointment button */}
        <div className="flex gap-8 mt-8">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
          >
            Thêm Lịch Khám
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              <AppointmentForm 
                onSubmit={handleSubmitAppointment}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Modal for Viewing Existing Appointment */}
        {selectedAppointment && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedAppointment(null)}
          >
            <div 
              className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              <AppointmentForm 
                appointment={selectedAppointment}
                readOnly={selectedAppointment.status !== 'pending'}
                onSubmit={(data) => {
                  // Handle update appointment
                  setAppointments(prev => prev.map(app => 
                    app.id === selectedAppointment.id 
                      ? { ...data, id: app.id, status: app.status }
                      : app
                  ));
                  setSelectedAppointment(null);
                }}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}