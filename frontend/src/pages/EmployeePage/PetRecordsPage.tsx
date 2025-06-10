import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import User_PetInformationForm from "../../components/Form/User_PetInformationForm";
import { petService, Pet } from "../../services/petService";

export default function PetRecordsPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllPets();
    }, []);

    const loadAllPets = async () => {
        try {
            setLoading(true);
            const allPets = await petService.getAllPets();
            setPets(allPets);
        } catch (error: any) {
            console.error("Failed to load pets:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePet = async (petId: string) => {
        if (window.confirm("Bạn có chắc muốn xóa hồ sơ thú cưng này?")) {
            try {
                await petService.deletePet(petId);
                setPets((prev) => prev.filter((pet) => pet.petId !== petId));
            } catch (error) {
                console.error("Failed to delete pet:", error);
                alert("Không thể xóa hồ sơ thú cưng");
            }
        }
    };
    const filteredPets = pets.filter(
        (pet) =>
            pet.owner?.fullName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            pet.owner?.username
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (pet.species &&
                pet.species.toLowerCase().includes(searchTerm.toLowerCase()))
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
                    onClick={() => navigate("/employee")}
                    className="flex items-center text-[#7bb12b] hover:text-[#5d990f]"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            d="M19 12H5M5 12L12 19M5 12L12 5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="ml-2">Quay lại</span>
                </button>
            </div>
            <main className="px-8 py-6">
                <h1 className="text-3xl font-semibold mb-8">
                    Quản Lý Hồ Sơ Thú Cưng
                </h1>
                {/* Search bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên chủ, tên thú cưng hoặc loài..."
                        className="w-full max-w-md px-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>{" "}
                {/* Pets table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="text-lg">Đang tải dữ liệu...</div>
                        </div>
                    ) : (
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        Tên chủ nhân
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Tên thú cưng
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Loài
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Giống
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Giới tính
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPets.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            Không tìm thấy thú cưng nào
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPets.map((pet) => (
                                        <tr
                                            key={pet.petId}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                {pet.owner?.fullName ||
                                                    pet.owner?.username ||
                                                    "Không rõ"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {pet.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {pet.species || "Không rõ"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {pet.breed || "Không rõ"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {pet.gender === "MALE"
                                                    ? "Đực"
                                                    : pet.gender === "FEMALE"
                                                    ? "Cái"
                                                    : "Không rõ"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-4">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedPet(pet)
                                                        }
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Chi tiết
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeletePet(
                                                                pet.petId
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>{" "}
            {/* Pet Details Modal */}
            {selectedPet && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setSelectedPet(null)}
                >
                    <div
                        className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <User_PetInformationForm
                            onClose={() => setSelectedPet(null)}
                            readOnly={true}
                            petData={{
                                petId: selectedPet.petId,
                                name: selectedPet.name,
                                species: selectedPet.species || "",
                                breed: selectedPet.breed || "",
                                gender:
                                    selectedPet.gender === "MALE"
                                        ? "Đực"
                                        : selectedPet.gender === "FEMALE"
                                        ? "Cái"
                                        : "Đực",
                                color: selectedPet.color || "",
                                imageUrl: selectedPet.imageUrl || "",
                                identifyingMarks: selectedPet.identifyingMarks,
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
