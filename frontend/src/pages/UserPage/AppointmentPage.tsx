import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import TopBar from "../../components/layouts/TopBar";
import Footer from "../../components/layouts/Footer";
import AppointmentForm from "../../components/Form/AppointmentForm";
import {
    appointmentService,
    Appointment,
} from "../../services/appointmentService";
import { petService, Pet } from "../../services/petService";

export default function AppointmentPage() {
    const [showForm, setShowForm] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [appointmentsData, petsData] = await Promise.all([
                appointmentService.getAllAppointments(),
                petService.getMyPets(),
            ]);
            setAppointments(appointmentsData);
            setPets(petsData);
        } catch (error: any) {
            console.error("Failed to load data:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await appointmentService.cancelAppointment(id);
            setAppointments(
                appointments.filter((app) => app.appointmentId !== id)
            );
        } catch (error: any) {
            console.error("Failed to cancel appointment:", error);
            alert("Không thể hủy lịch khám. Vui lòng thử lại!");
        }
    };

    const handleAppointmentAdded = () => {
        setShowForm(false);
        loadData(); // Reload appointments
    };

    return (
        <div className="font-sans bg-white min-h-screen flex flex-col">
            <TopBar />
            <Header />

            <main className="flex-1 relative z-10 px-8 pt-10 pb-12 min-h-[calc(100vh-200px)]">
                <h2 className="text-xl font-semibold mb-6">
                    Lịch khám hiện tại
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="text-lg">Đang tải lịch khám...</div>
                    </div>
                ) : appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <div
                            key={appointment.appointmentId}
                            className="mb-4 p-4 border rounded-lg bg-gray-50"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-[#7bb12b]">
                                        {appointment.pet?.name || "Thú cưng"}
                                    </h3>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Ngày khám:
                                        </span>{" "}
                                        {new Date(
                                            appointment.appointmentDate
                                        ).toLocaleDateString("vi-VN")}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Giờ khám:
                                        </span>{" "}
                                        {appointment.appointmentTime ||
                                            new Date(
                                                appointment.appointmentDate
                                            ).toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Trạng thái:
                                        </span>
                                        <span
                                            className={`ml-2 px-2 py-1 rounded text-sm ${
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
                                            {appointment.status === "CONFIRMED"
                                                ? "Đã xác nhận"
                                                : appointment.status ===
                                                  "PENDING"
                                                ? "Đang chờ"
                                                : appointment.status ===
                                                  "COMPLETED"
                                                ? "Hoàn thành"
                                                : "Đã hủy"}
                                        </span>
                                    </p>
                                    {(appointment.reason ||
                                        appointment.symptoms) && (
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Lý do khám:
                                            </span>{" "}
                                            {appointment.reason ||
                                                appointment.symptoms}
                                        </p>
                                    )}
                                    {appointment.doctor && (
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Bác sĩ:
                                            </span>{" "}
                                            {appointment.doctor.fullName}
                                        </p>
                                    )}
                                    {appointment.notes && (
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Ghi chú:
                                            </span>{" "}
                                            {appointment.notes}
                                        </p>
                                    )}
                                </div>
                                {appointment.status === "PENDING" && (
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                appointment.appointmentId
                                            )
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Hủy lịch
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">
                            Bạn chưa có lịch khám nào
                        </p>
                        <p className="text-gray-400">
                            Hãy đặt lịch khám cho thú cưng của bạn!
                        </p>
                    </div>
                )}

                <div className="flex gap-8 mt-4">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#7bb12b] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
                    >
                        Thêm Lịch Khám
                    </button>
                </div>
            </main>

            {/* Form Modal */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="bg-white p-6 rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AppointmentForm
                            onSuccess={handleAppointmentAdded}
                            onClose={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
