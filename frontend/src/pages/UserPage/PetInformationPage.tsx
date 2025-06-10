import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/layouts/Header";
import TopBar from "../../components/layouts/TopBar";
import Footer from "../../components/layouts/Footer";
import User_PetInformationForm from "../../components/Form/User_PetInformationForm";
import { petService, Pet } from "../../services/petService";

export default function PetInformationPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPetForm, setShowPetForm] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadMyPets();
    }, []);

    const loadMyPets = async () => {
        try {
            setLoading(true);
            const myPets = await petService.getMyPets();
            setPets(myPets);
        } catch (error: any) {
            console.error("Failed to load pets:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const addNewPet = () => {
        setEditingPet(null);
        setShowPetForm(true);
    };

    const editPet = (pet: Pet) => {
        setEditingPet(pet);
        setShowPetForm(true);
    };

    const deletePet = async (petId: string, petName: string) => {
        if (!window.confirm(`Bạn có chắc muốn xóa thông tin của ${petName}?`)) {
            return;
        }

        try {
            await petService.deletePet(petId);
            setPets((prev) => prev.filter((pet) => pet.petId !== petId));
            alert(`Đã xóa thông tin của ${petName} thành công!`);
        } catch (error: any) {
            console.error("Failed to delete pet:", error);
            alert("Không thể xóa thông tin thú cưng. Vui lòng thử lại.");
        }
    };

    const handlePetAdded = () => {
        setShowPetForm(false);
        setEditingPet(null);
        loadMyPets(); // Reload pets after adding/updating
    };

    return (
        <div className="font-sans bg-white min-h-screen">
            <TopBar />
            <Header />

            {/* Main Content */}
            <main className="relative z-10 px-12 pt-2 pb-12">
                <h2 className="text-2xl font-bold mt-6 mb-6">
                    Thông tin thú cưng
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="text-lg">
                            Đang tải thông tin thú cưng...
                        </div>
                    </div>
                ) : pets.length > 0 ? (
                    pets.map((pet) => (
                        <div
                            key={pet.petId}
                            className="mb-6 p-6 border rounded-lg bg-gray-50"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-[#7bb12b] mb-4">
                                        {pet.name}
                                    </h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">
                                                Loài:
                                            </span>{" "}
                                            {pet.species}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Giống:
                                            </span>{" "}
                                            {pet.breed || "Chưa xác định"}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Giới tính:
                                            </span>{" "}
                                            {pet.gender === "MALE"
                                                ? "Đực"
                                                : pet.gender === "FEMALE"
                                                ? "Cái"
                                                : "Chưa xác định"}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Màu sắc:
                                            </span>{" "}
                                            {pet.color || "Chưa xác định"}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Đặc điểm nhận dạng:
                                            </span>{" "}
                                            {pet.identifyingMarks ||
                                                "Chưa xác định"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {pet.imageUrl && (
                                        <div className="mb-4">
                                            <img
                                                src={pet.imageUrl}
                                                alt={pet.name}
                                                className="w-48 h-48 object-cover rounded-lg border"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-4 flex gap-4 justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                                    onClick={() => editPet(pet)}
                                >
                                    Sửa thông tin
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
                                    onClick={() =>
                                        deletePet(pet.petId, pet.name)
                                    }
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">
                            Bạn chưa có thông tin thú cưng nào
                        </p>
                        <p className="text-gray-400">
                            Hãy thêm hồ sơ thú cưng đầu tiên của bạn!
                        </p>
                    </div>
                )}

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
                    onClick={() => {
                        setShowPetForm(false);
                        setEditingPet(null);
                    }}
                >
                    <div
                        className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <User_PetInformationForm
                            onClose={() => {
                                setShowPetForm(false);
                                setEditingPet(null);
                            }}
                            onSubmit={handlePetAdded}
                            petData={
                                editingPet
                                    ? {
                                          petId: editingPet.petId,
                                          name: editingPet.name,
                                          species: editingPet.species || "",
                                          breed: editingPet.breed || "",
                                          gender:
                                              editingPet.gender === "MALE"
                                                  ? "Đực"
                                                  : editingPet.gender ===
                                                    "FEMALE"
                                                  ? "Cái"
                                                  : "Đực",
                                          color: editingPet.color || "",
                                          imageUrl: editingPet.imageUrl || "",
                                          identifyingMarks:
                                              editingPet.identifyingMarks || "",
                                      }
                                    : undefined
                            }
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
