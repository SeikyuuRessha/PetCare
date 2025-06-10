import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAppointmentDto } from "./dtos/create-appointment.dto";
import { UpdateAppointmentDto } from "./dtos/update-appointment.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class AppointmentsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createAppointmentDto: CreateAppointmentDto) {
        return handleService(async () => {
            // Check if pet exists
            const pet = await this.prisma.pet.findUnique({
                where: { petId: createAppointmentDto.petId },
            });

            if (!pet) {
                throw new AppException(ExceptionCode.PET_NOT_FOUND);
            }

            // Create the appointment
            const appointment = await this.prisma.appointment.create({
                data: {
                    ...createAppointmentDto,
                    appointmentDate: new Date(createAppointmentDto.appointmentDate),
                },
                include: {
                    pet: {
                        select: {
                            petId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

            // Using a default consultation fee of $50 (can be configured later)
            if (pet.ownerId) {
                await this.prisma.payment.create({
                    data: {
                        userId: pet.ownerId,
                        totalAmount: 50.0, // Default consultation fee
                        status: "PENDING", // PaymentStatus.PENDING
                    },
                });
            }

            return appointment;
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.appointment.findMany({
                include: {
                    pet: {
                        select: {
                            petId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    appointmentDate: "asc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const appointment = await this.prisma.appointment.findUnique({
                where: { appointmentId: id },
                include: {
                    pet: {
                        select: {
                            petId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    medicalRecord: true,
                },
            });

            if (!appointment) {
                throw new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND);
            }

            return appointment;
        });
    }

    async findByPet(petId: string) {
        return handleService(() =>
            this.prisma.appointment.findMany({
                where: { petId },
                include: {
                    pet: {
                        select: {
                            petId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    appointmentDate: "desc",
                },
            })
        );
    }

    async findByUser(userId: string) {
        return handleService(() =>
            this.prisma.appointment.findMany({
                where: {
                    pet: {
                        ownerId: userId,
                    },
                },
                include: {
                    pet: {
                        select: {
                            petId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    appointmentDate: "desc",
                },
            })
        );
    }

    async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
        return handleService(async () => {
            const appointment = await this.prisma.appointment.findUnique({
                where: { appointmentId: id },
            });

            if (!appointment) {
                throw new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND);
            }

            // Check if new pet exists (if updating petId)
            if (updateAppointmentDto.petId && updateAppointmentDto.petId !== appointment.petId) {
                const pet = await this.prisma.pet.findUnique({
                    where: { petId: updateAppointmentDto.petId },
                });

                if (!pet) {
                    throw new AppException(ExceptionCode.PET_NOT_FOUND);
                }
            }
            const updateData = { ...updateAppointmentDto };
            if (updateAppointmentDto.appointmentDate) {
                updateData.appointmentDate = updateAppointmentDto.appointmentDate;
            }

            return this.prisma.appointment.update({
                where: { appointmentId: id },
                data: updateData,
                include: {
                    pet: {
                        select: {
                            petId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const appointment = await this.prisma.appointment.findUnique({
                where: { appointmentId: id },
                include: {
                    pet: {
                        select: {
                            ownerId: true,
                        },
                    },
                },
            });

            if (!appointment) {
                throw new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND);
            }

            // Delete related payments first (payments that were created for this user around the appointment creation time)
            // Since appointments don't have direct payment links, we'll delete recent payments for the user
            if (appointment.pet.ownerId) {
                // Find and delete payments created for this user with the appointment consultation fee
                await this.prisma.payment.deleteMany({
                    where: {
                        userId: appointment.pet.ownerId,
                        totalAmount: 50.0, // Default consultation fee
                        status: "PENDING",
                        serviceBookingId: null, // Only delete payments not linked to service bookings
                        roomBookId: null, // Only delete payments not linked to room bookings
                        paymentDate: {
                            gte: new Date(appointment.createdAt || appointment.appointmentDate),
                            lte: new Date(
                                new Date(appointment.createdAt || appointment.appointmentDate).getTime() + 60000
                            ), // Within 1 minute of appointment creation
                        },
                    },
                });
            }

            return this.prisma.appointment.delete({
                where: { appointmentId: id },
            });
        });
    }

    async cancelAppointment(id: string, userId: string) {
        return handleService(async () => {
            const appointment = await this.prisma.appointment.findUnique({
                where: { appointmentId: id },
                include: {
                    pet: {
                        select: {
                            ownerId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!appointment) {
                throw new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND);
            }

            // Check if user owns this appointment's pet
            if (appointment.pet.ownerId !== userId) {
                throw new AppException(ExceptionCode.ACCESS_DENIED);
            }

            // Check if appointment is in a state that can be cancelled
            if (appointment.status !== "PENDING" && appointment.status !== "CONFIRMED") {
                throw new AppException(ExceptionCode.INVALID_OPERATION);
            }

            // Delete related pending payments
            await this.prisma.payment.deleteMany({
                where: {
                    userId: userId,
                    totalAmount: 50.0, // Default consultation fee
                    status: "PENDING",
                    serviceBookingId: null,
                    roomBookId: null,
                    paymentDate: {
                        gte: new Date(appointment.createdAt || appointment.appointmentDate),
                        lte: new Date(new Date(appointment.createdAt || appointment.appointmentDate).getTime() + 60000),
                    },
                },
            });

            // Update appointment status to CANCELLED
            return this.prisma.appointment.update({
                where: { appointmentId: id },
                data: { status: "CANCELLED" },
                include: {
                    pet: {
                        select: {
                            petId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }
}
