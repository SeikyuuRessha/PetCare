import React, { useState } from "react";
import { petService, CreatePetData } from "../../services/petService";
import { getUserInfo } from "../../utils/auth";

interface User_PetInformationFormProps {
    onClose?: () => void;
    onSubmit?: () => void;
    readOnly?: boolean;
    petData?: {
        petId?: string;
        name: string;
        species: string;
        breed: string;
        gender: "Đực" | "Cái";
        color: string;
        imageUrl: string;
        identifyingMarks?: string;
    };
}

export default function User_PetInformationForm({
    onClose,
    onSubmit,
    readOnly = false,
    petData,
}: User_PetInformationFormProps) {
    const [gender, setGender] = useState<"Đực" | "Cái">(
        petData?.gender || "Đực"
    );
    const [petImage, setPetImage] = useState<File | null>(null);
    const [petImageUrl, setPetImageUrl] = useState<string | null>(
        petData?.imageUrl || null
    );
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: petData?.name || "",
        species: petData?.species || "",
        breed: petData?.breed || "",
        color: petData?.color || "",
        identifyingMarks: petData?.identifyingMarks || "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setPetImage(file);
        if (file) {
            setPetImageUrl(URL.createObjectURL(file));
        } else {
            setPetImageUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (readOnly) return;

        // Validation
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên thú cưng!");
            return;
        }
        if (!formData.species.trim()) {
            alert("Vui lòng nhập loài động vật!");
            return;
        }
        if (!formData.color.trim()) {
            alert("Vui lòng nhập màu sắc lông!");
            return;
        }
        if (!formData.identifyingMarks.trim()) {
            alert("Vui lòng nhập đặc điểm nhận dạng!");
            return;
        }
        setLoading(true);
        try {
            // Get current user info
            const currentUser = getUserInfo();
            if (!currentUser?.id) {
                alert("Vui lòng đăng nhập lại!");
                return;
            }

            // Convert gender from Vietnamese to English for API
            const genderMap = {
                Đực: "MALE",
                Cái: "FEMALE",
            };
            const petDataToSubmit: CreatePetData = {
                name: formData.name.trim(),
                species: formData.species.trim(),
                breed: formData.breed.trim() || undefined,
                gender: genderMap[gender],
                color: formData.color.trim(),
                identifyingMarks: formData.identifyingMarks.trim(),
                imageUrl: petImageUrl || undefined,
                // ownerId will be automatically set by backend from token
            };

            if (petData?.petId) {
                // Update existing pet
                await petService.updatePet(petData.petId, petDataToSubmit);
                alert("Cập nhật thông tin thú cưng thành công!");
            } else {
                // Create new pet
                await petService.createPet(petDataToSubmit);
                alert("Thêm thú cưng thành công!");
            }

            onSubmit?.();
            onClose?.();
        } catch (error: any) {
            console.error("Error saving pet:", error);
            alert(
                error.response?.data?.message ||
                    "Có lỗi xảy ra khi lưu thông tin thú cưng!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">
                    {petData?.petId
                        ? "Sửa hồ sơ thú cưng"
                        : "Thêm hồ sơ thú cưng"}
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-[#fafafa] rounded-2xl border border-gray-300 p-6 max-w-4xl mx-auto shadow-md"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left column */}
                    <div>
                        {" "}
                        <div className="flex gap-4 mb-2">
                            <div className="flex-1">
                                <label className="block text-sm mb-1">
                                    Tên thú cưng{" "}
                                    <span className="text-[#7bb12b]">*</span>
                                </label>
                                <input
                                    name="name"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    readOnly={readOnly}
                                    placeholder="Nhập tên thú cưng"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm mb-1">
                                    Loài động vật{" "}
                                    <span className="text-[#7bb12b]">*</span>
                                </label>
                                <input
                                    name="species"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.species}
                                    onChange={handleInputChange}
                                    readOnly={readOnly}
                                    placeholder="Ví dụ: Chó, Mèo"
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm mb-1">Giống</label>
                            <input
                                name="breed"
                                className="w-full border rounded px-3 py-2"
                                value={formData.breed}
                                onChange={handleInputChange}
                                readOnly={readOnly}
                                placeholder="Ví dụ: Golden Retriever, Mèo Anh lông ngắn"
                            />
                        </div>
                        <div className="flex gap-4 mb-2">
                            <div className="flex-1">
                                <label className="block text-sm mb-1">
                                    Giới tính{" "}
                                    <span className="text-[#7bb12b]">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className={`px-6 py-1 rounded-full font-semibold text-base border ${
                                            gender === "Đực"
                                                ? "bg-[#27d11a] text-white shadow"
                                                : "bg-white text-black border-gray-300"
                                        }`}
                                        onClick={() => setGender("Đực")}
                                        disabled={readOnly}
                                    >
                                        Đực
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-6 py-1 rounded-full font-semibold text-base border ${
                                            gender === "Cái"
                                                ? "bg-[#27d11a] text-white shadow"
                                                : "bg-white text-black border-gray-300"
                                        }`}
                                        onClick={() => setGender("Cái")}
                                        disabled={readOnly}
                                    >
                                        Cái
                                    </button>
                                </div>
                            </div>{" "}
                            <div className="flex-1">
                                <label className="block text-sm mb-1">
                                    Màu sắc lông{" "}
                                    <span className="text-[#7bb12b]">*</span>
                                </label>
                                <input
                                    name="color"
                                    className="w-full border rounded px-3 py-2"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    readOnly={readOnly}
                                    placeholder="Ví dụ: Nâu, Trắng, Đen"
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm mb-1">
                                Đặc điểm nhận dạng{" "}
                                <span className="text-[#7bb12b]">*</span>
                            </label>
                            <input
                                name="identifyingMarks"
                                className="w-full border rounded px-3 py-2"
                                value={formData.identifyingMarks}
                                onChange={handleInputChange}
                                readOnly={readOnly}
                                placeholder="Ví dụ: Có đốm trên trán, đuôi cong"
                            />{" "}
                        </div>
                    </div>
                    {/* Right column */}
                    <div className="flex flex-col h-full">
                        <label className="block text-sm mb-1">
                            Ảnh thú cưng
                        </label>
                        {petImageUrl && (
                            <div className="mb-2 flex justify-center">
                                <img
                                    src={petImageUrl}
                                    alt="Pet"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-400"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="mb-2"
                            onChange={handlePetImageChange}
                            disabled={readOnly}
                        />
                    </div>
                </div>{" "}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="bg-[#7bb12b] text-white px-6 py-2 rounded-full hover:bg-[#6aa11e] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={readOnly || loading}
                    >
                        {loading
                            ? "Đang lưu..."
                            : petData?.petId
                            ? "Cập nhật thông tin"
                            : "Lưu thông tin"}
                    </button>
                </div>
            </form>
        </div>
    );
}
