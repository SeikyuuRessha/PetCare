import React from "react";
import { Pet } from "../../services/petService";

interface PetComponentProps {
    pet: Pet;
    onViewDetails: () => void;
    hideViewDetails?: boolean;
    className?: string;
}

export default function PetComponent({
    pet,
    onViewDetails,
    hideViewDetails = false,
    className = "",
}: PetComponentProps) {
    return (
        <div
            className={`bg-[#f3f8f7] border-2 border-[#8bc34a] rounded-xl p-6 flex flex-col min-w-[380px] max-w-[420px] ${className}`}
        >
            <div className="flex items-center">
                <div>
                    <img
                        src={pet.imageUrl || "../public/images/image3.png"}
                        alt="Pet"
                        className="w-32 h-32 object-cover rounded border-2 border-[#1cb0b8] bg-gray-300"
                    />
                </div>
                <div className="ml-8 flex flex-col gap-1 text-base">
                    <div>
                        <span className="text-[#1797a6] font-semibold">
                            Thú Cưng:
                        </span>
                        <span className="text-black ml-1">{pet.name}</span>
                    </div>
                    <div>
                        <span className="text-[#b2c800] font-semibold">
                            Chủ Nhân:
                        </span>
                        <span className="text-black ml-1">
                            {pet.owner?.fullName ||
                                pet.owner?.username ||
                                "Bạn"}
                        </span>
                    </div>
                    <div>
                        <span className="text-[#8bc34a] font-semibold">
                            Loài:
                        </span>
                        <span className="text-black ml-1">{pet.species}</span>
                    </div>
                    <div>
                        <span className="text-[#b2c800] font-semibold">
                            Giống:
                        </span>
                        <span className="text-black ml-1">{pet.breed}</span>
                    </div>
                </div>
            </div>
            {!hideViewDetails && (
                <button
                    onClick={onViewDetails}
                    className="mt-4 bg-[#1797a6] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#127c8a] transition self-end"
                >
                    Xem chi tiết
                </button>
            )}
        </div>
    );
}
