import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    medicalRecordService,
    MedicalRecord,
} from "../../services/medicalRecordService";
import { getUser } from "../../utils/auth";

interface MedicalRecordHistory extends MedicalRecord {
    petName?: string;
    ownerName?: string;
    appointmentDate?: string;
    symptoms?: string;
}

export default function DoctorHistoryPage() {
    const navigate = useNavigate();
    const [medicalRecords, setMedicalRecords] = useState<
        MedicalRecordHistory[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] =
        useState<MedicalRecordHistory | null>(null);

    useEffect(() => {
        loadDoctorHistory();
    }, []);
    const loadDoctorHistory = async () => {
        try {
            setLoading(true);
            const currentUser = getUser();

            if (!currentUser) {
                navigate("/login");
                return;
            }

            // Get medical records for current doctor using the specific endpoint
            const doctorRecords =
                await medicalRecordService.getMedicalRecordsByDoctor(
                    currentUser.id
                );

            if (!doctorRecords || !Array.isArray(doctorRecords)) {
                setMedicalRecords([]);
                return;
            }

            // Transform records to include additional info
            const historyRecords: MedicalRecordHistory[] = doctorRecords.map(
                (record) => ({
                    ...record,
                    petName: record.appointment?.pet?.name || "Không xác định",
                    ownerName:
                        record.appointment?.pet?.owner?.fullName ||
                        "Không xác định",
                    appointmentDate:
                        record.appointment?.appointmentDate || "Không xác định",
                    symptoms:
                        record.appointment?.symptoms || "Không có triệu chứng",
                })
            );

            // Sort by appointment date (newest first)
            historyRecords.sort((a, b) => {
                const dateA = new Date(a.appointmentDate || 0);
                const dateB = new Date(b.appointmentDate || 0);
                return dateB.getTime() - dateA.getTime();
            });

            setMedicalRecords(historyRecords);
        } catch (error: any) {
            console.error("Failed to load doctor history:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = medicalRecords.filter(
        (record) =>
            record.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.diagnosis
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            record.appointmentDate
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "Không xác định")
            return "Không xác định";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "Không xác định";
        }
    };

    const handleViewDetails = (record: MedicalRecordHistory) => {
        setSelectedRecord(record);
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

            {/* Main Content */}
            <main className="px-4 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        LỊCH SỬ KHÁM BỆNH
                    </h1>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên thú cưng, chẩn đoán..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bb12b]"
                            />
                            <svg
                                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7bb12b]"></div>
                            <span className="ml-3 text-lg">
                                Đang tải lịch sử...
                            </span>
                        </div>
                    ) : filteredRecords.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">
                                {searchTerm
                                    ? "Không tìm thấy kết quả phù hợp"
                                    : "Chưa có lịch sử khám bệnh nào"}
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredRecords.map((record) => (
                                <div
                                    key={record.recordId}
                                    className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Pet Info */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg text-[#7bb12b]">
                                                Thông tin thú cưng
                                            </h3>
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    Tên:
                                                </span>{" "}
                                                {record.petName}
                                            </p>{" "}
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    Loài:
                                                </span>{" "}
                                                {record.appointment?.pet
                                                    ?.species ||
                                                    "Không xác định"}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    Ngày khám:
                                                </span>{" "}
                                                {formatDate(
                                                    record.appointmentDate || ""
                                                )}
                                            </p>
                                        </div>

                                        {/* Medical Info */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg text-[#7bb12b]">
                                                Thông tin y tế
                                            </h3>
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    Triệu chứng:
                                                </span>{" "}
                                                {record.symptoms}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    Chẩn đoán:
                                                </span>{" "}
                                                {record.diagnosis ||
                                                    "Chưa có chẩn đoán"}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    Tái khám:
                                                </span>{" "}
                                                {record.nextCheckupDate
                                                    ? formatDate(
                                                          record.nextCheckupDate
                                                      )
                                                    : "Không cần tái khám"}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col justify-center space-y-2">
                                            <button
                                                onClick={() =>
                                                    handleViewDetails(record)
                                                }
                                                className="bg-[#7bb12b] text-white px-4 py-2 rounded-lg hover:bg-[#6aa11e] transition font-medium"
                                            >
                                                Xem chi tiết
                                            </button>
                                            <div className="text-xs text-gray-500 text-center">
                                                ID: {record.recordId.slice(-8)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Detail Modal */}
            {selectedRecord && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedRecord(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#7bb12b]">
                                    Chi tiết hồ sơ y tế
                                </h2>
                                <button
                                    onClick={() => setSelectedRecord(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Record ID */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Mã hồ sơ
                                    </h3>
                                    <p className="text-gray-600">
                                        {selectedRecord.recordId}
                                    </p>
                                </div>{" "}
                                {/* Pet Information */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Thông tin thú cưng
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <p>
                                            <span className="font-medium">
                                                Tên:
                                            </span>{" "}
                                            {selectedRecord.petName}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Loài:
                                            </span>{" "}
                                            {selectedRecord.appointment?.pet
                                                ?.species || "Không xác định"}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Giống:
                                            </span>{" "}
                                            {selectedRecord.appointment?.pet
                                                ?.breed || "Không xác định"}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Chủ sở hữu:
                                            </span>{" "}
                                            {selectedRecord.ownerName}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Ngày khám:
                                            </span>{" "}
                                            {formatDate(
                                                selectedRecord.appointmentDate ||
                                                    ""
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {/* Symptoms */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Triệu chứng
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p>{selectedRecord.symptoms}</p>
                                    </div>
                                </div>
                                {/* Diagnosis */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Chẩn đoán
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p>
                                            {selectedRecord.diagnosis ||
                                                "Chưa có chẩn đoán"}
                                        </p>
                                    </div>
                                </div>
                                {/* Next Checkup */}
                                {selectedRecord.nextCheckupDate && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">
                                            Lịch tái khám
                                        </h3>
                                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                            <p className="text-yellow-800">
                                                {formatDate(
                                                    selectedRecord.nextCheckupDate
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {/* Doctor Information */}
                                <div>
                                    {" "}
                                    <h3 className="font-semibold text-lg mb-2">
                                        Bác sĩ điều trị
                                    </h3>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p>
                                            <span className="font-medium">
                                                Tên:
                                            </span>{" "}
                                            {selectedRecord.doctor?.fullName ||
                                                "Không xác định"}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Username:
                                            </span>{" "}
                                            {selectedRecord.doctor?.username ||
                                                "Không có"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
