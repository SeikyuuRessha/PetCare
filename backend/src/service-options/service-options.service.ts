import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceOptionDto } from "./dtos/create-service-option.dto";
import { UpdateServiceOptionDto } from "./dtos/update-service-option.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

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

            return this.prisma.serviceOption.create({
                data: createServiceOptionDto,
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
        return handleService(() =>
            this.prisma.serviceOption.findMany({
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
            })
        );
    }

    async update(id: string, updateServiceOptionDto: UpdateServiceOptionDto) {
        return handleService(async () => {
            const serviceOption = await this.prisma.serviceOption.findUnique({
                where: { optionId: id },
            });

            if (!serviceOption) {
                throw new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND);
            }

            // Check if new service exists (if updating serviceId)
            if (updateServiceOptionDto.serviceId && updateServiceOptionDto.serviceId !== serviceOption.serviceId) {
                const service = await this.prisma.service.findUnique({
                    where: { serviceId: updateServiceOptionDto.serviceId },
                });

                if (!service) {
                    throw new AppException(ExceptionCode.SERVICE_NOT_FOUND);
                }
            }

            return this.prisma.serviceOption.update({
                where: { optionId: id },
                data: updateServiceOptionDto,
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
