import { CreateAppointmentDto } from "../../../src/appointments/dtos/create-appointment.dto";
import { UpdateAppointmentDto } from "../../../src/appointments/dtos/update-appointment.dto";

export const appointmentTestCases = {
    create: {
        valid: {
            input: {
                petId: "test-pet-id",
                appointmentDate: "2024-03-20T10:00:00Z",
                status: "PENDING",
            } as CreateAppointmentDto,
            expectedPet: {
                petId: "test-pet-id",
                name: "Test Pet",
                species: "Dog",
                breed: "Labrador",
                ownerId: "test-owner-id",
            },
            expectedAppointment: {
                appointmentId: "test-appointment-id",
                petId: "test-pet-id",
                appointmentDate: new Date("2024-03-20T10:00:00Z"),
                status: "PENDING",
            },
        },
        invalid: {
            nonExistentPet: {
                input: {
                    petId: "non-existent-pet-id",
                    appointmentDate: "2024-03-20T10:00:00Z",
                    status: "PENDING",
                } as CreateAppointmentDto,
            },
        },
    },
    update: {
        valid: {
            input: {
                appointmentId: "test-appointment-id",
                updateData: {
                    status: "CONFIRMED",
                } as UpdateAppointmentDto,
            },
            existingAppointment: {
                appointmentId: "test-appointment-id",
                petId: "test-pet-id",
                appointmentDate: new Date("2024-03-20T10:00:00Z"),
                status: "PENDING",
            },
            expected: {
                appointmentId: "test-appointment-id",
                petId: "test-pet-id",
                appointmentDate: new Date("2024-03-20T10:00:00Z"),
                status: "CONFIRMED",
            },
        },
        invalid: {
            nonExistentAppointment: {
                appointmentId: "non-existent-id",
                updateData: {
                    status: "CONFIRMED",
                } as UpdateAppointmentDto,
            },
        },
    },
    cancel: {
        valid: {
            appointmentId: "test-appointment-id",
            userId: "test-owner-id",
            existingAppointment: {
                appointmentId: "test-appointment-id",
                petId: "test-pet-id",
                appointmentDate: new Date("2024-03-20T10:00:00Z"),
                status: "PENDING",
                pet: {
                    ownerId: "test-owner-id",
                },
            },
            expected: {
                appointmentId: "test-appointment-id",
                status: "CANCELLED",
            },
        },
        invalid: {
            wrongOwner: {
                appointmentId: "test-appointment-id",
                userId: "wrong-owner-id",
                existingAppointment: {
                    appointmentId: "test-appointment-id",
                    petId: "test-pet-id",
                    status: "PENDING",
                    pet: {
                        ownerId: "test-owner-id",
                    },
                },
            },
            alreadyCancelled: {
                appointmentId: "test-appointment-id",
                userId: "test-owner-id",
                existingAppointment: {
                    appointmentId: "test-appointment-id",
                    petId: "test-pet-id",
                    status: "CANCELLED",
                    pet: {
                        ownerId: "test-owner-id",
                    },
                },
            },
        },
    },
    find: {
        byId: {
            valid: {
                appointmentId: "test-appointment-id",
                existingAppointment: {
                    appointmentId: "test-appointment-id",
                    petId: "test-pet-id",
                    appointmentDate: new Date("2024-03-20T10:00:00Z"),
                    status: "PENDING",
                    pet: {
                        petId: "test-pet-id",
                        name: "Test Pet",
                        species: "Dog",
                        breed: "Labrador",
                        owner: {
                            userId: "test-owner-id",
                            fullName: "Test Owner",
                            email: "owner@test.com",
                            phone: "1234567890",
                        },
                    },
                },
            },
            invalid: {
                nonExistentId: "non-existent-id",
            },
        },
        byPet: {
            valid: {
                petId: "test-pet-id",
                existingAppointments: [
                    {
                        appointmentId: "appointment-1",
                        petId: "test-pet-id",
                        appointmentDate: new Date("2024-03-20T10:00:00Z"),
                        status: "PENDING",
                    },
                    {
                        appointmentId: "appointment-2",
                        petId: "test-pet-id",
                        appointmentDate: new Date("2024-03-21T10:00:00Z"),
                        status: "CONFIRMED",
                    },
                ],
            },
        },
        byUser: {
            valid: {
                userId: "test-owner-id",
                existingAppointments: [
                    {
                        appointmentId: "appointment-1",
                        petId: "pet-1",
                        appointmentDate: new Date("2024-03-20T10:00:00Z"),
                        status: "PENDING",
                        pet: {
                            ownerId: "test-owner-id",
                        },
                    },
                    {
                        appointmentId: "appointment-2",
                        petId: "pet-2",
                        appointmentDate: new Date("2024-03-21T10:00:00Z"),
                        status: "CONFIRMED",
                        pet: {
                            ownerId: "test-owner-id",
                        },
                    },
                ],
            },
        },
    },
};
