import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/layouts/Header';
import TopBar from '../../components/layouts/TopBar';
import Footer from '../../components/layouts/Footer';
import PetInfoSection from '../../components/shared/PetInfoSection';
import User_PetInformationForm from '../../components/Form/User_PetInformationForm';

export default function PetInformationPage() {
  const [pets, setPets] = useState<string[]>(['1']); // Array of pet IDs
  const [showPetForm, setShowPetForm] = useState(false);
  const navigate = useNavigate();

  const addNewPet = () => {
    setShowPetForm(true);
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <TopBar />
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-12 pt-2 pb-12">
        <h2 className="text-2xl font-bold mt-6 mb-6">Thông tin thú cưng</h2>
        
        {pets.map(petId => (
          <PetInfoSection key={petId} petId={petId} />
        ))}

        {/* Add new pet button */}
        <div className="mt-8">
          <button 
            type="button" 
            className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
            onClick={addNewPet}
          >
            Thêm hồ sơ thú cưng
          </button>
        </div>
      </main>

      {/* Pet Information Form Modal */}
      {showPetForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPetForm(false)}
        >
          <div 
            className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <User_PetInformationForm 
              onClose={() => setShowPetForm(false)}
              onSubmit={() => {
                setPets([...pets, Date.now().toString()]);
                setShowPetForm(false);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
