import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { UpdatePetDto } from "./dtos/update-pet.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class PetsService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createPetDto: CreatePetDto, ownerId: string) {
        return handleService(async () => {
            // Check if owner exists
            const owner = await this.prisma.user.findUnique({
                where: { userId: ownerId },
            });

            if (!owner) {
                throw new AppException(ExceptionCode.USER_NOT_FOUND);
            }

            return this.prisma.pet.create({
                data: {
                    ...createPetDto,
                    ownerId,
                },
                include: {
                    owner: {
                        select: {
                            userId: true,
                            username: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.pet.findMany({
                include: {
                    owner: {
                        select: {
                            userId: true,
                            username: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const pet = await this.prisma.pet.findUnique({
                where: { petId: id },
                include: {
                    owner: {
                        select: {
                            userId: true,
                            username: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            });

            if (!pet) {
                throw new AppException(ExceptionCode.PET_NOT_FOUND);
            }

            return pet;
        });
    }

    async findByOwner(ownerId: string) {
        return handleService(() =>
            this.prisma.pet.findMany({
                where: { ownerId },
                include: {
                    owner: {
                        select: {
                            userId: true,
                            username: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            })
        );
    }
    async update(id: string, updatePetDto: UpdatePetDto) {
        return handleService(async () => {
            const pet = await this.prisma.pet.findUnique({
                where: { petId: id },
            });

            if (!pet) {
                throw new AppException(ExceptionCode.PET_NOT_FOUND);
            }

            return this.prisma.pet.update({
                where: { petId: id },
                data: updatePetDto,
                include: {
                    owner: {
                        select: {
                            userId: true,
                            username: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const pet = await this.prisma.pet.findUnique({
                where: { petId: id },
            });

            if (!pet) {
                throw new AppException(ExceptionCode.PET_NOT_FOUND);
            }

            return this.prisma.pet.delete({
                where: { petId: id },
            });
        });
    }
}
