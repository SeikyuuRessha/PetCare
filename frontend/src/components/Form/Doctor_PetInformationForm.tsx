import React, { useState, useEffect } from "react";
import {
    medicalRecordService,
    CreateMedicalRecordData,
} from "../../services/medicalRecordService";
import {
    prescriptionService,
    CreatePrescriptionData,
} from "../../services/prescriptionService";
import { medicineService, Medicine } from "../../services/medicineService";
import { toast } from "react-toastify";

interface DoctorPetInformationFormProps {
    pet: {
        id: string;
        name: string;
        owner: string;
        species: string;
        breed: string;
        imageUrl: string;
    };
    onClose: () => void;
}

export default function Doctor_PetInformationForm({
    pet,
    onClose,
}: DoctorPetInformationFormProps) {
    const [gender] = useState<"Đực" | "Cái">("Đực");
    const [health, setHealth] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [warning, setWarning] = useState("");
    const [lastExam, setLastExam] = useState("");
    const [nextExam, setNextExam] = useState("");
    const [prescriptions, setPrescriptions] = useState([
        {
            medicineId: "",
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
        },
    ]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadMedicines();
    }, []);

    const loadMedicines = async () => {
        try {
            const medicineList = await medicineService.getAll();
            setMedicines(medicineList);
        } catch (error) {
            console.error("Error loading medicines:", error);
            toast.error("Không thể tải danh sách thuốc");
        }
    };

    const handlePrescriptionChange = (
        idx: number,
        field: string,
        value: string
    ) => {
        setPrescriptions((prescriptions) =>
            prescriptions.map((item, i) =>
                i === idx ? { ...item, [field]: value } : item
            )
        );
    };
    const addPrescription = () => {
        setPrescriptions([
            ...prescriptions,
            {
                medicineId: "",
                name: "",
                dosage: "",
                frequency: "",
                duration: "",
                instructions: "",
            },
        ]);
    };

    const removePrescription = (idx: number) => {
        setPrescriptions((prescriptions) =>
            prescriptions.filter((_, i) => i !== idx)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Create medical record
            const medicalRecordData: CreateMedicalRecordData = {
                doctorId: "current-doctor-id", // TODO: Get from auth context
                appointmentId: "current-appointment-id", // TODO: Get from props/context
                diagnosis: diagnosis,
                nextCheckupDate: nextExam
                    ? new Date(nextExam).toISOString()
                    : undefined,
            };

            const medicalRecord =
                await medicalRecordService.createMedicalRecord(
                    medicalRecordData
                );

            // Create prescriptions if any
            const validPrescriptions = prescriptions.filter(
                (p) => p.medicineId && p.dosage && p.frequency && p.duration
            );

            if (validPrescriptions.length > 0) {
                const prescriptionData: CreatePrescriptionData = {
                    medicalRecordId: medicalRecord.recordId, // Use correct field name
                    instructions: `Prescriptions: ${validPrescriptions
                        .map(
                            (p) =>
                                `${p.name} - ${p.frequency} for ${p.duration} days`
                        )
                        .join("; ")}`,
                    prescriptionDetails: validPrescriptions.map((p) => ({
                        medicineId: p.medicineId,
                        dosage: p.dosage,
                        frequency: p.frequency,
                        duration: p.duration,
                        instructions: p.instructions,
                    })),
                };

                await prescriptionService.createPrescription(prescriptionData);
            }

            setSuccess("Medical record saved successfully!");
            toast.success("Lưu hồ sơ y tế thành công!");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error: any) {
            setError(error.message || "Failed to save medical record");
            toast.error("Không thể lưu hồ sơ y tế");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative w-full max-w-[90vw]">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl border border-gray-300 p-6 w-full mx-auto shadow-md max-h-[85vh] overflow-y-auto"
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left column */}
                            <div>
                                <div className="flex gap-4 mb-2">
                                    <div className="flex-1">
                                        <label className="block text-sm mb-1 font-semibold text-black">
                                            Tên thú cưng{" "}
                                            <span className="text-[#7bb12b]">
                                                *
                                            </span>
                                        </label>{" "}
                                        <input
                                            className="w-full border rounded px-3 py-2 bg-gray-200 font-bold"
                                            value={pet.name}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm mb-1 font-semibold text-black">
                                            Loài động vật{" "}
                                            <span className="text-[#7bb12b]">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            className="w-full border rounded px-3 py-2 bg-gray-200 font-bold"
                                            value={pet.species}
                                            disabled
                                        />
                                    </div>
                                </div>{" "}
                                <div className="mb-2">
                                    <label className="block text-sm mb-1 font-semibold text-black">
                                        Giống
                                    </label>
                                    <input
                                        className="w-full border rounded px-3 py-2 bg-gray-200 font-bold"
                                        value={pet.breed}
                                        disabled
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1 font-semibold text-black">
                                        Chủ sở hữu
                                    </label>
                                    <input
                                        className="w-full border rounded px-3 py-2 bg-gray-200 font-bold"
                                        value={pet.owner}
                                        disabled
                                    />
                                </div>
                                <div className="flex gap-4 mb-2">
                                    <div className="flex-1">
                                        <label className="block text-sm mb-1 font-semibold text-black">
                                            Giới tính{" "}
                                            <span className="text-[#7bb12b]">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className={`px-6 py-1 rounded-full font-semibold text-base border ${
                                                    gender === "Đực"
                                                        ? "bg-[#27d11a] text-white shadow"
                                                        : "bg-white text-black border-gray-300"
                                                }`}
                                                disabled
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
                                                disabled
                                            >
                                                Cái
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm mb-1 font-semibold text-black">
                                            Năm sinh{" "}
                                            <span className="text-[#7bb12b]">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            className="w-full border rounded px-3 py-2 bg-gray-200 font-bold"
                                            value="2022"
                                            disabled
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm mb-1 font-semibold text-black">
                                            Màu sắc lông{" "}
                                            <span className="text-[#7bb12b]">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            className="w-full border rounded px-3 py-2 bg-gray-200 font-bold"
                                            value="Nâu"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1 font-semibold text-black">
                                        Đặc điểm nhận dạng{" "}
                                        <span className="text-[#7bb12b]">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        className="w-full border rounded px-3 py-2 bg-gray-200 font-bold"
                                        value="Đuôi cong"
                                        disabled
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1 font-semibold text-black">
                                        Tên chủ nhân
                                        <span className="text-[#7bb12b]">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        className="w-full border rounded px-3 py-2 bg-gray-200 font-bold"
                                        value="Nguyễn Văn A"
                                        disabled
                                    />
                                </div>
                                {/* Editable fields */}
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">
                                        Tình trạng sức khỏe thú cưng
                                    </label>
                                    <textarea
                                        className="w-full border rounded px-3 py-2 bg-white"
                                        rows={3}
                                        value={health}
                                        onChange={(e) =>
                                            setHealth(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">
                                        Lần khám gần nhất
                                    </label>
                                    <input
                                        className="w-full border rounded px-3 py-2 bg-white"
                                        value={lastExam}
                                        onChange={(e) =>
                                            setLastExam(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">
                                        Chẩn đoán của bác sĩ
                                    </label>
                                    <textarea
                                        className="w-full border rounded px-3 py-2 bg-white"
                                        rows={2}
                                        value={diagnosis}
                                        onChange={(e) =>
                                            setDiagnosis(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">
                                        Cảnh báo của bác sĩ
                                    </label>
                                    <textarea
                                        className="w-full border rounded px-3 py-2 bg-white"
                                        rows={2}
                                        value={warning}
                                        onChange={(e) =>
                                            setWarning(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">
                                        Lịch tái khám (Nếu có)
                                    </label>
                                    <input
                                        className="w-full border rounded px-3 py-2 bg-white"
                                        value={nextExam}
                                        onChange={(e) =>
                                            setNextExam(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            {/* Right column */}
                            <div className="flex flex-col h-full">
                                <label className="block text-sm mb-1">
                                    Ảnh thú cưng
                                </label>
                                <div className="w-full border rounded px-3 py-2 min-h-[200px] flex-1">
                                    <img
                                        src="../public/images/image3.png"
                                        alt="Pet"
                                        className="w-full h-full object-cover rounded"
                                    />
                                </div>{" "}
                                <div className="flex justify-end mt-8">
                                    {error && (
                                        <div className="mr-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="mr-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
                                            {success}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        className="bg-[#7bb12b] text-white px-12 py-3 rounded-full font-semibold text-lg shadow hover:bg-[#5d990f] transition disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Saving..."
                                            : "Lưu thông tin"}
                                    </button>
                                </div>
                            </div>
                        </div>{" "}
                        {/* Prescription Table */}
                        <div className="mt-8 w-full overflow-x-auto">
                            <label className="block font-medium mb-2">
                                Đơn thuốc{" "}
                                <span className="text-green-700">*</span>
                            </label>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-[#7bb12b] text-white text-sm">
                                            <th className="px-3 py-2 border-r border-white"></th>
                                            <th className="px-3 py-2 border-r border-white">
                                                STT
                                            </th>
                                            <th className="px-3 py-2 border-r border-white">
                                                Thuốc
                                            </th>
                                            <th className="px-3 py-2 border-r border-white">
                                                Liều lượng
                                            </th>
                                            <th className="px-3 py-2 border-r border-white">
                                                Tần suất
                                            </th>
                                            <th className="px-3 py-2 border-r border-white">
                                                Thời gian (ngày)
                                            </th>
                                            <th className="px-3 py-2">
                                                Hướng dẫn
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescriptions.map((item, idx) => (
                                            <tr
                                                className="bg-white text-center"
                                                key={idx}
                                            >
                                                <td className="px-2 py-2 align-middle">
                                                    <button
                                                        type="button"
                                                        className="text-gray-400 hover:text-red-500 text-lg font-bold"
                                                        onClick={() =>
                                                            removePrescription(
                                                                idx
                                                            )
                                                        }
                                                        title="Xóa"
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                                <td className="px-3 py-2">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <select
                                                        className="w-full border rounded px-2 py-1"
                                                        value={item.medicineId}
                                                        onChange={(e) => {
                                                            const selectedMedicine =
                                                                medicines.find(
                                                                    (m) =>
                                                                        m.medicineId ===
                                                                        e.target
                                                                            .value
                                                                );
                                                            handlePrescriptionChange(
                                                                idx,
                                                                "medicineId",
                                                                e.target.value
                                                            );
                                                            handlePrescriptionChange(
                                                                idx,
                                                                "name",
                                                                selectedMedicine?.name ||
                                                                    ""
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Chọn thuốc
                                                        </option>
                                                        {medicines.map(
                                                            (medicine) => (
                                                                <option
                                                                    key={
                                                                        medicine.medicineId
                                                                    }
                                                                    value={
                                                                        medicine.medicineId
                                                                    }
                                                                >
                                                                    {
                                                                        medicine.name
                                                                    }{" "}
                                                                    {medicine.concentration &&
                                                                        `(${medicine.concentration})`}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        className="w-full border rounded px-1 py-1"
                                                        value={item.dosage}
                                                        onChange={(e) =>
                                                            handlePrescriptionChange(
                                                                idx,
                                                                "dosage",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="1 viên"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        className="w-full border rounded px-1 py-1"
                                                        value={item.frequency}
                                                        onChange={(e) =>
                                                            handlePrescriptionChange(
                                                                idx,
                                                                "frequency",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="2 lần/ngày"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        className="w-full border rounded px-1 py-1"
                                                        value={item.duration}
                                                        onChange={(e) =>
                                                            handlePrescriptionChange(
                                                                idx,
                                                                "duration",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="7"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        className="w-full border rounded px-1 py-1"
                                                        value={
                                                            item.instructions
                                                        }
                                                        onChange={(e) =>
                                                            handlePrescriptionChange(
                                                                idx,
                                                                "instructions",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Uống sau ăn"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        className="bg-[#1797a6] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#127c8a] transition"
                                        onClick={addPrescription}
                                    >
                                        Thêm thuốc
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Error and Success Messages */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                {success}
                            </div>
                        )}
                        {/* Submit Button */}
                        <div className="flex justify-center mt-6 gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-[#7bb12b] text-white rounded-lg font-semibold hover:bg-[#6ba024] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Đang lưu..." : "Lưu bệnh án"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
