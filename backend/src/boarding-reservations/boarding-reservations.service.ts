import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBoardingReservationDto } from "./dtos/create-boarding-reservation.dto";
import { UpdateBoardingReservationDto } from "./dtos/update-boarding-reservation.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class BoardingReservationsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createBoardingReservationDto: CreateBoardingReservationDto) {
        return handleService(async () => {
            // Check if pet exists
            const pet = await this.prisma.pet.findUnique({
                where: { petId: createBoardingReservationDto.petId },
            });

            if (!pet) {
                throw new AppException(ExceptionCode.PET_NOT_FOUND);
            }

            // Check if room exists
            const room = await this.prisma.room.findUnique({
                where: { roomId: createBoardingReservationDto.roomId },
            });

            if (!room) {
                throw new AppException(ExceptionCode.ROOM_NOT_FOUND);
            }

            // Check if room is available for the dates
            const checkInDate = new Date(createBoardingReservationDto.checkInDate);
            const checkOutDate = new Date(createBoardingReservationDto.checkOutDate);

            const conflictingReservations = await this.prisma.boardingReservation.findMany({
                where: {
                    roomId: createBoardingReservationDto.roomId,
                    status: {
                        in: ["CONFIRMED", "CHECKED_IN"],
                    },
                    OR: [
                        {
                            checkInDate: {
                                lte: checkOutDate,
                            },
                            checkOutDate: {
                                gte: checkInDate,
                            },
                        },
                    ],
                },
            });

            if (conflictingReservations.length > 0) {
                throw new AppException(ExceptionCode.ROOM_NOT_AVAILABLE);
            }

            return this.prisma.boardingReservation.create({
                data: {
                    ...createBoardingReservationDto,
                    checkInDate,
                    checkOutDate,
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
                    room: {
                        select: {
                            roomId: true,
                            roomNumber: true,
                            capacity: true,
                            price: true,
                            description: true,
                        },
                    },
                },
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.boardingReservation.findMany({
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
                    room: {
                        select: {
                            roomId: true,
                            roomNumber: true,
                            capacity: true,
                            price: true,
                            description: true,
                        },
                    },
                },
                orderBy: {
                    checkInDate: "desc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const reservation = await this.prisma.boardingReservation.findUnique({
                where: { reservationId: id },
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
                    room: {
                        select: {
                            roomId: true,
                            roomNumber: true,
                            capacity: true,
                            price: true,
                            description: true,
                        },
                    },
                    payments: true,
                },
            });

            if (!reservation) {
                throw new AppException(ExceptionCode.RESERVATION_NOT_FOUND);
            }

            return reservation;
        });
    }

    async findByPet(petId: string) {
        return handleService(() =>
            this.prisma.boardingReservation.findMany({
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
                    room: {
                        select: {
                            roomId: true,
                            roomNumber: true,
                            capacity: true,
                            price: true,
                            description: true,
                        },
                    },
                },
                orderBy: {
                    checkInDate: "desc",
                },
            })
        );
    }

    async update(id: string, updateBoardingReservationDto: UpdateBoardingReservationDto) {
        return handleService(async () => {
            const reservation = await this.prisma.boardingReservation.findUnique({
                where: { reservationId: id },
            });

            if (!reservation) {
                throw new AppException(ExceptionCode.RESERVATION_NOT_FOUND);
            }

            // Validate new dates if provided
            if (updateBoardingReservationDto.checkInDate || updateBoardingReservationDto.checkOutDate) {
                const checkInDate = updateBoardingReservationDto.checkInDate
                    ? new Date(updateBoardingReservationDto.checkInDate)
                    : reservation.checkInDate;
                const checkOutDate = updateBoardingReservationDto.checkOutDate
                    ? new Date(updateBoardingReservationDto.checkOutDate)
                    : reservation.checkOutDate;

                // Check for conflicts (excluding current reservation)
                const conflictingReservations = await this.prisma.boardingReservation.findMany({
                    where: {
                        roomId: updateBoardingReservationDto.roomId || reservation.roomId,
                        reservationId: { not: id },
                        status: {
                            in: ["CONFIRMED", "CHECKED_IN"],
                        },
                        OR: [
                            {
                                checkInDate: {
                                    lte: checkOutDate,
                                },
                                checkOutDate: {
                                    gte: checkInDate,
                                },
                            },
                        ],
                    },
                });

                if (conflictingReservations.length > 0) {
                    throw new AppException(ExceptionCode.ROOM_NOT_AVAILABLE);
                }
            }
            const updateData = { ...updateBoardingReservationDto };
            if (updateBoardingReservationDto.checkInDate) {
                updateData.checkInDate = updateBoardingReservationDto.checkInDate;
            }
            if (updateBoardingReservationDto.checkOutDate) {
                updateData.checkOutDate = updateBoardingReservationDto.checkOutDate;
            }

            return this.prisma.boardingReservation.update({
                where: { reservationId: id },
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
                    room: {
                        select: {
                            roomId: true,
                            roomNumber: true,
                            capacity: true,
                            price: true,
                            description: true,
                        },
                    },
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const reservation = await this.prisma.boardingReservation.findUnique({
                where: { reservationId: id },
            });

            if (!reservation) {
                throw new AppException(ExceptionCode.RESERVATION_NOT_FOUND);
            }

            return this.prisma.boardingReservation.delete({
                where: { reservationId: id },
            });
        });
    }
}
