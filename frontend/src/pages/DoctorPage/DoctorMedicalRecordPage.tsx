import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetComponent from '../../components/shared/PetComponent';
import Doctor_PetInformationForm from '../../components/Form/Doctor_PetInformationForm';

export default function DoctorMedicalRecordPage() {
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<any>(null);

  // Mock data
  const petData = {
    id: '1',
    name: 'Shi',
    owner: 'Nguyễn Văn A',
    species: 'Chó',
    breed: 'Shiba',
    imageUrl: '../public/images/image1.png'
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
        <div className="bg-[#7bb12b] text-white text-3xl font-normal rounded-xl px-16 py-4 shadow border border-black">
          TRANG BỆNH ÁN
        </div>
      </div>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4">
        <div className="flex items-stretch w-full max-w-5xl mt-4">
          <div className="w-full bg-[#e5e5e5] rounded-lg px-8 py-6">
            <div 
              className="w-[180px] cursor-pointer"
              onClick={() => setSelectedPet(petData)}
            >
              <PetComponent
                pet={petData}
                onViewDetails={() => setSelectedPet(petData)}
                hideViewDetails={true}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Medical Record Form Modal */}
      {selectedPet && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedPet(null)}
        >
          <div 
            className="mx-4 max-w-2xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <Doctor_PetInformationForm
              pet={selectedPet}
              onClose={() => setSelectedPet(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
