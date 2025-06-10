import api from "./api";

// Payment service functions
export interface Payment {
    paymentId: string;
    totalAmount?: number;
    paymentDate?: string;
    status?: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    userId: string;
    user?: {
        userId: string;
        fullName: string;
        email: string;
        phone: string;
    };
    roomBookId?: string;
    boardingReservation?: {
        reservationId: string;
        pet: {
            petId: string;
            name: string;
            species: string;
            breed: string;
        };
        room: {
            roomId: string;
            roomNumber: number;
            price: number;
        };
    };
    serviceBookingId?: string;
    serviceBooking?: {
        bookingId: string;
        pet: {
            petId: string;
            name: string;
            species: string;
            breed: string;
        };
        serviceOption: {
            service: {
                serviceId: string;
                serviceName: string;
            };
        };
    };
}

export interface CreatePaymentData {
    totalAmount: number;
    roomBookId?: string;
    serviceBookingId?: string;
}

export const paymentService = {
    // Create new payment (USER for their own payments)
    createPayment: async (data: CreatePaymentData): Promise<Payment> => {
        const response = await api.post("/payments", data);
        return response.data.data;
    }, // Get all payments (ADMIN/EMPLOYEE can see all, USER can see their own)
    getAllPayments: async (): Promise<Payment[]> => {
        const response = await api.get("/payments");
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    }, // Get current user's payments
    getMyPayments: async (): Promise<Payment[]> => {
        const response = await api.get("/payments/my/payments");
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    },

    // Get payment by ID
    getPaymentById: async (id: string): Promise<Payment> => {
        const response = await api.get(`/payments/${id}`);
        return response.data.data;
    }, // Get payments by user ID (ADMIN/EMPLOYEE can access, USER can only access their own)
    getPaymentsByUser: async (userId: string): Promise<Payment[]> => {
        const response = await api.get(`/payments/user/${userId}`);
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    }, // Update payment (ADMIN/EMPLOYEE only)
    updatePayment: async (
        id: string,
        data: Partial<CreatePaymentData & { status?: string }>
    ): Promise<Payment> => {
        const response = await api.patch(`/payments/${id}`, data);
        return response.data.data;
    },

    // Delete payment (ADMIN only)
    deletePayment: async (id: string): Promise<void> => {
        await api.delete(`/payments/${id}`);
    },
};
