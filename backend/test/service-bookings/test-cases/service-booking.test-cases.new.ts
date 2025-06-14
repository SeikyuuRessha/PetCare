import { ServiceBookingStatus } from "../../../src/common/enums";

const baseServiceBooking = {
    bookingId: "booking-1",
    petId: "pet-1",
    serviceOptionId: "option-1",
    bookingDate: new Date("2024-01-15T10:00:00Z"),
    status: ServiceBookingStatus.PENDING,
    specialRequirements: "Please be gentle with my pet",
    createdAt: new Date(),
    pet: {
        petId: "pet-1",
        petName: "Buddy",
        species: "DOG",
        breed: "Golden Retriever",
    },
    serviceOption: {
        optionId: "option-1",
        optionName: "Premium Checkup",
        price: 75.0,
        duration: 45,
    },
};

export const serviceBookingTestCases = {
    create: {
        valid: {
            createServiceBookingDto: {
                petId: "pet-1",
                serviceOptionId: "option-1",
                bookingDate: "2024-01-15T10:00:00Z",
                specialRequirements: "Please be gentle with my pet",
            },
            expectedBooking: baseServiceBooking,
        },
        invalid: {
            missingPetId: {
                createServiceBookingDto: {
                    serviceOptionId: "option-1",
                    bookingDate: "2024-01-15T10:00:00Z",
                },
            },
            missingServiceOption: {
                createServiceBookingDto: {
                    petId: "pet-1",
                    bookingDate: "2024-01-15T10:00:00Z",
                },
            },
            invalidDate: {
                createServiceBookingDto: {
                    petId: "pet-1",
                    serviceOptionId: "option-1",
                    bookingDate: "invalid-date",
                },
            },
        },
    },
    find: {
        byId: {
            valid: {
                bookingId: "booking-1",
                existingBooking: baseServiceBooking,
            },
            invalid: {
                bookingId: "non-existent",
            },
        },
        byPet: {
            valid: {
                petId: "pet-1",
                existingBookings: [
                    baseServiceBooking,
                    {
                        ...baseServiceBooking,
                        bookingId: "booking-2",
                        bookingDate: new Date("2024-01-20T14:00:00Z"),
                        status: ServiceBookingStatus.COMPLETED,
                    },
                ],
            },
        },
        all: {
            valid: {
                existingBookings: [
                    baseServiceBooking,
                    {
                        ...baseServiceBooking,
                        bookingId: "booking-2",
                        petId: "pet-2",
                        status: ServiceBookingStatus.COMPLETED,
                    },
                ],
            },
        },
    },
    update: {
        valid: {
            bookingId: "booking-1",
            updateServiceBookingDto: {
                status: ServiceBookingStatus.COMPLETED,
                specialRequirements: "Updated requirements",
            },
            existingBooking: baseServiceBooking,
            expectedBooking: {
                ...baseServiceBooking,
                status: ServiceBookingStatus.COMPLETED,
                specialRequirements: "Updated requirements",
            },
        },
        invalid: {
            bookingId: "non-existent",
            updateServiceBookingDto: {
                status: ServiceBookingStatus.COMPLETED,
            },
        },
    },
    cancel: {
        valid: {
            bookingId: "booking-1",
            userId: "user-1",
            existingBooking: {
                ...baseServiceBooking,
                pet: {
                    ...baseServiceBooking.pet,
                    ownerId: "user-1",
                },
            },
        },
        invalid: {
            bookingId: "non-existent",
            userId: "user-1",
        },
        unauthorized: {
            bookingId: "booking-1",
            userId: "user-2", // Different user
            existingBooking: {
                ...baseServiceBooking,
                pet: {
                    ...baseServiceBooking.pet,
                    ownerId: "user-1", // Owned by different user
                },
            },
        },
    },
    delete: {
        valid: {
            bookingId: "booking-1",
            userId: "user-1",
            userRole: "ADMIN",
            existingBooking: baseServiceBooking,
        },
        invalid: {
            bookingId: "non-existent",
            userId: "user-1",
            userRole: "ADMIN",
        },
    },
};
