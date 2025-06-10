import api from "./api";

// Prescription interfaces
export interface PrescriptionDetail {
    prescriptionDetailId: string;
    prescriptionId: string;
    medicineId: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    medicine?: {
        medicineId: string;
        medicineName: string;
        activeIngredient: string;
        dosageForm: string;
        strength: string;
    };
}

export interface Prescription {
    prescriptionId: string;
    medicalRecordId: string;
    doctorId: string;
    prescriptionDate: string;
    instructions?: string;
    createdAt: string;
    updatedAt: string;
    medicalRecord?: {
        medicalRecordId: string;
        petId: string;
        diagnosis: string;
        visitDate: string;
        pet?: {
            petId: string;
            name: string;
            species: string;
        };
    };
    doctor?: {
        userId: string;
        fullName: string;
        username: string;
    };
    prescriptionDetails?: PrescriptionDetail[];
}

export interface CreatePrescriptionData {
    medicalRecordId: string;
    instructions?: string;
    prescriptionDetails: {
        medicineId: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string;
    }[];
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
    },

    // Get prescriptions by medical record (DOCTOR, ADMIN, pet owner)
    getPrescriptionsByMedicalRecord: async (
        medicalRecordId: string
    ): Promise<Prescription[]> => {
        const response = await api.get(
            `/prescriptions/medical-record/${medicalRecordId}`
        );
        return response.data.data.items;
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
