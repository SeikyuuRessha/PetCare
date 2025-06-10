import api from "./api";

// Appointment service functions
export interface Appointment {
    appointmentId: string; // Đổi từ id thành appointmentId để match backend
    appointmentDate: string; // Backend DateTime field
    appointmentTime?: string; // Time slot info for display (might be derived)
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    symptoms?: string; // Đổi từ reason thành symptoms để match backend
    petId: string;
    pet?: {
        petId: string; // Match backend field name
        name: string;
        species: string;
        breed?: string;
        gender?: string;
    };
    doctor?: {
        userId: string;
        fullName: string;
        username: string;
    };
    notes?: string;
    reason?: string; // Keep for backward compatibility
    createdAt?: string;
}

export interface CreateAppointmentData {
    appointmentDate: string; // ISO string datetime
    symptoms?: string; // Optional symptoms
    petId: string;
}

export const appointmentService = {
    // Create new appointment (USER)
    createAppointment: async (
        data: CreateAppointmentData
    ): Promise<Appointment> => {
        const response = await api.post("/appointments", data);
        return response.data.data;
    }, // Get all appointments (ADMIN can see all, DOCTOR can see their appointments, USER can see their pet's appointments)
    getAllAppointments: async (): Promise<Appointment[]> => {
        // For regular users, use the user-specific endpoint
        const response = await api.get("/appointments/my/appointments");
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    },

    // Get all appointments for admin/doctor (unrestricted access)
    getAllAppointmentsAdmin: async (): Promise<Appointment[]> => {
        const response = await api.get("/appointments");
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    },

    // Get appointment by ID
    getAppointmentById: async (id: string): Promise<Appointment> => {
        const response = await api.get(`/appointments/${id}`);
        return response.data.data;
    }, // Get appointments by pet ID
    getAppointmentsByPet: async (petId: string): Promise<Appointment[]> => {
        const response = await api.get(`/appointments/pet/${petId}`);
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    },

    // Update appointment (DOCTOR/ADMIN can update status and notes)
    updateAppointment: async (
        id: string,
        data: Partial<
            CreateAppointmentData & { status?: string; notes?: string }
        >
    ): Promise<Appointment> => {
        const response = await api.patch(`/appointments/${id}`, data);
        return response.data.data;
    }, // Cancel appointment
    cancelAppointment: async (id: string): Promise<Appointment> => {
        const response = await api.patch(`/appointments/${id}/cancel`);
        return response.data.data;
    },
};
