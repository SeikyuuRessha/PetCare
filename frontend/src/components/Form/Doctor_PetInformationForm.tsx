import React, { useState, useEffect } from "react";
import {
    medicalRecordService,
    CreateMedicalRecordData,
} from "../../services/medicalRecordService";
import {
    prescriptionService,
    CreatePrescriptionData,
} from "../../services/prescriptionService";
import { prescriptionDetailService } from "../../services/prescriptionDetailService";
import { medicineService, Medicine } from "../../services/medicineService";
import {
    medicationPackageService,
    MedicationPackage,
    CreateMedicationPackageDto,
    UpdateMedicationPackageDto,
} from "../../services/medicationPackageService";
import { toast } from "react-toastify";
import { getUser } from "../../utils/auth";

interface DoctorPetInformationFormProps {
    pet: {
        id: string;
        name: string;
        owner: string;
        species: string;
        breed: string;
        imageUrl: string;
    };
    appointmentId?: string;
    existingMedicalRecord?: any; // Medical record to edit if exists
    onClose: () => void;
    onSuccess?: () => void; // Callback when save is successful
}

export default function Doctor_PetInformationForm({
    pet,
    appointmentId,
    existingMedicalRecord,
    onClose,
    onSuccess,
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
            packageId: "",
            name: "",
            dosage: "Theo gói thuốc",
            frequency: "Theo gói thuốc",
            duration: "Theo gói thuốc",
            instructions: "",
        },
    ]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [availablePackages, setAvailablePackages] = useState<
        MedicationPackage[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // CRUD modal states for medication packages
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [editingPackage, setEditingPackage] =
        useState<MedicationPackage | null>(null);
    const [packageForm, setPackageForm] = useState<CreateMedicationPackageDto>({
        medicineId: "",
        quantity: 0,
        instruction: "",
    });
    const [allPackages, setAllPackages] = useState<MedicationPackage[]>([]);

    useEffect(() => {
        loadMedicines();
        loadAllPackages();

        // Load existing medical record data if editing
        if (existingMedicalRecord) {
            setDiagnosis(existingMedicalRecord.diagnosis || "");
            setNextExam(
                existingMedicalRecord.nextCheckupDate
                    ? new Date(existingMedicalRecord.nextCheckupDate)
                          .toISOString()
                          .split("T")[0]
                    : ""
            );
            loadExistingPrescriptions(existingMedicalRecord);
        }
    }, [existingMedicalRecord]);

    const loadMedicines = async () => {
        try {
            const medicineList = await medicineService.getAll();
            setMedicines(medicineList);
        } catch (error) {
            console.error("Error loading medicines:", error);
            toast.error("Không thể tải danh sách thuốc");
        }
    };

    const loadAllPackages = async () => {
        try {
            const packages = await medicationPackageService.getAll();
            setAllPackages(packages);
        } catch (error) {
            console.error("Error loading medication packages:", error);
        }
    };

    const loadPackagesForMedicine = async (medicineId: string) => {
        try {
            if (medicineId) {
                const packages = await medicationPackageService.getByMedicine(
                    medicineId
                );
                setAvailablePackages(packages);
            } else {
                setAvailablePackages([]);
            }
        } catch (error) {
            console.error("Error loading medication packages:", error);
            setAvailablePackages([]);
        }
    };
    const handlePrescriptionChange = (
        idx: number,
        field: string,
        value: string
    ) => {
        setPrescriptions((prescriptions) =>
            prescriptions.map((item, i) => {
                if (i === idx) {
                    const updated = { ...item, [field]: value };

                    // If medicine changed, load packages and reset package selection
                    if (field === "medicineId") {
                        updated.packageId = "";
                        updated.dosage = "Theo gói thuốc";
                        updated.frequency = "Theo gói thuốc";
                        updated.duration = "Theo gói thuốc";
                        loadPackagesForMedicine(value);
                    }

                    // If package changed, update dosage info from package
                    if (field === "packageId") {
                        const selectedPackage = availablePackages.find(
                            (p) => p.packageId === value
                        );
                        if (selectedPackage) {
                            updated.dosage = `${selectedPackage.quantity} ${
                                selectedPackage.medicine?.unit || "units"
                            }`;
                            updated.frequency =
                                selectedPackage.instruction ||
                                "Theo chỉ định bác sĩ";
                            updated.duration = "Theo chỉ định bác sĩ";
                        }
                    }

                    return updated;
                }
                return item;
            })
        );
    };

    const addPrescription = () => {
        setPrescriptions([
            ...prescriptions,
            {
                medicineId: "",
                packageId: "",
                name: "",
                dosage: "Theo gói thuốc",
                frequency: "Theo gói thuốc",
                duration: "Theo gói thuốc",
                instructions: "",
            },
        ]);
    };
    const removePrescription = (idx: number) => {
        setPrescriptions((prescriptions) =>
            prescriptions.filter((_, i) => i !== idx)
        );
    };

    // Package CRUD handlers
    const handleCreatePackage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPackage) {
                await medicationPackageService.update(
                    editingPackage.packageId,
                    packageForm as UpdateMedicationPackageDto
                );
                setSuccess("Cập nhật gói thuốc thành công!");
            } else {
                await medicationPackageService.create(packageForm);
                setSuccess("Thêm gói thuốc thành công!");
            }

            // Reload packages
            await loadAllPackages();
            if (packageForm.medicineId) {
                await loadPackagesForMedicine(packageForm.medicineId);
            }

            resetPackageForm();
            setTimeout(() => setSuccess(""), 3000);
        } catch (error: any) {
            setError(error.message || "Failed to save package");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleEditPackage = (pkg: MedicationPackage) => {
        setEditingPackage(pkg);
        setPackageForm({
            medicineId: pkg.medicineId,
            quantity: pkg.quantity,
            instruction: pkg.instruction || "",
        });
        setShowPackageModal(true);
    };

    const handleDeletePackage = async (
        packageId: string,
        medicineId: string
    ) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa gói thuốc này?")) {
            try {
                await medicationPackageService.delete(packageId);
                setSuccess("Xóa gói thuốc thành công!");
                await loadAllPackages();
                await loadPackagesForMedicine(medicineId);
                setTimeout(() => setSuccess(""), 3000);
            } catch (error: any) {
                setError(error.message || "Failed to delete package");
                setTimeout(() => setError(""), 3000);
            }
        }
    };

    const resetPackageForm = () => {
        setShowPackageModal(false);
        setEditingPackage(null);
        setPackageForm({
            medicineId: "",
            quantity: 0,
            instruction: "",
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Get current user (doctor) from auth
            const currentUser = getUser();
            if (!currentUser || currentUser.role !== "DOCTOR") {
                setError("Bạn không có quyền tạo hồ sơ y tế");
                setLoading(false);
                return;
            }

            // Validate required fields
            if (!diagnosis.trim()) {
                setError("Vui lòng nhập chẩn đoán");
                setLoading(false);
                return;
            }

            console.log("Current user:", currentUser); // Debug log

            // Create medical record - use userId if available, fallback to id
            const doctorId = currentUser.userId || currentUser.id;
            if (!doctorId) {
                setError("Không thể xác định thông tin bác sĩ");
                setLoading(false);
                return;
            }

            const medicalRecordData: CreateMedicalRecordData = {
                doctorId: doctorId,
                appointmentId: appointmentId || undefined,
                diagnosis: diagnosis.trim(),
                nextCheckupDate: nextExam
                    ? new Date(nextExam).toISOString()
                    : undefined,
            };
            console.log("Medical record data:", medicalRecordData); // Debug log            // Step 1: Create or update medical record
            let medicalRecord;

            if (existingMedicalRecord) {
                // Update existing medical record
                console.log(
                    "Updating existing medical record:",
                    existingMedicalRecord.recordId
                );
                medicalRecord = await medicalRecordService.updateMedicalRecord(
                    existingMedicalRecord.recordId,
                    {
                        diagnosis: diagnosis.trim(),
                        nextCheckupDate: nextExam
                            ? new Date(nextExam).toISOString()
                            : undefined,
                    }
                );
                console.log("Updated medical record:", medicalRecord);
            } else {
                // Create new medical record
                try {
                    medicalRecord =
                        await medicalRecordService.createMedicalRecord(
                            medicalRecordData
                        );
                    console.log("Created medical record:", medicalRecord);
                } catch (medicalRecordError: any) {
                    console.error(
                        "Error creating medical record:",
                        medicalRecordError
                    );

                    // If it's a unique constraint error, try to update instead
                    if (
                        medicalRecordError?.response?.data?.originalError?.includes(
                            "Unique constraint failed"
                        ) ||
                        medicalRecordError?.response?.data?.message?.includes(
                            "already exists"
                        )
                    ) {
                        console.log(
                            "Medical record already exists, trying to get existing record..."
                        );

                        const allRecords =
                            await medicalRecordService.getAllMedicalRecords();
                        const existingRecord = allRecords.find(
                            (record) => record.appointmentId === appointmentId
                        );

                        if (existingRecord) {
                            medicalRecord =
                                await medicalRecordService.updateMedicalRecord(
                                    existingRecord.recordId,
                                    {
                                        diagnosis: diagnosis.trim(),
                                        nextCheckupDate: nextExam
                                            ? new Date(nextExam).toISOString()
                                            : undefined,
                                    }
                                );
                            console.log(
                                "Updated existing medical record:",
                                medicalRecord
                            );
                        } else {
                            throw new Error(
                                "Không thể tạo hoặc tìm thấy hồ sơ y tế cho cuộc hẹn này"
                            );
                        }
                    } else {
                        throw medicalRecordError;
                    }
                }
            } // Step 2: Handle prescriptions
            const validPrescriptions = prescriptions.filter(
                (p) => p.medicineId && p.packageId
            );

            if (validPrescriptions.length > 0) {
                let prescription;

                if (existingMedicalRecord?.prescription) {
                    // Update existing prescription - first delete all existing prescription details
                    console.log(
                        "Updating existing prescription:",
                        existingMedicalRecord.prescription.prescriptionId
                    );

                    try {
                        // Get existing prescription details
                        const existingDetails =
                            await prescriptionDetailService.getByPrescription(
                                existingMedicalRecord.prescription
                                    .prescriptionId
                            );
                        // Delete existing prescription details
                        for (const detail of existingDetails) {
                            await prescriptionDetailService.delete(
                                detail.prescriptionId,
                                detail.medicationPackage?.id || ""
                            );
                        }

                        prescription = existingMedicalRecord.prescription;
                    } catch (error) {
                        console.error(
                            "Error updating existing prescription:",
                            error
                        );
                        // If error, try to create new prescription
                        const prescriptionData = {
                            recordId: medicalRecord.recordId,
                        };
                        prescription =
                            await prescriptionService.createPrescription(
                                prescriptionData
                            );
                    }
                } else {
                    // Create new prescription
                    const prescriptionData = {
                        recordId: medicalRecord.recordId,
                    };

                    console.log(
                        "Creating prescription with data:",
                        prescriptionData
                    );
                    prescription = await prescriptionService.createPrescription(
                        prescriptionData
                    );
                    console.log("Created prescription:", prescription);
                }

                // Step 3: Create prescription details for each selected package
                for (const p of validPrescriptions) {
                    const prescriptionDetailData = {
                        prescriptionId: prescription.prescriptionId,
                        packageId: p.packageId,
                    };

                    console.log(
                        "Creating prescription detail:",
                        prescriptionDetailData
                    );
                    await prescriptionDetailService.create(
                        prescriptionDetailData
                    );
                }
            } else if (existingMedicalRecord?.prescription) {
                // If no valid prescriptions but had existing prescription, delete all prescription details
                console.log(
                    "Removing all prescriptions for existing medical record"
                );
                try {
                    const existingDetails =
                        await prescriptionDetailService.getByPrescription(
                            existingMedicalRecord.prescription.prescriptionId
                        );
                    for (const detail of existingDetails) {
                        await prescriptionDetailService.delete(
                            detail.prescriptionId,
                            detail.medicationPackage?.id || ""
                        );
                    }
                } catch (error) {
                    console.error(
                        "Error removing existing prescriptions:",
                        error
                    );
                }
            }
            const successMessage = existingMedicalRecord
                ? "Medical record updated successfully!"
                : "Medical record created successfully!";
            const toastMessage = existingMedicalRecord
                ? "Cập nhật hồ sơ y tế thành công!"
                : "Tạo hồ sơ y tế thành công!";
            setSuccess(successMessage);
            toast.success(toastMessage);

            // Call onSuccess callback to reload data
            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error: any) {
            console.error("Error creating medical record:", error);
            console.error("Error response:", error.response?.data);

            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to save medical record";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const loadExistingPrescriptions = async (medicalRecord: any) => {
        try {
            if (medicalRecord?.prescription) {
                console.log(
                    "Loading existing prescriptions for medical record:",
                    medicalRecord.recordId
                );

                // Get prescription details for this medical record
                const prescriptionDetails =
                    await prescriptionDetailService.getByPrescription(
                        medicalRecord.prescription.prescriptionId
                    );

                console.log(
                    "Found existing prescription details:",
                    prescriptionDetails
                );
                // Convert prescription details to form format
                const existingPrescriptions = prescriptionDetails.map(
                    (detail) => ({
                        medicineId: detail.medicationPackage?.medicineId || "",
                        packageId: detail.medicationPackage?.id || "",
                        name: detail.medicationPackage?.medicine?.name || "",
                        dosage: `${detail.medicationPackage?.quantity || 0} ${
                            detail.medicationPackage?.medicine?.unit || "units"
                        }`,
                        frequency:
                            detail.medicationPackage?.instructions ||
                            "Theo chỉ định bác sĩ",
                        duration: "Theo gói thuốc",
                        instructions: "",
                    })
                );

                if (existingPrescriptions.length > 0) {
                    setPrescriptions(existingPrescriptions);
                } else {
                    // If no existing prescriptions, keep default empty one
                    setPrescriptions([
                        {
                            medicineId: "",
                            packageId: "",
                            name: "",
                            dosage: "Theo gói thuốc",
                            frequency: "Theo gói thuốc",
                            duration: "Theo gói thuốc",
                            instructions: "",
                        },
                    ]);
                }
            }
        } catch (error) {
            console.error("Error loading existing prescriptions:", error);
            // If there's an error, keep default prescription state
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
                            <div className="flex justify-between items-center mb-2">
                                <label className="block font-medium">
                                    Đơn thuốc{" "}
                                    <span className="text-green-700">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPackageModal(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                >
                                    Quản lý gói thuốc
                                </button>
                            </div>
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
                                                Gói thuốc
                                            </th>
                                            <th className="px-3 py-2">
                                                Hướng dẫn thêm
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
                                                    </select>{" "}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <select
                                                        className="w-full border rounded px-2 py-1"
                                                        value={item.packageId}
                                                        onChange={(e) => {
                                                            handlePrescriptionChange(
                                                                idx,
                                                                "packageId",
                                                                e.target.value
                                                            );
                                                        }}
                                                        disabled={
                                                            !item.medicineId
                                                        }
                                                    >
                                                        <option value="">
                                                            {item.medicineId
                                                                ? "Chọn gói thuốc"
                                                                : "Chọn thuốc trước"}
                                                        </option>
                                                        {item.medicineId &&
                                                            availablePackages
                                                                .filter(
                                                                    (pkg) =>
                                                                        pkg.medicineId ===
                                                                        item.medicineId
                                                                )
                                                                .map((pkg) => (
                                                                    <option
                                                                        key={
                                                                            pkg.packageId
                                                                        }
                                                                        value={
                                                                            pkg.packageId
                                                                        }
                                                                    >
                                                                        {
                                                                            pkg.quantity
                                                                        }{" "}
                                                                        {pkg
                                                                            .medicine
                                                                            ?.unit ||
                                                                            "units"}
                                                                        {pkg.instruction &&
                                                                            ` - ${pkg.instruction}`}
                                                                    </option>
                                                                ))}{" "}
                                                    </select>
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
                                                        placeholder="Ghi chú thêm (nếu có)"
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
                            </button>{" "}
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-[#7bb12b] text-white rounded-lg font-semibold hover:bg-[#6ba024] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Đang lưu..."
                                    : existingMedicalRecord
                                    ? "Cập nhật bệnh án"
                                    : "Tạo bệnh án"}
                            </button>{" "}
                        </div>
                    </form>
                </div>
            </div>

            {/* Package Management Modal */}
            {showPackageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Quản lý gói thuốc
                            </h2>
                            <button
                                onClick={resetPackageForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Package Form */}
                        <form
                            onSubmit={handleCreatePackage}
                            className="mb-6 p-4 bg-gray-50 rounded-lg"
                        >
                            <h3 className="text-lg font-medium mb-4">
                                {editingPackage
                                    ? "Chỉnh sửa gói thuốc"
                                    : "Thêm gói thuốc mới"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Thuốc *
                                    </label>
                                    <select
                                        required
                                        value={packageForm.medicineId}
                                        onChange={(e) =>
                                            setPackageForm({
                                                ...packageForm,
                                                medicineId: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg"
                                        disabled={!!editingPackage}
                                    >
                                        <option value="">Chọn thuốc</option>
                                        {medicines.map((medicine) => (
                                            <option
                                                key={medicine.medicineId}
                                                value={medicine.medicineId}
                                            >
                                                {medicineService.formatMedicineName(
                                                    medicine
                                                )}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Số lượng trong gói *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={packageForm.quantity}
                                        onChange={(e) =>
                                            setPackageForm({
                                                ...packageForm,
                                                quantity: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Hướng dẫn sử dụng
                                    </label>
                                    <input
                                        type="text"
                                        value={packageForm.instruction}
                                        onChange={(e) =>
                                            setPackageForm({
                                                ...packageForm,
                                                instruction: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Ví dụ: Uống sau ăn"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={resetPackageForm}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingPackage ? "Cập nhật" : "Thêm"}
                                </button>
                            </div>
                        </form>

                        {/* Existing Packages List */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">
                                Danh sách gói thuốc hiện có
                            </h3>
                            <div className="space-y-4 max-h-64 overflow-y-auto">
                                {medicines.map((medicine) => {
                                    const medicinePackages = allPackages.filter(
                                        (pkg) =>
                                            pkg.medicineId ===
                                            medicine.medicineId
                                    );
                                    if (medicinePackages.length === 0)
                                        return null;

                                    return (
                                        <div key={medicine.medicineId}>
                                            <h4 className="font-medium text-gray-800 mb-2">
                                                {medicine.name}{" "}
                                                {medicine.concentration &&
                                                    `(${medicine.concentration})`}
                                            </h4>
                                            {medicinePackages.map((pkg) => (
                                                <div
                                                    key={pkg.packageId}
                                                    className="bg-white p-3 rounded border flex justify-between items-center"
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {pkg.quantity}{" "}
                                                            {pkg.medicine
                                                                ?.unit ||
                                                                medicine.unit ||
                                                                "units"}
                                                        </div>
                                                        {pkg.instruction && (
                                                            <div className="text-sm text-gray-600">
                                                                {
                                                                    pkg.instruction
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEditPackage(
                                                                    pkg
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeletePackage(
                                                                    pkg.packageId,
                                                                    medicine.medicineId
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                                {allPackages.length === 0 && (
                                    <div className="text-center py-8 text-gray-600">
                                        Chưa có gói thuốc nào
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
