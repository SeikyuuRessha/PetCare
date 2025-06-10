import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PetComponent from "../../components/shared/PetComponent";
import Doctor_PetInformationForm from "../../components/Form/Doctor_PetInformationForm";
import { petService, Pet } from "../../services/petService";
import {
    medicalRecordService,
    MedicalRecord,
} from "../../services/medicalRecordService";

export default function DoctorMedicalRecordPage() {
    const navigate = useNavigate();
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        try {
            setLoading(true);
            const petsData = await petService.getAllPets();
            setPets(petsData);
        } catch (error: any) {
            console.error("Failed to load pets:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadMedicalRecords = async (petId: string) => {
        try {
            const records = await medicalRecordService.getMedicalRecordsByPet(
                petId
            );
            setMedicalRecords(records);
        } catch (error: any) {
            console.error("Failed to load medical records:", error);
        }
    };

    const handlePetSelect = (pet: Pet) => {
        setSelectedPet(pet);
        loadMedicalRecords(pet.petId);
    };

    return (
        <div className="font-sans bg-white min-h-screen">
            {/* Top green bar */}
            <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-0 md:px-8 py-1">
                <span className="ml-4">Welcome To Our Pet Store</span>
                <span className="flex items-center gap-2 mr-4">
                    <span>Currency: $USD</span>
                    <span>|</span>
                    <span>
                        Account{" "}
                        <span className="align-super text-[10px]">▼</span>
                    </span>
                </span>
            </div>
            {/* Back arrow */}
            <div
                className="mt-8 ml-8 cursor-pointer"
                onClick={() => navigate("/doctor")}
            >
                <svg width="60" height="32" viewBox="0 0 60 32" fill="none">
                    <path
                        d="M40 16H8M8 16L20 28M8 16L20 4"
                        stroke="#7bb12b"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
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
                <div className="w-full max-w-6xl mt-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="text-lg">Loading pets...</div>
                        </div>
                    ) : (
                        <div className="bg-[#e5e5e5] rounded-lg px-8 py-6">
                            <h2 className="text-2xl font-semibold mb-6 text-center">
                                Select a Pet to View/Create Medical Record
                            </h2>
                            {pets.length === 0 ? (
                                <div className="text-center py-8 text-gray-600">
                                    No pets available
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {pets.map((pet) => (
                                        <div
                                            key={pet.petId}
                                            className="cursor-pointer transform hover:scale-105 transition-transform"
                                            onClick={() => handlePetSelect(pet)}
                                        >
                                            <PetComponent
                                                pet={{
                                                    petId: pet.petId,
                                                    name: pet.name,
                                                    owner: pet.owner,
                                                    species:
                                                        pet.species ||
                                                        "Unknown",
                                                    breed: pet.breed || "Mixed",
                                                    gender: pet.gender,
                                                    color: pet.color,
                                                    imageUrl:
                                                        pet.imageUrl ||
                                                        "/api/placeholder/150/150",
                                                    identifyingMarks:
                                                        pet.identifyingMarks,
                                                }}
                                                onViewDetails={() =>
                                                    handlePetSelect(pet)
                                                }
                                                hideViewDetails={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Doctor_PetInformationForm
                            pet={{
                                id: selectedPet.petId,
                                name: selectedPet.name,
                                owner:
                                    selectedPet.owner?.fullName ||
                                    selectedPet.owner?.username ||
                                    "Unknown Owner",
                                species: selectedPet.species || "Unknown",
                                breed: selectedPet.breed || "Mixed",
                                imageUrl:
                                    selectedPet.imageUrl ||
                                    "/api/placeholder/150/150",
                            }}
                            onClose={() => setSelectedPet(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
