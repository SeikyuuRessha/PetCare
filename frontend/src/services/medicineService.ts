import api from "./api";

// Medicine interfaces đồng bộ với backend schema
export interface Medicine {
    medicineId: string;
    name: string;
    unit?: string;
    concentration?: string;
    medicationPackages?: MedicationPackage[];
}

export interface CreateMedicineData {
    name: string;
    unit?: string;
    concentration?: string;
}

export interface UpdateMedicineData {
    name?: string;
    unit?: string;
    concentration?: string;
}

export interface MedicationPackage {
    packageId: string;
    medicineId: string;
    quantity: number;
    instruction?: string;
}

export const medicineService = {
    // Create medicine (DOCTOR, ADMIN)
    create: async (data: CreateMedicineData): Promise<Medicine> => {
        try {
            const response = await api.post("/medicines", data);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message || "Failed to create medicine"
            );
        }
    },

    // Get all medicines (DOCTOR, ADMIN)
    getAll: async (): Promise<Medicine[]> => {
        try {
            const response = await api.get("/medicines");
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message || "Failed to fetch medicines"
            );
        }
    },

    // Search medicines (DOCTOR, ADMIN)
    search: async (searchTerm: string): Promise<Medicine[]> => {
        try {
            const response = await api.get(
                `/medicines?search=${encodeURIComponent(searchTerm)}`
            );
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message || "Failed to search medicines"
            );
        }
    },

    // Get medicine by ID (DOCTOR, ADMIN)
    getById: async (id: string): Promise<Medicine> => {
        try {
            const response = await api.get(`/medicines/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message || "Failed to fetch medicine"
            );
        }
    },

    // Update medicine (DOCTOR, ADMIN)
    update: async (id: string, data: UpdateMedicineData): Promise<Medicine> => {
        try {
            const response = await api.patch(`/medicines/${id}`, data);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message || "Failed to update medicine"
            );
        }
    },

    // Delete medicine (ADMIN only)
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/medicines/${id}`);
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message || "Failed to delete medicine"
            );
        }
    },

    // Helper methods
    formatMedicineName: (medicine: Medicine): string => {
        const parts = [medicine.name];
        if (medicine.concentration) parts.push(`(${medicine.concentration})`);
        if (medicine.unit) parts.push(`- ${medicine.unit}`);
        return parts.join(" ");
    },
};
