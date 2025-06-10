import React, { useState, useEffect } from "react";
import {
    appointmentService,
    CreateAppointmentData,
} from "../../services/appointmentService";
import { petService, Pet } from "../../services/petService";

interface AppointmentFormProps {
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function AppointmentForm({
    onSuccess,
    onClose,
}: AppointmentFormProps) {
    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState("");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [reason, setReason] = useState("");
    const [selectedPetId, setSelectedPetId] = useState("");
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        try {
            setLoading(true);
            const petsData = await petService.getMyPets();
            setPets(petsData);
        } catch (error) {
            console.error("Failed to load pets:", error);
            alert("Không thể tải danh sách thú cưng. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };
    // Simple calendar for improved date selection
    function Calendar({
        value,
        onChange,
    }: {
        value: Date | null;
        onChange: (d: Date) => void;
    }) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const [month, setMonth] = useState(currentMonth);
        const [year, setYear] = useState(currentYear);

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const getDaysInMonth = (month: number, year: number) =>
            new Date(year, month + 1, 0).getDate();
        const getFirstDayOfMonth = (month: number, year: number) =>
            new Date(year, month, 1).getDay();

        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const startingDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

        const daysArr = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blanks = Array.from({ length: startingDay }, () => null);

        const isToday = (day: number) => {
            return (
                today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year
            );
        };

        const isSelected = (day: number) => {
            return (
                value &&
                value.getDate() === day &&
                value.getMonth() === month &&
                value.getFullYear() === year
            );
        };

        const canSelectDate = (day: number) => {
            const date = new Date(year, month, day);
            return date >= today;
        };

        return (
            <div className="bg-white border rounded-lg p-4 shadow-md w-80">
                <div className="flex justify-between items-center mb-4">
                    <button
                        className="text-gray-400 hover:text-black"
                        onClick={() => {
                            if (month === 0) {
                                setMonth(11);
                                setYear(year - 1);
                            } else {
                                setMonth(month - 1);
                            }
                        }}
                        type="button"
                    >
                        {"<"}
                    </button>
                    <span className="font-bold">
                        {monthNames[month]} {year}
                    </span>
                    <button
                        className="text-gray-400 hover:text-black"
                        onClick={() => {
                            if (month === 11) {
                                setMonth(0);
                                setYear(year + 1);
                            } else {
                                setMonth(month + 1);
                            }
                        }}
                        type="button"
                    >
                        {">"}
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 font-semibold">
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                    <span>Su</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                    {blanks.map((_, i) => (
                        <span key={"b" + i}></span>
                    ))}
                    {daysArr.map((day) => {
                        const canSelect = canSelectDate(day);
                        const selected = isSelected(day);
                        const today = isToday(day);

                        return (
                            <button
                                key={day}
                                className={`rounded-full w-8 h-8 text-sm ${
                                    selected
                                        ? "bg-[#7bb12b] text-white"
                                        : today
                                        ? "bg-blue-100 text-blue-800"
                                        : canSelect
                                        ? "hover:bg-gray-100"
                                        : "text-gray-300 cursor-not-allowed"
                                }`}
                                onClick={() =>
                                    canSelect &&
                                    onChange(new Date(year, month, day))
                                }
                                type="button"
                                disabled={!canSelect}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }
    // Time picker with better slots
    function TimePicker({
        value,
        onChange,
    }: {
        value: string;
        onChange: (v: string) => void;
    }) {
        const timeSlots = [
            "08:00 - 09:00",
            "09:00 - 10:00",
            "10:00 - 11:00",
            "11:00 - 12:00",
            "13:00 - 14:00",
            "14:00 - 15:00",
            "15:00 - 16:00",
            "16:00 - 17:00",
        ];

        return (
            <div className="bg-white border rounded-lg p-4 shadow-md w-80">
                <div className="font-semibold mb-3 text-gray-700">
                    Chọn khung giờ khám
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot}
                            className={`rounded-lg px-3 py-2 text-sm text-center transition-colors ${
                                value === slot
                                    ? "bg-[#7bb12b] text-white"
                                    : "border border-gray-200 hover:bg-gray-50"
                            }`}
                            onClick={() => onChange(slot)}
                            type="button"
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPetId) {
            alert("Vui lòng chọn thú cưng!");
            return;
        }
        if (!date) {
            alert("Vui lòng chọn ngày khám!");
            return;
        }
        if (!time) {
            alert("Vui lòng chọn giờ khám!");
            return;
        }
        try {
            setSubmitting(true);

            // Combine date and time into a full datetime
            // Extract start time from time slot like "08:00 - 09:00"
            const startTime = time.split(" - ")[0];
            const [hours, minutes] = startTime.split(":");
            const combinedDate = new Date(date);
            combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            const appointmentData: CreateAppointmentData = {
                petId: selectedPetId,
                appointmentDate: combinedDate.toISOString(), // Full datetime
                symptoms: reason.trim() || undefined,
            };

            await appointmentService.createAppointment(appointmentData);
            alert("Đặt lịch khám thành công!");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error("Failed to create appointment:", error);
            alert(
                error.response?.data?.message ||
                    "Không thể đặt lịch khám. Vui lòng thử lại!"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Close button */}
            {onClose && (
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✕
                    </button>
                </div>
            )}

            <h3 className="text-xl font-semibold mb-6 text-center">
                Đặt Lịch Khám
            </h3>

            {/* Pet Selection */}
            <div className="mb-4">
                <label className="block text-sm mb-2 font-medium">
                    Chọn thú cưng <span className="text-[#7bb12b]">*</span>
                </label>
                {loading ? (
                    <div className="text-gray-500">Đang tải...</div>
                ) : pets.length > 0 ? (
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedPetId}
                        onChange={(e) => setSelectedPetId(e.target.value)}
                        required
                    >
                        {" "}
                        <option value="">-- Chọn thú cưng --</option>
                        {pets.map((pet) => (
                            <option key={pet.petId} value={pet.petId}>
                                {pet.name} ({pet.species})
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="text-gray-500">
                        Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng trước
                        khi đặt lịch khám.
                    </div>
                )}
            </div>

            {/* Date Selection */}
            <div className="mb-4">
                <label className="block text-sm mb-2 font-medium">
                    Chọn ngày khám <span className="text-[#7bb12b]">*</span>
                </label>
                <div className="relative">
                    <input
                        className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
                        value={date ? date.toLocaleDateString("vi-VN") : ""}
                        readOnly
                        onClick={() => setShowDatePicker((v) => !v)}
                        placeholder="Chọn ngày khám"
                        required
                    />
                    {showDatePicker && (
                        <div className="absolute z-20 mt-2 left-0">
                            <Calendar
                                value={date}
                                onChange={(d) => {
                                    setDate(d);
                                    setShowDatePicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Time Selection */}
            <div className="mb-4">
                <label className="block text-sm mb-2 font-medium">
                    Chọn khung giờ khám{" "}
                    <span className="text-[#7bb12b]">*</span>
                </label>
                <div className="relative">
                    <input
                        className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
                        value={time}
                        readOnly
                        onClick={() => setShowTimePicker((v) => !v)}
                        placeholder="Chọn khung giờ"
                        required
                    />
                    {showTimePicker && (
                        <div className="absolute z-20 mt-2 left-0">
                            <TimePicker
                                value={time}
                                onChange={(t) => {
                                    setTime(t);
                                    setShowTimePicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
                <label className="block text-sm mb-2 font-medium">
                    Lý do khám (tùy chọn)
                </label>
                <textarea
                    className="w-full border rounded px-3 py-2 h-20 resize-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Mô tả triệu chứng hoặc lý do khám..."
                />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-4">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                )}
                <button
                    type="submit"
                    disabled={submitting || pets.length === 0}
                    className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {submitting ? "Đang đặt lịch..." : "Đặt Lịch Khám"}
                </button>
            </div>
        </form>
    );
}
