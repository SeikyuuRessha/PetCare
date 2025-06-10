import React from "react";
import PetComponent from "./PetComponent";

interface BookedServiceCardProps {
    pet: {
        petId: string; // Changed from id to petId to match Pet interface
        name: string;
        owner: string;
        species: string;
        breed: string;
        imageUrl: string;
    };
    service: {
        id?: string; // Add service booking ID for cancellation
        title: string;
        description: string;
        price: string;
        features: string[];
        type: "Pet Care" | "Pet Care & Veterinary";
        serviceDetails?: {
            date?: string;
            time?: string;
            startDate?: string; // for boarding service
            endDate?: string; // for boarding service
            room?: string; // for boarding service
            notes?: string;
            totalAmount?: string;
        };
    };
    status?: string;
    onCancel?: (serviceId: string) => void; // Add cancel callback
    showCancelButton?: boolean; // Add option to show cancel button
}

export default function BookedServiceCard({
    pet,
    service,
    status = "Đã thanh toán",
    onCancel,
    showCancelButton = false,
}: BookedServiceCardProps) {
    const isBoardingService = service.title.toLowerCase().includes("gửi");
    const canBeCancelled =
        !status.includes("Đã hủy") &&
        !status.includes("Đã hoàn thành") &&
        showCancelButton;

    const handleCancel = () => {
        if (onCancel && service.id) {
            onCancel(service.id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Service and Pet Info */}
                <div className="lg:w-2/3 space-y-6">
                    {/* Service Title & Price */}
                    <div className="bg-[#f8faf7] rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[#1797a6] text-sm">
                                    {service.type}
                                </span>
                                <h3 className="font-semibold text-2xl">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600">
                                    {service.description}
                                </p>
                            </div>
                            <div className="text-[#ff3c00] text-2xl font-bold">
                                {service.serviceDetails?.totalAmount ||
                                    service.price}
                            </div>
                        </div>
                    </div>{" "}
                    {/* Pet Info with updated image path */}
                    <div className="bg-[#f8faf7] rounded-lg p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] shrink-0">
                                <img
                                    src={
                                        pet.imageUrl ||
                                        "../public/images/image1.png"
                                    }
                                    alt={pet.name}
                                    className="w-full h-auto rounded-lg border-2 border-[#1cb0b8]"
                                />
                                <p className="text-center mt-2 font-medium">
                                    {pet.name}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Loài:
                                    </p>
                                    <p>{pet.species}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Giống:
                                    </p>
                                    <p>{pet.breed}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Booking Details */}
                <div className="lg:w-1/3 bg-[#f8faf7] rounded-lg p-4">
                    <h4 className="font-semibold mb-4">Chi tiết đặt lịch</h4>
                    <div className="space-y-4">
                        {isBoardingService ? (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-gray-500 text-sm block">
                                            Ngày gửi:
                                        </label>
                                        <div className="font-medium">
                                            {service.serviceDetails?.startDate}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-gray-500 text-sm block">
                                            Ngày đón:
                                        </label>
                                        <div className="font-medium">
                                            {service.serviceDetails?.endDate}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-500 text-sm block">
                                        Phòng:
                                    </label>
                                    <div className="font-medium">
                                        {service.serviceDetails?.room}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-gray-500 text-sm block">
                                        Ngày:
                                    </label>
                                    <div className="font-medium">
                                        {service.serviceDetails?.date}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-500 text-sm block">
                                        Giờ:
                                    </label>
                                    <div className="font-medium">
                                        {service.serviceDetails?.time}
                                    </div>
                                </div>
                            </div>
                        )}
                        {service.serviceDetails?.notes && (
                            <div>
                                <label className="text-gray-500 text-sm block">
                                    Ghi chú:
                                </label>
                                <div className="mt-1 p-2 bg-white rounded text-sm">
                                    {service.serviceDetails.notes}
                                </div>
                            </div>
                        )}{" "}
                        <div className="pt-3 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">
                                    Trạng thái:
                                </span>
                                <span
                                    className={`font-semibold ${
                                        status?.includes("Đã hủy")
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    {status}
                                </span>
                            </div>

                            {/* Cancel Button */}
                            {canBeCancelled && (
                                <div className="mt-4">
                                    <button
                                        className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                                        onClick={handleCancel}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Hủy đặt lịch
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
