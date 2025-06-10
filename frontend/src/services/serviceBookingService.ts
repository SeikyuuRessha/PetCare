import api from "./api";

// Service booking interfaces
export interface ServiceBooking {
    bookingId: string;
    petId: string;
    serviceOptionId: string;
    bookingDate: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    specialRequirements?: string;
    pet: {
        petId: string;
        name: string;
        species: string;
        breed: string;
        owner: {
            userId: string;
            fullName: string;
            phone: string;
            email: string;
        };
    };
    serviceOption: {
        optionId: string;
        optionName: string;
        price?: number;
        description?: string;
        service: {
            serviceId: string;
            serviceName: string;
            description?: string;
        };
    };
    payments?: any[];
    createdAt?: string;
}

export interface CreateServiceBookingData {
    petId: string;
    serviceOptionId: string;
    bookingDate: string;
    status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    specialRequirements?: string;
}

export interface UpdateServiceBookingData {
    petId?: string;
    serviceOptionId?: string;
    bookingDate?: string;
    status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    specialRequirements?: string;
}

export const serviceBookingService = {
    // Create new service booking (USER for their pets)
    createServiceBooking: async (
        data: CreateServiceBookingData
    ): Promise<ServiceBooking> => {
        const response = await api.post("/service-bookings", data);
        return response.data.data;
    },

    // Get all service bookings (EMPLOYEE/ADMIN can see all)
    getAllServiceBookings: async (): Promise<ServiceBooking[]> => {
        const response = await api.get("/service-bookings");
        return response.data.data;
    },

    // Get service booking by ID
    getServiceBookingById: async (id: string): Promise<ServiceBooking> => {
        const response = await api.get(`/service-bookings/${id}`);
        return response.data.data;
    },

    // Get service bookings by pet ID
    getServiceBookingsByPet: async (
        petId: string
    ): Promise<ServiceBooking[]> => {
        const response = await api.get(`/service-bookings/pet/${petId}`);
        return response.data.data;
    },

    // Update service booking (EMPLOYEE/ADMIN only)
    updateServiceBooking: async (
        id: string,
        data: UpdateServiceBookingData
    ): Promise<ServiceBooking> => {
        const response = await api.patch(`/service-bookings/${id}`, data);
        return response.data.data;
    }, // Delete service booking (ADMIN only)
    deleteServiceBooking: async (id: string): Promise<void> => {
        await api.delete(`/service-bookings/${id}`);
    },

    // Cancel service booking (Users can cancel their own bookings)
    cancelServiceBooking: async (id: string): Promise<ServiceBooking> => {
        const response = await api.patch(`/service-bookings/${id}/cancel`);
        return response.data.data;
    }, // Get current user's service bookings
    getMyServiceBookings: async (): Promise<ServiceBooking[]> => {
        try {
            // Get user's pets first
            const petsResponse = await api.get("/pets/my-pets");
            const pets = petsResponse.data.data;

            if (!pets || pets.length === 0) {
                return [];
            }

            // Get bookings for all user's pets
            const allBookings: ServiceBooking[] = [];
            for (const pet of pets) {
                try {
                    const response = await api.get(
                        `/service-bookings/pet/${pet.petId}`
                    );
                    const bookings = response.data.data;
                    if (bookings && bookings.length > 0) {
                        allBookings.push(...bookings);
                    }
                } catch (error: any) {
                    // Continue if pet has no bookings or pet not found
                    console.log(
                        `No bookings found for pet ${pet.petId}:`,
                        error?.response?.data?.message || error.message
                    );
                }
            }

            // Sort by booking date descending
            return allBookings.sort(
                (a, b) =>
                    new Date(b.bookingDate).getTime() -
                    new Date(a.bookingDate).getTime()
            );
        } catch (error) {
            console.error("Failed to fetch user service bookings:", error);
            throw error;
        }
    },
};
