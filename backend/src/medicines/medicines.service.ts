import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMedicineDto } from "./dtos/create-medicine.dto";
import { UpdateMedicineDto } from "./dtos/update-medicine.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class MedicinesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createMedicineDto: CreateMedicineDto) {
        return handleService(() =>
            this.prisma.medicine.create({
                data: createMedicineDto,
                include: {
                    medicationPackages: true,
                },
            })
        );
    }

    async findAll() {
        return handleService(() =>
            this.prisma.medicine.findMany({
                include: {
                    medicationPackages: true,
                },
                orderBy: {
                    name: "asc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const medicine = await this.prisma.medicine.findUnique({
                where: { medicineId: id },
                include: {
                    medicationPackages: true,
                },
            });

            if (!medicine) {
                throw new AppException(ExceptionCode.MEDICINE_NOT_FOUND);
            }

            return medicine;
        });
    }

    async search(query: string) {
        return handleService(() =>
            this.prisma.medicine.findMany({
                where: {
                    OR: [
                        { name: { contains: query } },
                        { unit: { contains: query } },
                        { concentration: { contains: query } },
                    ],
                },
                include: {
                    medicationPackages: true,
                },
                orderBy: {
                    name: "asc",
                },
            })
        );
    }

    async update(id: string, updateMedicineDto: UpdateMedicineDto) {
        return handleService(async () => {
            const medicine = await this.prisma.medicine.findUnique({
                where: { medicineId: id },
            });

            if (!medicine) {
                throw new AppException(ExceptionCode.MEDICINE_NOT_FOUND);
            }

            return this.prisma.medicine.update({
                where: { medicineId: id },
                data: updateMedicineDto,
                include: {
                    medicationPackages: true,
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const medicine = await this.prisma.medicine.findUnique({
                where: { medicineId: id },
            });

            if (!medicine) {
                throw new AppException(ExceptionCode.MEDICINE_NOT_FOUND);
            }

            return this.prisma.medicine.delete({
                where: { medicineId: id },
            });
        });
    }
}
