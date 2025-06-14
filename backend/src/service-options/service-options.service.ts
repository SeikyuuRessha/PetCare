import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceOptionDto } from "./dtos/create-service-option.dto";
import { UpdateServiceOptionDto } from "./dtos/update-service-option.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";
import { Prisma } from "@prisma/client";

@Injectable()
export class ServiceOptionsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createServiceOptionDto: CreateServiceOptionDto) {
        return handleService(async () => {
            // Check if service exists
            const service = await this.prisma.service.findUnique({
                where: { serviceId: createServiceOptionDto.serviceId },
            });

            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND);
            }

            // Manual negative price validation
            if (createServiceOptionDto.price !== undefined && createServiceOptionDto.price < 0) {
                throw new AppException({ code: 400, message: "Invalid price" });
            }

            // Convert price to Decimal if provided
            const data = {
                ...createServiceOptionDto,
                price: createServiceOptionDto.price
                    ? new Prisma.Decimal(createServiceOptionDto.price.toString())
                    : undefined,
            };

            return this.prisma.serviceOption.create({
                data,
                include: {
                    service: {
                        select: {
                            serviceId: true,
                            serviceName: true,
                            description: true,
                        },
                    },
                },
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.serviceOption.findMany({
                include: {
                    service: {
                        select: {
                            serviceId: true,
                            serviceName: true,
                            description: true,
                        },
                    },
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const serviceOption = await this.prisma.serviceOption.findUnique({
                where: { optionId: id },
                include: {
                    service: {
                        select: {
                            serviceId: true,
                            serviceName: true,
                            description: true,
                        },
                    },
                },
            });

            if (!serviceOption) {
                throw new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND);
            }

            return serviceOption;
        });
    }

    async findByService(serviceId: string) {
        return handleService(async () => {
            // Check if service exists
            const service = await this.prisma.service.findUnique({
                where: { serviceId },
            });

            if (!service) {
                throw new AppException(ExceptionCode.SERVICE_NOT_FOUND);
            }

            return this.prisma.serviceOption.findMany({
                where: { serviceId },
                include: {
                    service: {
                        select: {
                            serviceId: true,
                            serviceName: true,
                            description: true,
                        },
                    },
                },
            });
        });
    }

    async update(id: string, updateServiceOptionDto: UpdateServiceOptionDto) {
        return handleService(async () => {
            const serviceOption = await this.prisma.serviceOption.findUnique({
                where: { optionId: id },
            });

            if (!serviceOption) {
                throw new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND);
            }

            // If serviceId is being updated, check if new service exists
            if (updateServiceOptionDto.serviceId) {
                const service = await this.prisma.service.findUnique({
                    where: { serviceId: updateServiceOptionDto.serviceId },
                });

                if (!service) {
                    throw new AppException(ExceptionCode.SERVICE_NOT_FOUND);
                }
            }

            // Manual negative price validation
            if (updateServiceOptionDto.price !== undefined && updateServiceOptionDto.price < 0) {
                throw new AppException({ code: 400, message: "Invalid price" });
            }

            // Convert price to Decimal if provided
            const data = {
                ...updateServiceOptionDto,
                price: updateServiceOptionDto.price
                    ? new Prisma.Decimal(updateServiceOptionDto.price.toString())
                    : undefined,
            };

            return this.prisma.serviceOption.update({
                where: { optionId: id },
                data,
                include: {
                    service: {
                        select: {
                            serviceId: true,
                            serviceName: true,
                            description: true,
                        },
                    },
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const serviceOption = await this.prisma.serviceOption.findUnique({
                where: { optionId: id },
            });

            if (!serviceOption) {
                throw new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND);
            }

            return this.prisma.serviceOption.delete({
                where: { optionId: id },
            });
        });
    }
}
