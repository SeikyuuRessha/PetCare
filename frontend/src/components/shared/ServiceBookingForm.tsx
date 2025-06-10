import React, { useState } from "react";
import { ServiceOption } from "../../services/serviceService";

interface ServiceBookingFormProps {
    serviceOption: ServiceOption;
    selectedPet: any;
    onConfirm: (bookingData: any) => void;
    onCancel: () => void;
    loading: boolean;
}

export default function ServiceBookingForm({
    serviceOption,
    selectedPet,
    onConfirm,
    onCancel,
    loading,
}: ServiceBookingFormProps) {
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [specialRequirements, setSpecialRequirements] = useState("");

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!bookingDate) {
            alert("Vui lòng chọn ngày đặt dịch vụ!");
            return;
        }

        if (!bookingTime) {
            alert("Vui lòng chọn giờ đặt dịch vụ!");
            return;
        }

        // Combine date and time
        const [hours, minutes] = bookingTime.split(":");
        const combinedDate = new Date(bookingDate);
        combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const bookingData = {
            petId: selectedPet.petId,
            serviceOptionId: serviceOption.optionId,
            bookingDate: combinedDate.toISOString(),
            specialRequirements: specialRequirements.trim() || undefined,
        };

        onConfirm(bookingData);
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split("T")[0];

    const timeSlots = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
    ];

    return (
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center text-[#7bb12b]">
                Xác nhận đặt dịch vụ
            </h3>

            {/* Service Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-lg">
                    {serviceOption.optionName}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                    {serviceOption.description}
                </p>
                <p className="font-bold text-[#7bb12b]">
                    Giá:{" "}
                    {serviceOption.price
                        ? formatPrice(serviceOption.price)
                        : "Liên hệ"}
                </p>
            </div>

            {/* Pet Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p>
                    <span className="font-semibold">Thú cưng:</span>{" "}
                    {selectedPet.petName || selectedPet.name}
                </p>
                <p>
                    <span className="font-semibold">Loài:</span>{" "}
                    {selectedPet.species}
                </p>
                <p>
                    <span className="font-semibold">Giống:</span>{" "}
                    {selectedPet.breed}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Date Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Ngày đặt dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={today}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[#7bb12b] focus:border-transparent"
                        required
                    />
                </div>

                {/* Time Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Giờ đặt dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[#7bb12b] focus:border-transparent"
                        required
                    >
                        <option value="">-- Chọn giờ --</option>
                        {timeSlots.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Special Requirements */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        Ghi chú đặc biệt
                    </label>
                    <textarea
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        placeholder="Nhập yêu cầu đặc biệt nếu có..."
                        className="w-full border rounded px-3 py-2 h-20 resize-none focus:ring-2 focus:ring-[#7bb12b] focus:border-transparent"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[#7bb12b] text-white py-2 px-4 rounded hover:bg-[#5d990f] transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Đang đặt..." : "Xác nhận đặt"}
                    </button>
                </div>
            </form>
        </div>
    );
}
