import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { UpdatePaymentDto } from "./dtos/update-payment.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class PaymentsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createPaymentDto: CreatePaymentDto) {
        return handleService(async () => {
            // Check if user exists
            const user = await this.prisma.user.findUnique({
                where: { userId: createPaymentDto.userId },
            });

            if (!user) {
                throw new AppException(ExceptionCode.USER_NOT_FOUND);
            }

            // Check if room booking exists (if provided)
            if (createPaymentDto.roomBookId) {
                const reservation = await this.prisma.boardingReservation.findUnique({
                    where: { reservationId: createPaymentDto.roomBookId },
                });

                if (!reservation) {
                    throw new AppException(ExceptionCode.RESERVATION_NOT_FOUND);
                }
            }

            // Check if service booking exists (if provided)
            if (createPaymentDto.serviceBookingId) {
                const booking = await this.prisma.serviceBooking.findUnique({
                    where: { bookingId: createPaymentDto.serviceBookingId },
                });

                if (!booking) {
                    throw new AppException(ExceptionCode.BOOKING_NOT_FOUND);
                }
            }

            return this.prisma.payment.create({
                data: createPaymentDto,
                include: {
                    user: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    boardingReservation: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            room: {
                                select: {
                                    roomId: true,
                                    roomNumber: true,
                                    price: true,
                                },
                            },
                        },
                    },
                    serviceBooking: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            serviceOption: {
                                include: {
                                    service: {
                                        select: {
                                            serviceId: true,
                                            serviceName: true,
                                        },
                                    },
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
            this.prisma.payment.findMany({
                include: {
                    user: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    boardingReservation: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            room: {
                                select: {
                                    roomId: true,
                                    roomNumber: true,
                                    price: true,
                                },
                            },
                        },
                    },
                    serviceBooking: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            serviceOption: {
                                include: {
                                    service: {
                                        select: {
                                            serviceId: true,
                                            serviceName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    paymentDate: "desc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const payment = await this.prisma.payment.findUnique({
                where: { paymentId: id },
                include: {
                    user: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    boardingReservation: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            room: {
                                select: {
                                    roomId: true,
                                    roomNumber: true,
                                    price: true,
                                },
                            },
                        },
                    },
                    serviceBooking: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            serviceOption: {
                                include: {
                                    service: {
                                        select: {
                                            serviceId: true,
                                            serviceName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!payment) {
                throw new AppException(ExceptionCode.PAYMENT_NOT_FOUND);
            }

            return payment;
        });
    }

    async findByUser(userId: string) {
        return handleService(() =>
            this.prisma.payment.findMany({
                where: { userId },
                include: {
                    user: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    boardingReservation: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            room: {
                                select: {
                                    roomId: true,
                                    roomNumber: true,
                                    price: true,
                                },
                            },
                        },
                    },
                    serviceBooking: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            serviceOption: {
                                include: {
                                    service: {
                                        select: {
                                            serviceId: true,
                                            serviceName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    paymentDate: "desc",
                },
            })
        );
    }

    async update(id: string, updatePaymentDto: UpdatePaymentDto) {
        return handleService(async () => {
            const payment = await this.prisma.payment.findUnique({
                where: { paymentId: id },
            });

            if (!payment) {
                throw new AppException(ExceptionCode.PAYMENT_NOT_FOUND);
            }

            return this.prisma.payment.update({
                where: { paymentId: id },
                data: updatePaymentDto,
                include: {
                    user: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    boardingReservation: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            room: {
                                select: {
                                    roomId: true,
                                    roomNumber: true,
                                    price: true,
                                },
                            },
                        },
                    },
                    serviceBooking: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                },
                            },
                            serviceOption: {
                                include: {
                                    service: {
                                        select: {
                                            serviceId: true,
                                            serviceName: true,
                                        },
                                    },
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
            const payment = await this.prisma.payment.findUnique({
                where: { paymentId: id },
            });

            if (!payment) {
                throw new AppException(ExceptionCode.PAYMENT_NOT_FOUND);
            }

            return this.prisma.payment.delete({
                where: { paymentId: id },
            });
        });
    }
}
