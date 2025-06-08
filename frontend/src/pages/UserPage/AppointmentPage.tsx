import React, { useState } from 'react';
import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';
import AppointmentCard from '../../components/shared/AppointmentCard';
import AppointmentForm from '../../components/Form/AppointmentForm';

export default function AppointmentPage() {
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState(['1']); // Example appointment IDs

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter(appId => appId !== id));
  };

  return (
    <div className="font-sans bg-white min-h-screen flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1 relative z-10 px-8 pt-10 pb-12 min-h-[calc(100vh-200px)]">
        <h2 className="text-xl font-semibold mb-6">Lịch khám hiện tại</h2>
        
        {appointments.map(id => (
          <AppointmentCard 
            key={id} 
            onDelete={() => handleDelete(id)} 
          />
        ))}

        <div className="flex gap-8 mt-4">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
          >
            Thêm Lịch Khám
          </button>
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div 
            className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <AppointmentForm />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}