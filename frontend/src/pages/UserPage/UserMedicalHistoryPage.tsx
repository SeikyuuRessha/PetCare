import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import TopBar from "../../components/layouts/TopBar";
import Footer from "../../components/layouts/Footer";
import {
    medicalRecordService,
    MedicalRecord,
} from "../../services/medicalRecordService";
import { petService, Pet } from "../../services/petService";
import {
    prescriptionService,
    Prescription,
} from "../../services/prescriptionService";

interface MedicalRecordWithPrescriptions extends MedicalRecord {
    prescriptions?: Prescription[];
}

export default function UserMedicalHistoryPage() {
    const navigate = useNavigate();
    const [medicalRecords, setMedicalRecords] = useState<
        MedicalRecordWithPrescriptions[]
    >([]);
    const [myPets, setMyPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState<string>("all");
    const [selectedRecord, setSelectedRecord] =
        useState<MedicalRecordWithPrescriptions | null>(null);

    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            // Load user's pets
            const pets = await petService.getMyPets();
            setMyPets(pets);

            // Get current user ID from token
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = userData.id;

            if (!userId) {
                navigate("/login");
                return;
            }

            // Load all medical records for the user
            const records = await medicalRecordService.getMedicalRecordsByUser(
                userId
            );

            // For each medical record, load prescriptions
            const recordsWithPrescriptions: MedicalRecordWithPrescriptions[] =
                [];
            for (const record of records) {
                try {
                    const prescriptions =
                        await prescriptionService.getPrescriptionsByMedicalRecord(
                            record.recordId
                        );
                    recordsWithPrescriptions.push({
                        ...record,
                        prescriptions: prescriptions || [],
                    });
                } catch (prescriptionError) {
                    console.log(
                        `No prescriptions found for record ${record.recordId}:`,
                        prescriptionError
                    );
                    recordsWithPrescriptions.push({
                        ...record,
                        prescriptions: [],
                    });
                }
            }

            // Sort by appointment date (newest first)
            recordsWithPrescriptions.sort((a, b) => {
                const dateA = new Date(a.appointment?.appointmentDate || 0);
                const dateB = new Date(b.appointment?.appointmentDate || 0);
                return dateB.getTime() - dateA.getTime();
            });

            setMedicalRecords(recordsWithPrescriptions);
        } catch (error: any) {
            console.error("Failed to load medical history:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = medicalRecords.filter((record) => {
        if (selectedPet === "all") return true;
        return record.appointment?.pet?.petId === selectedPet;
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return "Không xác định";
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

    const handleViewDetails = (record: MedicalRecordWithPrescriptions) => {
        setSelectedRecord(record);
    };

    return (
        <div className="font-sans bg-white min-h-screen">
            <TopBar />
            <Header />

            {/* Main Content */}
            <main className="relative z-10 px-12 pt-2 pb-12">
                <h2 className="text-2xl font-bold mt-6 mb-6">
                    Lịch sử khám bệnh thú cưng
                </h2>

                {/* Pet Filter */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        Lọc theo thú cưng:
                    </label>
                    <select
                        value={selectedPet}
                        onChange={(e) => setSelectedPet(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7bb12b]"
                    >
                        <option value="all">Tất cả thú cưng</option>
                        {myPets.map((pet) => (
                            <option key={pet.petId} value={pet.petId}>
                                {pet.name} ({pet.species})
                            </option>
                        ))}
                    </select>
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
                            {selectedPet === "all"
                                ? "Chưa có lịch sử khám bệnh nào"
                                : "Thú cưng này chưa có lịch sử khám bệnh"}
                        </div>
                        <p className="text-gray-400 mt-2">
                            Hãy đặt lịch khám để bắt đầu theo dõi sức khỏe thú
                            cưng!
                        </p>
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
                                            Thông tin khám
                                        </h3>
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Thú cưng:
                                            </span>{" "}
                                            {record.appointment?.pet?.name ||
                                                "Không xác định"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Loài:
                                            </span>{" "}
                                            {record.appointment?.pet?.species ||
                                                "Không xác định"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Ngày khám:
                                            </span>{" "}
                                            {formatDate(
                                                record.appointment
                                                    ?.appointmentDate || ""
                                            )}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Bác sĩ:
                                            </span>{" "}
                                            {record.doctor?.fullName ||
                                                "Không xác định"}
                                        </p>
                                    </div>

                                    {/* Medical Info */}
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg text-[#7bb12b]">
                                            Kết quả khám
                                        </h3>
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Triệu chứng:
                                            </span>{" "}
                                            {record.appointment?.symptoms ||
                                                "Không có"}
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
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Thuốc:
                                            </span>{" "}
                                            {record.prescriptions &&
                                            record.prescriptions.length > 0
                                                ? `${record.prescriptions.length} loại thuốc`
                                                : "Không có đơn thuốc"}
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
                                        {record.nextCheckupDate &&
                                            new Date(record.nextCheckupDate) >
                                                new Date() && (
                                                <button
                                                    onClick={() =>
                                                        navigate("/appointment")
                                                    }
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                                                >
                                                    Đặt lịch tái khám
                                                </button>
                                            )}
                                        <div className="text-xs text-gray-500 text-center">
                                            ID: {record.recordId.slice(-8)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            {selectedRecord && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedRecord(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#7bb12b]">
                                    Chi tiết hồ sơ khám bệnh
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
                                            {selectedRecord.appointment?.pet
                                                ?.name || "Không xác định"}
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
                                                Ngày khám:
                                            </span>{" "}
                                            {formatDate(
                                                selectedRecord.appointment
                                                    ?.appointmentDate || ""
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Doctor Information */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Bác sĩ điều trị
                                    </h3>
                                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
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

                                {/* Symptoms */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Triệu chứng
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p>
                                            {selectedRecord.appointment
                                                ?.symptoms ||
                                                "Không có triệu chứng cụ thể"}
                                        </p>
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

                                {/* Prescriptions */}
                                {selectedRecord.prescriptions &&
                                    selectedRecord.prescriptions.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">
                                                Đơn thuốc
                                            </h3>
                                            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                                                {selectedRecord.prescriptions.map(
                                                    (prescription, index) => (
                                                        <div
                                                            key={
                                                                prescription.prescriptionId
                                                            }
                                                            className="border-b border-blue-200 pb-3 last:border-b-0"
                                                        >
                                                            <p className="font-medium text-blue-800 mb-2">
                                                                Đơn thuốc #
                                                                {index + 1}
                                                            </p>{" "}
                                                            {prescription.prescriptionDetails &&
                                                            prescription
                                                                .prescriptionDetails
                                                                .length > 0 ? (
                                                                <div className="grid gap-2">
                                                                    {prescription.prescriptionDetails.map(
                                                                        (
                                                                            detail,
                                                                            detailIndex
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    detailIndex
                                                                                }
                                                                                className="bg-white p-3 rounded border"
                                                                            >
                                                                                <p>
                                                                                    <span className="font-medium">
                                                                                        Thuốc:
                                                                                    </span>{" "}
                                                                                    {detail
                                                                                        .medicationPackage
                                                                                        ?.medicine
                                                                                        ?.name ||
                                                                                        "Không xác định"}
                                                                                </p>
                                                                                <p>
                                                                                    <span className="font-medium">
                                                                                        Số
                                                                                        lượng
                                                                                        gói:
                                                                                    </span>{" "}
                                                                                    {detail
                                                                                        .medicationPackage
                                                                                        ?.quantity ||
                                                                                        0}
                                                                                </p>
                                                                                <p>
                                                                                    <span className="font-medium">
                                                                                        Hướng
                                                                                        dẫn:
                                                                                    </span>{" "}
                                                                                    {detail
                                                                                        .medicationPackage
                                                                                        ?.instruction ||
                                                                                        "Không có hướng dẫn cụ thể"}
                                                                                </p>
                                                                                {detail
                                                                                    .medicationPackage
                                                                                    ?.medicine
                                                                                    ?.concentration && (
                                                                                    <p>
                                                                                        <span className="font-medium">
                                                                                            Nồng
                                                                                            độ:
                                                                                        </span>{" "}
                                                                                        {
                                                                                            detail
                                                                                                .medicationPackage
                                                                                                .medicine
                                                                                                .concentration
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                                {detail
                                                                                    .medicationPackage
                                                                                    ?.medicine
                                                                                    ?.unit && (
                                                                                    <p>
                                                                                        <span className="font-medium">
                                                                                            Đơn
                                                                                            vị:
                                                                                        </span>{" "}
                                                                                        {
                                                                                            detail
                                                                                                .medicationPackage
                                                                                                .medicine
                                                                                                .unit
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-600">
                                                                    Không có chi
                                                                    tiết thuốc
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Next Checkup */}
                                {selectedRecord.nextCheckupDate && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">
                                            Lịch tái khám
                                        </h3>
                                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                            <p className="text-yellow-800">
                                                <span className="font-medium">
                                                    Ngày tái khám:
                                                </span>{" "}
                                                {formatDate(
                                                    selectedRecord.nextCheckupDate
                                                )}
                                            </p>
                                            {new Date(
                                                selectedRecord.nextCheckupDate
                                            ) > new Date() && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedRecord(null);
                                                        navigate(
                                                            "/appointment"
                                                        );
                                                    }}
                                                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                                                >
                                                    Đặt lịch tái khám
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Record ID */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Thông tin hồ sơ
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p>
                                            <span className="font-medium">
                                                Mã hồ sơ:
                                            </span>{" "}
                                            {selectedRecord.recordId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
