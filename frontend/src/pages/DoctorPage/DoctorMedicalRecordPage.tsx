import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PetComponent from "../../components/shared/PetComponent";
import Doctor_PetInformationForm from "../../components/Form/Doctor_PetInformationForm";
import { petService, Pet } from "../../services/petService";
import {
    medicalRecordService,
    MedicalRecord,
} from "../../services/medicalRecordService";
import { getUser } from "../../utils/auth";

export default function DoctorMedicalRecordPage() {
    const navigate = useNavigate();
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [selectedMedicalRecord, setSelectedMedicalRecord] =
        useState<MedicalRecord | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [doctorMedicalRecords, setDoctorMedicalRecords] = useState<
        MedicalRecord[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDoctorMedicalRecords();
    }, []);
    const loadDoctorMedicalRecords = async () => {
        try {
            setLoading(true);
            const currentUser = getUser();
            console.log(
                "Current user in DoctorMedicalRecordPage:",
                currentUser
            );

            if (!currentUser) {
                navigate("/login");
                return;
            }

            // Load medical records for current doctor
            const records = await medicalRecordService.getAllMedicalRecords();
            console.log("All medical records:", records);

            // Handle case where records might be undefined or empty
            if (!records || !Array.isArray(records)) {
                console.warn("No medical records found or invalid response");
                setDoctorMedicalRecords([]);
                setPets([]);
                return;
            }

            const doctorRecords = records.filter(
                (record) => record.doctorId === currentUser.id
            );
            console.log("Filtered doctor records:", doctorRecords);
            console.log("Current user ID:", currentUser.id);
            setDoctorMedicalRecords(doctorRecords);

            // Extract unique pets from doctor's medical records
            const uniquePets = new Map<string, Pet>();
            doctorRecords.forEach((record) => {
                if (record.appointment?.pet) {
                    const pet = record.appointment.pet;
                    if (!uniquePets.has(pet.petId)) {
                        uniquePets.set(pet.petId, {
                            petId: pet.petId,
                            name: pet.name,
                            species: pet.species || "",
                            breed: "", // Not available in medical record response
                            gender: "", // Not available in medical record response
                            color: "", // Not available in medical record response
                            imageUrl: "", // Not available in medical record response
                            identifyingMarks: "", // Not available in medical record response
                            ownerId: "", // Not available in medical record response
                            owner: undefined, // Not available in medical record response
                        });
                    }
                }
            });
            setPets(Array.from(uniquePets.values()));
        } catch (error: any) {
            console.error("Failed to load medical records:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadMedicalRecords = async (petId: string) => {
        try {
            // Filter doctor's medical records for the selected pet
            const petRecords = doctorMedicalRecords.filter(
                (record) => record.appointment?.pet?.petId === petId
            );
            setMedicalRecords(petRecords);
        } catch (error: any) {
            console.error("Failed to load medical records:", error);
        }
    };
    const handlePetSelect = (pet: Pet) => {
        setSelectedPet(pet);

        // Find existing medical record for this pet
        const existingRecord = doctorMedicalRecords.find(
            (record) => record.appointment?.pet?.petId === pet.petId
        );
        setSelectedMedicalRecord(existingRecord || null);

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
                        {" "}
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
                            }}                            existingMedicalRecord={selectedMedicalRecord}                            onSuccess={() => {
                                // Reload medical records when save is successful
                                loadDoctorMedicalRecords().then(() => {
                                    // Update selectedMedicalRecord with latest data
                                    if (selectedPet) {
                                        const updatedRecord = doctorMedicalRecords.find(
                                            (record) => record.appointment?.pet?.petId === selectedPet.petId
                                        );
                                        setSelectedMedicalRecord(updatedRecord || null);
                                    }
                                });
                            }}
                            onClose={() => {
                                setSelectedPet(null);
                                setSelectedMedicalRecord(null);
                                // Reload medical records after closing to get updated data
                                loadDoctorMedicalRecords();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
