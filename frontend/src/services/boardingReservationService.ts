import api from "./api";

// Boarding reservation interfaces
export interface BoardingReservation {
    reservationId: string;
    petId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status:
        | "PENDING"
        | "CONFIRMED"
        | "CHECKED_IN"
        | "CHECKED_OUT"
        | "CANCELLED";
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
    room: {
        roomId: string;
        roomNumber: number;
        capacity: number;
        price: number;
        description?: string;
    };
    payments?: any[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateBoardingReservationData {
    petId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status?:
        | "PENDING"
        | "CONFIRMED"
        | "CHECKED_IN"
        | "CHECKED_OUT"
        | "CANCELLED";
    specialRequirements?: string;
}

export interface UpdateBoardingReservationData {
    petId?: string;
    roomId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    totalAmount?: number;
    status?:
        | "PENDING"
        | "CONFIRMED"
        | "CHECKED_IN"
        | "CHECKED_OUT"
        | "CANCELLED";
    specialRequirements?: string;
}

export const boardingReservationService = {
    // Create new boarding reservation (USER for their pets)
    createBoardingReservation: async (
        data: CreateBoardingReservationData
    ): Promise<BoardingReservation> => {
        const response = await api.post("/boarding-reservations", data);
        return response.data.data;
    },

    // Get all boarding reservations (EMPLOYEE/ADMIN can see all)
    getAllBoardingReservations: async (): Promise<BoardingReservation[]> => {
        const response = await api.get("/boarding-reservations");
        return response.data.data;
    },

    // Get boarding reservation by ID
    getBoardingReservationById: async (
        id: string
    ): Promise<BoardingReservation> => {
        const response = await api.get(`/boarding-reservations/${id}`);
        return response.data.data;
    },

    // Get boarding reservations by pet ID
    getBoardingReservationsByPet: async (
        petId: string
    ): Promise<BoardingReservation[]> => {
        const response = await api.get(`/boarding-reservations/pet/${petId}`);
        return response.data.data;
    },

    // Update boarding reservation (EMPLOYEE/ADMIN only)
    updateBoardingReservation: async (
        id: string,
        data: UpdateBoardingReservationData
    ): Promise<BoardingReservation> => {
        const response = await api.patch(`/boarding-reservations/${id}`, data);
        return response.data.data;
    },

    // Delete boarding reservation (ADMIN only)
    deleteBoardingReservation: async (id: string): Promise<void> => {
        await api.delete(`/boarding-reservations/${id}`);
    },

    // Get current user's boarding reservations
    getMyBoardingReservations: async (): Promise<BoardingReservation[]> => {
        try {
            // Get all pets first and then get reservations for each pet
            const petsResponse = await api.get("/pets/my-pets");
            const pets = petsResponse.data.data;

            if (!pets || pets.length === 0) {
                return [];
            }

            // Get reservations for all user's pets
            const allReservations: BoardingReservation[] = [];
            for (const pet of pets) {
                try {
                    const reservations =
                        await boardingReservationService.getBoardingReservationsByPet(
                            pet.petId
                        );
                    allReservations.push(...reservations);
                } catch (error) {
                    // Continue if pet has no reservations
                    console.log(`No reservations found for pet ${pet.petId}`);
                }
            }

            // Sort by check-in date descending
            return allReservations.sort(
                (a, b) =>
                    new Date(b.checkInDate).getTime() -
                    new Date(a.checkInDate).getTime()
            );
        } catch (error) {
            console.error("Failed to fetch user boarding reservations:", error);
            throw error;
        }
    },
};
