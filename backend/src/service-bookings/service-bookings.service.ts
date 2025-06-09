import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceBookingDto } from "./dtos/create-service-booking.dto";
import { UpdateServiceBookingDto } from "./dtos/update-service-booking.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class ServiceBookingsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createServiceBookingDto: CreateServiceBookingDto) {
        return handleService(async () => {
            // Check if pet exists
            const pet = await this.prisma.pet.findUnique({
                where: { petId: createServiceBookingDto.petId },
            });

            if (!pet) {
                throw new AppException(ExceptionCode.PET_NOT_FOUND);
            }

            // Check if service option exists
            const serviceOption = await this.prisma.serviceOption.findUnique({
                where: { optionId: createServiceBookingDto.serviceOptionId },
            });

            if (!serviceOption) {
                throw new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND);
            }

            return this.prisma.serviceBooking.create({
                data: {
                    ...createServiceBookingDto,
                    bookingDate: new Date(createServiceBookingDto.bookingDate),
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
                    serviceOption: {
                        include: {
                            service: {
                                select: {
                                    serviceId: true,
                                    serviceName: true,
                                    description: true,
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
            this.prisma.serviceBooking.findMany({
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
                    serviceOption: {
                        include: {
                            service: {
                                select: {
                                    serviceId: true,
                                    serviceName: true,
                                    description: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    bookingDate: "desc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const booking = await this.prisma.serviceBooking.findUnique({
                where: { bookingId: id },
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
                    serviceOption: {
                        include: {
                            service: {
                                select: {
                                    serviceId: true,
                                    serviceName: true,
                                    description: true,
                                },
                            },
                        },
                    },
                    payments: true,
                },
            });

            if (!booking) {
                throw new AppException(ExceptionCode.BOOKING_NOT_FOUND);
            }

            return booking;
        });
    }

    async findByPet(petId: string) {
        return handleService(() =>
            this.prisma.serviceBooking.findMany({
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
                    serviceOption: {
                        include: {
                            service: {
                                select: {
                                    serviceId: true,
                                    serviceName: true,
                                    description: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    bookingDate: "desc",
                },
            })
        );
    }

    async update(id: string, updateServiceBookingDto: UpdateServiceBookingDto) {
        return handleService(async () => {
            const booking = await this.prisma.serviceBooking.findUnique({
                where: { bookingId: id },
            });

            if (!booking) {
                throw new AppException(ExceptionCode.BOOKING_NOT_FOUND);
            }

            // Check if new pet exists (if updating petId)
            if (updateServiceBookingDto.petId && updateServiceBookingDto.petId !== booking.petId) {
                const pet = await this.prisma.pet.findUnique({
                    where: { petId: updateServiceBookingDto.petId },
                });

                if (!pet) {
                    throw new AppException(ExceptionCode.PET_NOT_FOUND);
                }
            }

            // Check if new service option exists (if updating serviceOptionId)
            if (
                updateServiceBookingDto.serviceOptionId &&
                updateServiceBookingDto.serviceOptionId !== booking.serviceOptionId
            ) {
                const serviceOption = await this.prisma.serviceOption.findUnique({
                    where: { optionId: updateServiceBookingDto.serviceOptionId },
                });

                if (!serviceOption) {
                    throw new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND);
                }
            }
            const updateData = { ...updateServiceBookingDto };
            if (updateServiceBookingDto.bookingDate) {
                updateData.bookingDate = updateServiceBookingDto.bookingDate;
            }

            return this.prisma.serviceBooking.update({
                where: { bookingId: id },
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
                    serviceOption: {
                        include: {
                            service: {
                                select: {
                                    serviceId: true,
                                    serviceName: true,
                                    description: true,
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
            const booking = await this.prisma.serviceBooking.findUnique({
                where: { bookingId: id },
            });

            if (!booking) {
                throw new AppException(ExceptionCode.BOOKING_NOT_FOUND);
            }

            return this.prisma.serviceBooking.delete({
                where: { bookingId: id },
            });
        });
    }
}
