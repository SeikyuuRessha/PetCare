import api from "./api";
import { ServiceBooking } from "./serviceBookingService";
import { BoardingReservation } from "./boardingReservationService";

export interface UserBookings {
    serviceBookings: ServiceBooking[];
    boardingReservations: BoardingReservation[];
}

export const userBookingService = {
    // Get all user's bookings (service bookings + boarding reservations) efficiently
    getMyAllBookings: async (): Promise<UserBookings> => {
        try {
            // Get user's pets first (only one API call)
            const petsResponse = await api.get("/pets/my/pets");
            const pets = petsResponse.data.data;

            if (!pets || pets.length === 0) {
                return {
                    serviceBookings: [],
                    boardingReservations: [],
                };
            }

            // Parallel fetch all bookings for all pets
            const serviceBookingPromises = pets.map(async (pet: any) => {
                try {
                    const response = await api.get(
                        `/service-bookings/pet/${pet.petId}`
                    );
                    return response.data.data || [];
                } catch (error: any) {
                    // Pet has no service bookings
                    console.log(
                        `No service bookings for pet ${pet.petId}:`,
                        error?.response?.data?.message || "No bookings"
                    );
                    return [];
                }
            });

            const boardingReservationPromises = pets.map(async (pet: any) => {
                try {
                    const response = await api.get(
                        `/boarding-reservations/pet/${pet.petId}`
                    );
                    return response.data.data || [];
                } catch (error: any) {
                    // Pet has no boarding reservations
                    console.log(
                        `No boarding reservations for pet ${pet.petId}:`,
                        error?.response?.data?.message || "No reservations"
                    );
                    return [];
                }
            });

            // Wait for all requests to complete
            const [serviceBookingResults, boardingReservationResults] =
                await Promise.all([
                    Promise.all(serviceBookingPromises),
                    Promise.all(boardingReservationPromises),
                ]);

            // Flatten and combine results
            const allServiceBookings: ServiceBooking[] =
                serviceBookingResults.flat();
            const allBoardingReservations: BoardingReservation[] =
                boardingReservationResults.flat();

            // Sort by date descending
            allServiceBookings.sort(
                (a, b) =>
                    new Date(b.bookingDate).getTime() -
                    new Date(a.bookingDate).getTime()
            );
            allBoardingReservations.sort(
                (a, b) =>
                    new Date(b.checkInDate).getTime() -
                    new Date(a.checkInDate).getTime()
            );

            return {
                serviceBookings: allServiceBookings,
                boardingReservations: allBoardingReservations,
            };
        } catch (error) {
            console.error("Failed to fetch user bookings:", error);
            throw error;
        }
    },
};
