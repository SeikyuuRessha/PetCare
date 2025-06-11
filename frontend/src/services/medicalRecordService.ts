import api from "./api";

// Medical Record interfaces
export interface MedicalRecord {
    recordId: string; // Match backend field name
    doctorId: string;
    appointmentId?: string;
    diagnosis?: string; // Optional in backend
    nextCheckupDate?: string; // Backend field
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
        };
    };
}

export interface CreateMedicalRecordData {
    doctorId: string;
    appointmentId?: string;
    diagnosis?: string;
    nextCheckupDate?: string; // ISO date string
}

export interface UpdateMedicalRecordData {
    doctorId?: string;
    diagnosis?: string;
    nextCheckupDate?: string;
}

export const medicalRecordService = {
    // Create medical record (DOCTOR, ADMIN)
    createMedicalRecord: async (
        data: CreateMedicalRecordData
    ): Promise<MedicalRecord> => {
        const response = await api.post("/medical-records", data);
        return response.data.data;
    }, // Get all medical records (DOCTOR, ADMIN)
    getAllMedicalRecords: async (): Promise<MedicalRecord[]> => {
        const response = await api.get("/medical-records");
        // Handle the response structure from handleService
        return response.data.data || [];
    },

    // Get medical record by ID (DOCTOR, ADMIN)
    getMedicalRecordById: async (id: string): Promise<MedicalRecord> => {
        const response = await api.get(`/medical-records/${id}`);
        return response.data.data;
    }, // Get medical records by pet ID (DOCTOR, ADMIN, pet owner)
    getMedicalRecordsByPet: async (petId: string): Promise<MedicalRecord[]> => {
        const response = await api.get(`/medical-records/pet/${petId}`);
        return response.data.data || [];
    },

    // Get medical records by appointment ID
    getMedicalRecordsByAppointment: async (
        appointmentId: string
    ): Promise<MedicalRecord[]> => {
        const response = await api.get(
            `/medical-records/appointment/${appointmentId}`
        );
        return response.data.data || [];
    },

    // Update medical record (DOCTOR, ADMIN)
    updateMedicalRecord: async (
        id: string,
        data: UpdateMedicalRecordData
    ): Promise<MedicalRecord> => {
        const response = await api.patch(`/medical-records/${id}`, data);
        return response.data.data;
    },

    // Delete medical record (ADMIN only)
    deleteMedicalRecord: async (id: string): Promise<void> => {
        await api.delete(`/medical-records/${id}`);
    },
};
