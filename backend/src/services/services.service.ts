import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceDto } from "./dtos/create-service.dto";
import { UpdateServiceDto } from "./dtos/update-service.dto";
import { handleService } from "../common/utils/handleService";
import { AppException, ExceptionCode } from "../common/exception/app-exception";

@Injectable()
export class ServicesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createServiceDto: CreateServiceDto) {
        return handleService(() =>
            this.prisma.service.create({
                data: createServiceDto,
                include: {
                    serviceOptions: true,
                },
            })
        );
    }

    async findAll() {
        return handleService(() =>
            this.prisma.service.findMany({
                include: {
                    serviceOptions: true,
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const service = await this.prisma.service.findUnique({
                where: { serviceId: id },
                include: {
                    serviceOptions: true,
                },
            });

            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND);
            }

            return service;
        });
    }

    async update(id: string, updateServiceDto: UpdateServiceDto) {
        return handleService(async () => {
            const service = await this.prisma.service.findUnique({
                where: { serviceId: id },
            });

            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND);
            }

            return this.prisma.service.update({
                where: { serviceId: id },
                data: updateServiceDto,
                include: {
                    serviceOptions: true,
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const service = await this.prisma.service.findUnique({
                where: { serviceId: id },
            });

            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND);
            }

            return this.prisma.service.delete({
                where: { serviceId: id },
            });
        });
    }
}
