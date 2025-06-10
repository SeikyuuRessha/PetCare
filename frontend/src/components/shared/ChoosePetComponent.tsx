import React, { useState, useEffect } from "react";
import PetComponent from "./PetComponent";
import { petService, Pet } from "../../services/petService";

interface ChoosePetComponentProps {
    pet?: Pet;
    onSelectPet?: (selectedPet: Pet) => void;
    children?: React.ReactNode;
}

export default function ChoosePetComponent({
    pet,
    onSelectPet,
    children,
}: ChoosePetComponentProps) {
    const [showPetList, setShowPetList] = useState(false);
    const [availablePets, setAvailablePets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMyPets();
    }, []);

    const loadMyPets = async () => {
        try {
            setLoading(true);
            const myPets = await petService.getMyPets();
            setAvailablePets(myPets);
        } catch (error) {
            console.error("Failed to load pets:", error);
            setAvailablePets([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center px-4">
            <div
                className="bg-[#ededed] border border-gray-400 rounded-xl p-8 w-full overflow-x-auto"
                style={{ minWidth: "400px", maxWidth: "400px" }}
            >
                <div className="flex flex-col md:flex-row gap-y-8 md:gap-x-16 justify-center">
                    {/* Left Column - Pet Selection */}
                    <div className="bg-white rounded-lg p-8 min-h-[450px] flex flex-col w-[450px] items-center justify-center shadow">
                        <h3 className="text-lg font-semibold mb-8">
                            Chọn thú cưng
                        </h3>
                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            {pet ? (
                                <div className="w-full flex flex-col items-center mb-6">
                                    <div className="w-[220px] h-[220px] flex items-center justify-center">
                                        <PetComponent
                                            pet={pet}
                                            onViewDetails={() => {}}
                                            hideViewDetails={true}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-500 text-base mb-4 text-center w-full">
                                    Chọn Pet cho dịch vụ của bạn ở đây
                                </span>
                            )}

                            <button
                                type="button"
                                className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#5d990f] transition mt-6"
                                onClick={() => setShowPetList(true)}
                            >
                                Chọn thú cưng
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pet Selection Modal */}
            {showPetList && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={() => setShowPetList(false)}
                >
                    <div
                        className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Danh sách thú cưng
                        </h3>
                        <div className="grid gap-4">
                            {" "}
                            {availablePets.map((availablePet) => (
                                <div
                                    key={availablePet.petId}
                                    className="cursor-pointer hover:bg-[#f3f7e7] rounded transition"
                                    onClick={() => {
                                        if (onSelectPet) {
                                            onSelectPet(availablePet);
                                        }
                                        setShowPetList(false);
                                    }}
                                >
                                    <PetComponent
                                        pet={availablePet}
                                        onViewDetails={() => {}}
                                        hideViewDetails={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
