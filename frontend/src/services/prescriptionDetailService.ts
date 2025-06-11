import api from "./api";

export interface PrescriptionDetail {
    prescriptionId: string;
    medicationPackageId: string;
    prescription?: {
        id: string;
        petId: string;
        doctorId: string;
        diagnosis: string;
        notes: string;
        createdAt: string;
    };
    medicationPackage?: {
        id: string;
        medicineId: string;
        medicine: {
            id: string;
            name: string;
            description: string;
            unit: string;
        };
        packageType: string;
        quantity: number;
        instructions: string;
        pricePerPackage: number;
    };
    quantity: number;
    dosage: string;
    frequency: string;
    duration: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePrescriptionDetailDto {
    prescriptionId: string;
    packageId: string; // Changed from medicationPackageId to match backend
}

export interface PrescriptionDetailSummary {
    prescriptionId: string;
    totalItems: number;
    totalCost: number;
    medications: {
        medicineName: string;
        packageType: string;
        quantity: number;
        dosage: string;
        frequency: string;
        duration: string;
        cost: number;
    }[];
}

export const prescriptionDetailService = {
    // Create prescription detail (DOCTOR, ADMIN only)
    async create(
        data: CreatePrescriptionDetailDto
    ): Promise<PrescriptionDetail> {
        try {
            const response = await api.post("/prescription-details", data);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to create prescription detail"
            );
        }
    },

    // Get all prescription details (DOCTOR, ADMIN only)
    async getAll(): Promise<PrescriptionDetail[]> {
        try {
            const response = await api.get("/prescription-details");
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch prescription details"
            );
        }
    },

    // Get prescription details by prescription ID (DOCTOR, ADMIN only)
    async getByPrescription(
        prescriptionId: string
    ): Promise<PrescriptionDetail[]> {
        try {
            const response = await api.get(
                `/prescription-details/prescription/${prescriptionId}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch prescription details"
            );
        }
    },

    // Get prescription details by medication package ID (DOCTOR, ADMIN only)
    async getByMedicationPackage(
        packageId: string
    ): Promise<PrescriptionDetail[]> {
        try {
            const response = await api.get(
                `/prescription-details/medication-package/${packageId}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch prescription details for package"
            );
        }
    },

    // Get specific prescription detail (DOCTOR, ADMIN only)
    async getOne(
        prescriptionId: string,
        packageId: string
    ): Promise<PrescriptionDetail> {
        try {
            const response = await api.get(
                `/prescription-details/${prescriptionId}/${packageId}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch prescription detail"
            );
        }
    },

    // Delete prescription detail (ADMIN only)
    async delete(prescriptionId: string, packageId: string): Promise<void> {
        try {
            await api.delete(
                `/prescription-details/${prescriptionId}/${packageId}`
            );
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to delete prescription detail"
            );
        }
    },

    // Get prescription summary with all details
    async getPrescriptionSummary(
        prescriptionId: string
    ): Promise<PrescriptionDetailSummary> {
        try {
            const details = await this.getByPrescription(prescriptionId);

            const medications = details.map((detail) => ({
                medicineName:
                    detail.medicationPackage?.medicine?.name || "Unknown",
                packageType: detail.medicationPackage?.packageType || "Unknown",
                quantity: detail.quantity,
                dosage: detail.dosage,
                frequency: detail.frequency,
                duration: detail.duration,
                cost:
                    (detail.medicationPackage?.pricePerPackage || 0) *
                    detail.quantity,
            }));

            const totalCost = medications.reduce(
                (sum, med) => sum + med.cost,
                0
            );

            return {
                prescriptionId,
                totalItems: details.length,
                totalCost,
                medications,
            };
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to get prescription summary"
            );
        }
    },

    // Helper method to format medication instructions
    formatInstructions(detail: PrescriptionDetail): string {
        return `${detail.dosage} - ${detail.frequency} - ${detail.duration}${
            detail.notes ? ` (${detail.notes})` : ""
        }`;
    }, // Helper method to validate prescription detail data
    validatePrescriptionDetail(data: CreatePrescriptionDetailDto): string[] {
        const errors: string[] = [];

        if (!data.prescriptionId) errors.push("Prescription ID is required");
        if (!data.packageId) errors.push("Package ID is required");

        return errors;
    },
};
