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

            return this.prisma.appointment.create({
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
            });

            if (!appointment) {
                throw new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND);
            }

            return this.prisma.appointment.delete({
                where: { appointmentId: id },
            });
        });
    }
}
