import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createRoomDto: CreateRoomDto) {
        return handleService(async () => {
            // Check if room number already exists
            const existingRoom = await this.prisma.room.findUnique({
                where: { roomNumber: createRoomDto.roomNumber },
            });

            if (existingRoom) {
                throw new AppException(ExceptionCode.ROOM_NUMBER_ALREADY_EXISTS);
            }

            return this.prisma.room.create({
                data: createRoomDto,
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.room.findMany({
                orderBy: {
                    roomNumber: "asc",
                },
            })
        );
    }

    async findAvailable() {
        return handleService(() =>
            this.prisma.room.findMany({
                where: {
                    status: "AVAILABLE",
                },
                orderBy: {
                    roomNumber: "asc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const room = await this.prisma.room.findUnique({
                where: { roomId: id },
                include: {
                    boardingReservations: {
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
                    },
                },
            });

            if (!room) {
                throw new AppException(ExceptionCode.ROOM_NOT_FOUND);
            }

            return room;
        });
    }

    async update(id: string, updateRoomDto: UpdateRoomDto) {
        return handleService(async () => {
            const room = await this.prisma.room.findUnique({
                where: { roomId: id },
            });

            if (!room) {
                throw new AppException(ExceptionCode.ROOM_NOT_FOUND);
            } // Check if new room number already exists (if updating roomNumber)
            if (updateRoomDto.roomNumber && updateRoomDto.roomNumber !== room.roomNumber) {
                const existingRoom = await this.prisma.room.findUnique({
                    where: { roomNumber: updateRoomDto.roomNumber },
                });

                if (existingRoom) {
                    throw new AppException(ExceptionCode.ROOM_NUMBER_ALREADY_EXISTS);
                }
            }

            return this.prisma.room.update({
                where: { roomId: id },
                data: updateRoomDto,
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const room = await this.prisma.room.findUnique({
                where: { roomId: id },
            });

            if (!room) {
                throw new AppException(ExceptionCode.ROOM_NOT_FOUND);
            }

            return this.prisma.room.delete({
                where: { roomId: id },
            });
        });
    }
}
