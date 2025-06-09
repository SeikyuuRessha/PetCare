import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import User_PetInformationForm from '../../components/Form/User_PetInformationForm';

interface PetRecord {
  id: string;
  owner: string;
  petName: string;
  species: string;
  breed: string;
  gender: 'Đực' | 'Cái';
  age: number;
  color: string;
  imageUrl: string;
}

export default function PetRecordsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<PetRecord | null>(null);
  const [pets, setPets] = useState<PetRecord[]>([
    {
      id: '1',
      owner: 'Nguyễn Văn A',
      petName: 'Miu',
      species: 'Mèo',
      breed: 'Anh lông ngắn',
      gender: 'Cái',
      age: 2,
      color: 'Trắng xám',
      imageUrl: '../public/images/image3.png'
    },
    {
      id: '2',
      owner: 'Trần Thị B',
      petName: 'Ki',
      species: 'Chó',
      breed: 'Corgi',
      gender: 'Đực',
      age: 1,
      color: 'Nâu vàng',
      imageUrl: '../public/images/image1.png'
    },
    // Add more mock data here
  ]);

  const handleDeletePet = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa hồ sơ thú cưng này?')) {
      setPets(prev => prev.filter(pet => pet.id !== id));
    }
  };

  const filteredPets = pets.filter(pet => 
    pet.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.species.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-semibold mb-8">Quản Lý Hồ Sơ Thú Cưng</h1>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên chủ, tên thú cưng hoặc loài..."
            className="w-full max-w-md px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Pets table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Tên chủ nhân</th>
                <th className="px-6 py-3 text-left">Tên thú cưng</th>
                <th className="px-6 py-3 text-left">Loài</th>
                <th className="px-6 py-3 text-left">Giống</th>
                <th className="px-6 py-3 text-left">Tuổi</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPets.map(pet => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{pet.owner}</td>
                  <td className="px-6 py-4">{pet.petName}</td>
                  <td className="px-6 py-4">{pet.species}</td>
                  <td className="px-6 py-4">{pet.breed}</td>
                  <td className="px-6 py-4">{pet.age} tuổi</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setSelectedPet(pet)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Pet Details Modal */}
      {selectedPet && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedPet(null)}
        >
          <div 
            className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <User_PetInformationForm
              onClose={() => setSelectedPet(null)}
              readOnly={true}
              petData={selectedPet}
            />
          </div>
        </div>
      )}
    </div>
  );
}
