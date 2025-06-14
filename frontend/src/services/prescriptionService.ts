import api from "./api";

// Prescription interfaces
export interface PrescriptionDetail {
    prescriptionId: string;
    packageId: string;
    medicationPackage?: {
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
    };
}

export interface Prescription {
    prescriptionId: string;
    recordId: string;
    medicalRecord?: {
        recordId: string;
        doctorId: string;
        appointmentId?: string;
        diagnosis?: string;
        nextCheckupDate?: string;
        doctor?: {
            userId: string;
            fullName: string;
            username: string;
        };
        appointment?: {
            appointmentId: string;
            appointmentDate: string;
            symptoms?: string;
            pet?: {
                petId: string;
                name: string;
                species: string;
                breed?: string;
            };
        };
    };
    prescriptionDetails?: PrescriptionDetail[];
}

export interface CreatePrescriptionData {
    recordId: string; // Changed from medicalRecordId to match backend
}

export interface UpdatePrescriptionData {
    instructions?: string;
}

export const prescriptionService = {
    // Create prescription (DOCTOR, ADMIN)
    createPrescription: async (
        data: CreatePrescriptionData
    ): Promise<Prescription> => {
        const response = await api.post("/prescriptions", data);
        return response.data.data;
    },

    // Get all prescriptions (DOCTOR, ADMIN)
    getAllPrescriptions: async (): Promise<Prescription[]> => {
        const response = await api.get("/prescriptions");
        return response.data.data.items;
    },

    // Get prescription by ID (DOCTOR, ADMIN)
    getPrescriptionById: async (id: string): Promise<Prescription> => {
        const response = await api.get(`/prescriptions/${id}`);
        return response.data.data;
    }, // Get prescriptions by medical record (DOCTOR, ADMIN, pet owner)
    getPrescriptionsByMedicalRecord: async (
        medicalRecordId: string
    ): Promise<Prescription[]> => {
        const response = await api.get(
            `/prescriptions/medical-record/${medicalRecordId}`
        );
        // Handle different response structures
        const data = response.data?.data || response.data;
        return Array.isArray(data) ? data : data ? [data] : [];
    },

    // Get prescriptions by pet (DOCTOR, ADMIN, pet owner)
    getPrescriptionsByPet: async (petId: string): Promise<Prescription[]> => {
        const response = await api.get(`/prescriptions/pet/${petId}`);
        return response.data.data.items;
    },

    // Update prescription (DOCTOR, ADMIN)
    updatePrescription: async (
        id: string,
        data: UpdatePrescriptionData
    ): Promise<Prescription> => {
        const response = await api.patch(`/prescriptions/${id}`, data);
        return response.data.data;
    },

    // Delete prescription (ADMIN only)
    deletePrescription: async (id: string): Promise<void> => {
        await api.delete(`/prescriptions/${id}`);
    },
};
