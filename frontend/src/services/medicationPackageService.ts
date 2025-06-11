import api from "./api";

export interface MedicationPackage {
    packageId: string;
    medicineId: string;
    quantity: number;
    instruction?: string;
    medicine?: {
        medicineId: string;
        name: string;
        unit?: string;
        concentration?: string;
    };
}

export interface CreateMedicationPackageDto {
    medicineId: string;
    quantity: number;
    instruction?: string;
}

export interface UpdateMedicationPackageDto {
    medicineId?: string;
    quantity?: number;
    instruction?: string;
}

export const medicationPackageService = {
    // Create medication package (DOCTOR, ADMIN only)
    async create(data: CreateMedicationPackageDto): Promise<MedicationPackage> {
        try {
            const response = await api.post("/medication-packages", data);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to create medication package"
            );
        }
    }, // Get all medication packages (DOCTOR, ADMIN only)
    async getAll(): Promise<MedicationPackage[]> {
        try {
            const response = await api.get("/medication-packages");
            // Handle different response structures
            const data = response.data?.data || response.data;
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            console.error("Error fetching medication packages:", error);
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch medication packages"
            );
        }
    },

    // Get medication package by ID (DOCTOR, ADMIN only)
    async getById(id: string): Promise<MedicationPackage> {
        try {
            const response = await api.get(`/medication-packages/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch medication package"
            );
        }
    }, // Get medication packages by medicine ID (DOCTOR, ADMIN only)
    async getByMedicine(medicineId: string): Promise<MedicationPackage[]> {
        try {
            const response = await api.get(
                `/medication-packages/medicine/${medicineId}`
            );
            // Handle the response structure from handleService
            const data = response.data?.data || response.data;
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            console.error(
                "Error fetching medication packages for medicine:",
                error
            );
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch medication packages for medicine"
            );
        }
    },

    // Update medication package (DOCTOR, ADMIN only)
    async update(
        id: string,
        data: UpdateMedicationPackageDto
    ): Promise<MedicationPackage> {
        try {
            const response = await api.patch(
                `/medication-packages/${id}`,
                data
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to update medication package"
            );
        }
    },
    // Delete medication package (ADMIN only)
    async delete(id: string): Promise<void> {
        try {
            await api.delete(`/medication-packages/${id}`);
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to delete medication package"
            );
        }
    },

    // Helper method to format package display
    getPackageDisplayName(pkg: MedicationPackage): string {
        return `${pkg.medicine?.name} - ${pkg.quantity} ${
            pkg.medicine?.unit || "units"
        }`;
    },

    // Helper method to calculate total quantity
    calculateTotalQuantity(
        packages: { packageId: string; quantity: number }[],
        availablePackages: MedicationPackage[]
    ): number {
        return packages.reduce((total, item) => {
            const pkg = availablePackages.find(
                (p) => p.packageId === item.packageId
            );
            return total + (pkg ? pkg.quantity * item.quantity : 0);
        }, 0);
    },
};
