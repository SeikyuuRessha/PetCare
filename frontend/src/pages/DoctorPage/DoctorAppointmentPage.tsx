import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorAppointmentForm from "../../components/Form/DoctorAppointmentForm";
import {
    appointmentService,
    Appointment,
} from "../../services/appointmentService";

export default function DoctorAppointmentPage() {
    const navigate = useNavigate();
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const appointmentsData =
                await appointmentService.getAllAppointmentsAdmin();
            setAppointments(appointmentsData);
        } catch (error: any) {
            console.error("Failed to load appointments:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptAppointment = async (appointmentId: string) => {
        try {
            await appointmentService.updateAppointment(appointmentId, {
                status: "CONFIRMED",
            });
            await loadAppointments(); // Reload data
            setSelectedAppointment(null);
            alert("Đã xác nhận lịch khám thành công!");
        } catch (error: any) {
            console.error("Failed to accept appointment:", error);
            alert("Không thể xác nhận lịch khám. Vui lòng thử lại!");
        }
    };

    const handleRejectAppointment = async (appointmentId: string) => {
        try {
            await appointmentService.updateAppointment(appointmentId, {
                status: "CANCELLED",
            });
            await loadAppointments(); // Reload data
            setSelectedAppointment(null);
            alert("Đã từ chối lịch khám!");
        } catch (error: any) {
            console.error("Failed to reject appointment:", error);
            alert("Không thể từ chối lịch khám. Vui lòng thử lại!");
        }
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
                <div className="bg-[#1797a6] text-white text-3xl font-normal rounded-xl px-16 py-4 shadow border border-black">
                    TRANG LỊCH KHÁM
                </div>
            </div>
            {/* Main Content */}
            <main className="flex flex-col items-center justify-center px-4">
                {loading ? (
                    <div className="text-xl">Đang tải lịch khám...</div>
                ) : (
                    <div className="w-full max-w-5xl">
                        {appointments.length === 0 ? (
                            <div className="text-center text-xl text-gray-500">
                                Không có lịch khám nào
                            </div>
                        ) : (
                            appointments.map((appointment) => (
                                <div
                                    key={appointment.appointmentId}
                                    className="bg-[#dbdbdb] rounded-2xl px-10 py-8 mb-6 cursor-pointer hover:bg-[#d0d0d0] transition"
                                    onClick={() =>
                                        setSelectedAppointment({
                                            id: appointment.appointmentId,
                                            ownerName: "N/A", // Owner info not available in appointment data
                                            phone: "N/A",
                                            petName:
                                                appointment.pet?.name || "N/A",
                                            species:
                                                appointment.pet?.species ||
                                                "N/A",
                                            email: "N/A",
                                            address: "N/A",
                                            date: new Date(
                                                appointment.appointmentDate
                                            ).toLocaleDateString("vi-VN"),
                                            time: appointment.appointmentTime,
                                            symptoms:
                                                appointment.reason ||
                                                "Không có triệu chứng",
                                        })
                                    }
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[1.5rem] font-medium text-[#222]">
                                        <div className="space-y-6">
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    Lịch Khám:
                                                </span>
                                                <span>
                                                    {new Date(
                                                        appointment.appointmentDate
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    Tên chủ nhân:
                                                </span>
                                                <span>N/A</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    Trạng Thái:
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded text-sm ${
                                                        appointment.status ===
                                                        "CONFIRMED"
                                                            ? "bg-green-100 text-green-800"
                                                            : appointment.status ===
                                                              "PENDING"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : appointment.status ===
                                                              "COMPLETED"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {appointment.status ===
                                                    "CONFIRMED"
                                                        ? "Đã xác nhận"
                                                        : appointment.status ===
                                                          "PENDING"
                                                        ? "Đang chờ"
                                                        : appointment.status ===
                                                          "COMPLETED"
                                                        ? "Hoàn thành"
                                                        : "Đã hủy"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    Giờ khám:
                                                </span>
                                                <span>
                                                    {
                                                        appointment.appointmentTime
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    Tên thú cưng:
                                                </span>
                                                <span>
                                                    {appointment.pet?.name ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Modal for AppointmentForm */}
            {selectedAppointment && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setSelectedAppointment(null)}
                >
                    <div
                        className="mx-4 max-w-2xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DoctorAppointmentForm
                            appointment={selectedAppointment}
                            onClose={() => setSelectedAppointment(null)}
                            onAccept={() =>
                                handleAcceptAppointment(selectedAppointment.id)
                            }
                            onReject={() =>
                                handleRejectAppointment(selectedAppointment.id)
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
