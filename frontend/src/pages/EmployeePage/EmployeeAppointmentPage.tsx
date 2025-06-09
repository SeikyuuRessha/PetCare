import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  date: string;
  time: string;
  user: {
    name: string;
    phone: string;
  };
  pet: {
    name: string;
    species: string;
  };
  doctor: string | null;
  status: 'pending' | 'assigned' | 'completed';
}

export default function EmployeeAppointmentPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>(
    [
      {
        id: '1',
        date: '2024-01-20',
        time: '09:00 - 10:00',
        user: { name: 'Nguyễn Văn A', phone: '0123456789' },
        pet: { name: 'Miu', species: 'Mèo' },
        doctor: null,
        status: 'pending'
      },
      {
        id: '2',
        date: '2024-01-20',
        time: '10:00 - 11:00',
        user: { name: 'Trần Thị B', phone: '0987654321' },
        pet: { name: 'Ki', species: 'Chó' },
        doctor: null,
        status: 'assigned'
      },
      {
        id: '3',
        date: '2024-01-21',
        time: '14:00 - 15:00',
        user: { name: 'Lê Văn C', phone: '0909090909' },
        pet: { name: 'Bun', species: 'Thỏ' },
        doctor: null,
        status: 'pending'
      },
      {
        id: '4',
        date: '2024-01-21',
        time: '15:00 - 16:00',
        user: { name: 'Phạm Thị D', phone: '0855555555' },
        pet: { name: 'Snow', species: 'Mèo' },
        doctor: null,
        status: 'pending'
      }
    ]
  );

  // Mock doctors list
  const doctors = [
    { id: '1', name: 'Dr. Trịnh Minh Đạt' },
    { id: '2', name: 'Dr. Nguyễn Thị B' },
    { id: '3', name: 'Dr. Trần Văn C' }
  ];

  const handleAssignDoctor = (appointmentId: string, doctorName: string) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentId 
        ? { ...app, doctor: doctorName, status: 'assigned' as const }
        : app
    ));
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch hẹn này?')) {
      setAppointments(appointments.filter(app => app.id !== id));
    }
  };

  const filteredAppointments = appointments.filter(app => 
    app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.date.includes(searchTerm) ||
    app.time.includes(searchTerm)
  );

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Top bar */}
      <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-8 py-1">
        <span>Employee Dashboard</span>
      </div>

      {/* Back button */}
      <div className="mt-8 ml-8">
        <button 
          onClick={() => navigate('/employee')}
          className="flex items-center text-[#7bb12b] hover:text-[#5d990f]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2">Quay lại</span>
        </button>
      </div>

      <main className="px-8 py-6">
        <h1 className="text-3xl font-semibold mb-8">Quản Lý Lịch Hẹn</h1>

        {/* Search and filters */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, ngày, giờ..."
            className="flex-1 max-w-md px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Appointments table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Ngày</th>
                <th className="px-6 py-3 text-left">Giờ</th>
                <th className="px-6 py-3 text-left">Người đặt</th>
                <th className="px-6 py-3 text-left">Thú cưng</th>
                <th className="px-6 py-3 text-left">Bác sĩ</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map(appointment => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{appointment.date}</td>
                  <td className="px-6 py-4">{appointment.time}</td>
                  <td className="px-6 py-4">
                    <div>{appointment.user.name}</div>
                    <div className="text-sm text-gray-500">{appointment.user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{appointment.pet.name}</div>
                    <div className="text-sm text-gray-500">{appointment.pet.species}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="border rounded px-2 py-1"
                      value={appointment.doctor || ''}
                      onChange={(e) => handleAssignDoctor(appointment.id, e.target.value)}
                    >
                      <option value="">Chọn bác sĩ</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.name}>{doc.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'assigned' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status === 'pending' ? 'Chờ xử lý' :
                       appointment.status === 'assigned' ? 'Đã phân công' :
                       'Hoàn thành'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
