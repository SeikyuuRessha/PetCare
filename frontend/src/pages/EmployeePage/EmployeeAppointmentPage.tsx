import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    appointmentService,
    Appointment,
} from "../../services/appointmentService";
import { userService, User } from "../../services/userService";
import {
    medicalRecordService,
    MedicalRecord,
} from "../../services/medicalRecordService";
import { toast } from "react-toastify";

// Interface for appointment with doctor info from medical records
interface AppointmentWithDoctor extends Appointment {
    assignedDoctor?: {
        userId: string;
        fullName: string;
        username: string;
    };
}

export default function EmployeeAppointmentPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>(
        []
    );
    const [doctors, setDoctors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadAppointments = async () => {
        try {
            const appointmentsData =
                await appointmentService.getAllAppointmentsAdmin();
            return appointmentsData;
        } catch (error: any) {
            console.error("Failed to load appointments:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
            return [];
        }
    };

    const loadMedicalRecords = async () => {
        try {
            const medicalRecords =
                await medicalRecordService.getAllMedicalRecords();
            return medicalRecords;
        } catch (error: any) {
            console.error("Failed to load medical records:", error);
            return [];
        }
    };

    // Combined function to load all data and merge doctor info
    const loadData = async () => {
        try {
            setLoading(true); // Load appointments, doctors, and medical records in parallel
            const [appointmentsData, doctorsData, medicalRecords] =
                await Promise.all([
                    loadAppointments(),
                    userService
                        .getAllUsers()
                        .then((users) =>
                            users.filter((user) => user.role === "DOCTOR")
                        ),
                    loadMedicalRecords(),
                ]);

            // Ensure we have valid data arrays
            const validDoctorsData = Array.isArray(doctorsData)
                ? doctorsData
                : [];
            const validAppointmentsData = Array.isArray(appointmentsData)
                ? appointmentsData
                : [];

            setDoctors(validDoctorsData); // Create a map of appointmentId -> doctor info from medical records
            const appointmentDoctorMap = new Map<string, User>(); // Check if medicalRecords is valid before processing
            if (medicalRecords && Array.isArray(medicalRecords)) {
                console.log("Processing medical records:", medicalRecords);
                console.log("Available doctors:", validDoctorsData);
                medicalRecords.forEach((record) => {
                    if (record.appointmentId && record.doctorId) {
                        console.log(
                            `Looking for doctor with userId: ${record.doctorId}`
                        );
                        const doctor = validDoctorsData.find(
                            (doc) => doc.userId === record.doctorId
                        );
                        console.log(`Found doctor:`, doctor);
                        if (doctor) {
                            appointmentDoctorMap.set(
                                record.appointmentId,
                                doctor
                            );
                            console.log(
                                `Mapped appointment ${record.appointmentId} to doctor ${doctor.fullName}`
                            );
                        }
                    }
                });
            }

            console.log("Final appointmentDoctorMap:", appointmentDoctorMap);

            // Merge appointments with doctor info
            const appointmentsWithDoctors: AppointmentWithDoctor[] =
                validAppointmentsData.map((appointment) => ({
                    ...appointment,
                    assignedDoctor: appointmentDoctorMap.get(
                        appointment.appointmentId
                    )
                        ? {
                              userId: appointmentDoctorMap.get(
                                  appointment.appointmentId
                              )!.userId, // Đổi từ id thành userId
                              fullName: appointmentDoctorMap.get(
                                  appointment.appointmentId
                              )!.fullName,
                              username: appointmentDoctorMap.get(
                                  appointment.appointmentId
                              )!.username,
                          }
                        : undefined,
                }));

            setAppointments(appointmentsWithDoctors);
        } catch (error: any) {
            console.error("Failed to load data:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleAssignDoctor = async (
        appointmentId: string,
        doctorId: string
    ) => {
        try {
            console.log(
                `Starting doctor assignment: appointmentId=${appointmentId}, doctorId=${doctorId}`
            ); // Step 1: Check if medical record already exists for this appointment
            console.log(
                "Checking for existing medical record for appointment:",
                appointmentId
            );
            const allRecords =
                await medicalRecordService.getAllMedicalRecords();
            const recordsArray = Array.isArray(allRecords) ? allRecords : [];
            const existingRecord = recordsArray.find(
                (record) => record.appointmentId === appointmentId
            );
            console.log(
                "Found existing record for this appointment:",
                existingRecord
            ); // Step 2: Create or update medical record first (this is where doctor info is stored)
            if (existingRecord) {
                // Update existing medical record with new doctor
                console.log(
                    "Updating existing medical record with doctorId:",
                    doctorId
                );
                await medicalRecordService.updateMedicalRecord(
                    existingRecord.recordId,
                    {
                        doctorId: doctorId,
                    }
                );
                console.log("Successfully updated existing medical record");
            } else {
                // Create new medical record
                console.log(
                    "Creating new medical record for appointmentId:",
                    appointmentId,
                    "doctorId:",
                    doctorId
                );

                // Double-check one more time before creating to avoid race condition
                const doubleCheckRecords =
                    await medicalRecordService.getAllMedicalRecords();
                const doubleCheckArray = Array.isArray(doubleCheckRecords)
                    ? doubleCheckRecords
                    : [];
                const doubleCheckExisting = doubleCheckArray.find(
                    (record) => record.appointmentId === appointmentId
                );

                if (doubleCheckExisting) {
                    console.log(
                        "Medical record was created by another process, updating instead"
                    );
                    await medicalRecordService.updateMedicalRecord(
                        doubleCheckExisting.recordId,
                        {
                            doctorId: doctorId,
                        }
                    );
                    console.log(
                        "Successfully updated medical record found in double-check"
                    );
                } else {
                    try {
                        await medicalRecordService.createMedicalRecord({
                            doctorId: doctorId,
                            appointmentId: appointmentId,
                            // diagnosis and nextCheckupDate will be null by default
                        });
                        console.log("Successfully created new medical record");
                    } catch (createError: any) {
                        console.error(
                            "Error creating medical record:",
                            createError
                        );

                        // Check if it's a unique constraint error (record already exists)
                        if (
                            createError?.response?.data?.originalError?.includes(
                                "Unique constraint failed"
                            )
                        ) {
                            console.log(
                                "Medical record already exists due to race condition, trying to update instead..."
                            );

                            // Fetch the records again and try to update
                            const updatedRecords =
                                await medicalRecordService.getAllMedicalRecords();
                            const recordsArray2 = Array.isArray(updatedRecords)
                                ? updatedRecords
                                : [];
                            const existingRecord2 = recordsArray2.find(
                                (record) =>
                                    record.appointmentId === appointmentId
                            );

                            if (existingRecord2) {
                                await medicalRecordService.updateMedicalRecord(
                                    existingRecord2.recordId,
                                    {
                                        doctorId: doctorId,
                                    }
                                );
                                console.log(
                                    "Successfully updated medical record after race condition"
                                );
                            } else {
                                throw createError; // Re-throw if we still can't find the record
                            }
                        } else {
                            throw createError; // Re-throw other errors
                        }
                    }
                }
            }

            // Step 3: Only update appointment status AFTER medical record is successfully created/updated
            await appointmentService.updateAppointment(appointmentId, {
                status: "CONFIRMED",
            });
            console.log("Successfully updated appointment status to CONFIRMED");

            // Step 4: Reload all data to get updated doctor assignments
            await loadData();

            // Step 5: Show success message with doctor name
            const selectedDoctor = doctors.find(
                (doc) => doc.userId === doctorId
            );
            if (selectedDoctor) {
                toast.success(
                    `Đã phân công bác sĩ ${selectedDoctor.fullName} cho lịch hẹn này và tạo hồ sơ bệnh án!`
                );
            }
        } catch (error: any) {
            console.error("Failed to assign doctor:", error);
            console.error("Error details:", error?.response?.data);

            // Show specific error message based on the error
            if (error?.response?.status === 403) {
                toast.error(
                    "Không có quyền tạo hồ sơ bệnh án. Vui lòng liên hệ admin!"
                );
            } else if (error?.response?.status === 401) {
                toast.error(
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!"
                );
                navigate("/login");
            } else {
                toast.error(
                    "Không thể phân công bác sĩ. Lỗi: " +
                        (error?.response?.data?.message || error.message)
                );
            }
        }
    };

    const handleDeleteAppointment = async (appointmentId: string) => {
        if (window.confirm("Bạn có chắc muốn xóa lịch hẹn này?")) {
            try {
                await appointmentService.cancelAppointment(appointmentId);
                await loadData(); // Reload data
                toast.success("Đã xóa lịch hẹn thành công!");
            } catch (error: any) {
                console.error("Failed to cancel appointment:", error);
                toast.error("Không thể xóa lịch hẹn. Vui lòng thử lại!");
            }
        }
    };

    const filteredAppointments = appointments.filter(
        (app) =>
            app.pet?.owner?.fullName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            new Date(app.appointmentDate)
                .toLocaleDateString("vi-VN")
                .includes(searchTerm) ||
            app.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="font-sans bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7bb12b]"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

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
                    Quản Lý Lịch Hẹn
                </h1>

                {/* Search and filters */}
                <div className="mb-6 flex gap-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, ngày, giờ..."
                        className="flex-1 max-w-md px-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Appointments table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left">Ngày</th>
                                <th className="px-6 py-3 text-left">Giờ</th>
                                <th className="px-6 py-3 text-left">
                                    Người đặt
                                </th>
                                <th className="px-6 py-3 text-left">
                                    Thú cưng
                                </th>
                                <th className="px-6 py-3 text-left">Bác sĩ</th>
                                <th className="px-6 py-3 text-left">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-center">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAppointments.map((appointment) => (
                                <tr
                                    key={appointment.appointmentId}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        {new Date(
                                            appointment.appointmentDate
                                        ).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-4">
                                        {appointment.appointmentTime ||
                                            new Date(
                                                appointment.appointmentDate
                                            ).toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            {appointment.pet?.owner?.fullName ||
                                                "N/A"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {appointment.pet?.owner?.phone ||
                                                "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            {appointment.pet?.name || "N/A"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {appointment.pet?.species || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            className="border rounded px-2 py-1"
                                            value={
                                                appointment.assignedDoctor
                                                    ?.userId || ""
                                            }
                                            onChange={(e) =>
                                                handleAssignDoctor(
                                                    appointment.appointmentId,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Chọn bác sĩ
                                            </option>{" "}
                                            {doctors.map((doc) => (
                                                <option
                                                    key={doc.userId}
                                                    value={doc.userId}
                                                >
                                                    {doc.fullName}
                                                </option>
                                            ))}
                                        </select>
                                        {appointment.assignedDoctor && (
                                            <div className="text-sm text-green-600 mt-1">
                                                ✓ Đã gán:{" "}
                                                {
                                                    appointment.assignedDoctor
                                                        .fullName
                                                }
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {" "}
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${
                                                appointment.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : appointment.status ===
                                                      "CONFIRMED"
                                                    ? "bg-green-100 text-green-800"
                                                    : appointment.status ===
                                                      "COMPLETED"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {appointment.status === "PENDING"
                                                ? "Chờ xử lý"
                                                : appointment.status ===
                                                  "CONFIRMED"
                                                ? "Đã xác nhận"
                                                : appointment.status ===
                                                  "COMPLETED"
                                                ? "Hoàn thành"
                                                : appointment.status ===
                                                  "CANCELLED"
                                                ? "Đã hủy"
                                                : "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() =>
                                                handleDeleteAppointment(
                                                    appointment.appointmentId
                                                )
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAppointments.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        Không có lịch hẹn nào phù hợp với tìm kiếm.
                    </div>
                )}
            </main>
        </div>
    );
}
