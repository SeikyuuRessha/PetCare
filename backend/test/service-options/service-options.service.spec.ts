import { Test, TestingModule } from "@nestjs/testing";
import { ServiceOptionsService } from "../../src/service-options/service-options.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { serviceOptionTestCases } from "./test-cases/service-option.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";

describe("ServiceOptionsService", () => {
    let service: ServiceOptionsService;
    let prisma: DeepMockProxy<PrismaClient>;

    const mockService = {
        serviceId: "service-1",
        serviceName: "Test Service",
        description: "Test Description",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ServiceOptionsService,
                {
                    provide: PrismaService,
                    useValue: mockDeep<PrismaClient>(),
                },
            ],
        }).compile();

        service = module.get<ServiceOptionsService>(ServiceOptionsService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a service option", async () => {
            const { createServiceOptionDto, expectedResult } = serviceOptionTestCases.create.valid;

            prisma.service.findUnique.mockResolvedValue(expectedResult.service);
            prisma.serviceOption.create.mockResolvedValue(expectedResult);

            const result = await service.create(createServiceOptionDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
            expect(prisma.serviceOption.create).toHaveBeenCalledWith({
                data: {
                    ...createServiceOptionDto,
                    price: expect.any(Object), // Prisma.Decimal
                },
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

        it("should throw an error if service does not exist", async () => {
            const { createServiceOptionDto } = serviceOptionTestCases.create.invalid.nonExistentService;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(service.create(createServiceOptionDto)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_NOT_FOUND)
            );
            expect(prisma.serviceOption.create).not.toHaveBeenCalled();
        });

        it("should throw an error if price is negative", async () => {
            const { createServiceOptionDto } = serviceOptionTestCases.create.invalid.negativePrice;

            prisma.service.findUnique.mockResolvedValue(serviceOptionTestCases.create.valid.expectedResult.service);

            await expect(service.create(createServiceOptionDto)).rejects.toThrow(
                new AppException({ code: 400, message: "Invalid price" })
            );
            expect(prisma.serviceOption.create).not.toHaveBeenCalled();
        });
    });

    describe("findAll", () => {
        it("should return all service options", async () => {
            const { expectedResult } = serviceOptionTestCases.find.all.valid;

            prisma.serviceOption.findMany.mockResolvedValue(expectedResult);

            const result = await service.findAll();

            expect(prisma.serviceOption.findMany).toHaveBeenCalledWith({
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
            expect(result).toEqual({
                code: 1,
                message: "Success",
                data: expectedResult,
            });
        });
    });

    describe("findOne", () => {
        it("should return a service option by id", async () => {
            const { optionId, expectedResult } = serviceOptionTestCases.find.byId.valid;

            prisma.serviceOption.findUnique.mockResolvedValue(expectedResult);

            const result = await service.findOne(optionId);

            expect(prisma.serviceOption.findUnique).toHaveBeenCalledWith({
                where: { optionId },
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
            expect(result).toEqual({
                code: 1,
                message: "Success",
                data: expectedResult,
            });
        });

        it("should throw an error if service option not found", async () => {
            const { optionId } = serviceOptionTestCases.find.byId.invalid;

            prisma.serviceOption.findUnique.mockResolvedValue(null);

            await expect(service.findOne(optionId)).rejects.toThrow(AppException);
            expect(prisma.serviceOption.findUnique).toHaveBeenCalledWith({
                where: { optionId },
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
    });

    describe("findByService", () => {
        it("should return service options for a service", async () => {
            const { serviceId, expectedResult } = serviceOptionTestCases.find.byService.valid;

            prisma.service.findUnique.mockResolvedValue(expectedResult[0].service);
            prisma.serviceOption.findMany.mockResolvedValue(expectedResult);

            const result = await service.findByService(serviceId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
            expect(prisma.serviceOption.findMany).toHaveBeenCalledWith({
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

        it("should return empty array if no options found for service", async () => {
            const { serviceId, expectedResult } = serviceOptionTestCases.find.byService.empty;

            prisma.service.findUnique.mockResolvedValue(serviceOptionTestCases.create.valid.expectedResult.service);
            prisma.serviceOption.findMany.mockResolvedValue(expectedResult);

            const result = await service.findByService(serviceId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
            expect(prisma.serviceOption.findMany).toHaveBeenCalledWith({
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

        it("should throw an error if service does not exist", async () => {
            const { serviceId } = serviceOptionTestCases.find.byService.invalid;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(service.findByService(serviceId)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_NOT_FOUND)
            );
            expect(prisma.serviceOption.findMany).not.toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("should update a service option", async () => {
            const { optionId, updateServiceOptionDto, expectedResult } = serviceOptionTestCases.update.valid;

            prisma.serviceOption.findUnique.mockResolvedValue(serviceOptionTestCases.create.valid.expectedResult);
            prisma.serviceOption.update.mockResolvedValue(expectedResult);

            const result = await service.update(optionId, updateServiceOptionDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
            expect(prisma.serviceOption.update).toHaveBeenCalledWith({
                where: { optionId },
                data: {
                    ...updateServiceOptionDto,
                    price: expect.any(Object), // Prisma.Decimal
                },
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

        it("should throw an error if service option does not exist", async () => {
            const { optionId, updateServiceOptionDto } = serviceOptionTestCases.update.invalid.nonExistentOption;

            prisma.serviceOption.findUnique.mockResolvedValue(null);

            await expect(service.update(optionId, updateServiceOptionDto)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND)
            );
            expect(prisma.serviceOption.update).not.toHaveBeenCalled();
        });

        it("should throw an error if price is negative", async () => {
            const { optionId, updateServiceOptionDto } = serviceOptionTestCases.update.invalid.negativePrice;

            prisma.serviceOption.findUnique.mockResolvedValue(serviceOptionTestCases.create.valid.expectedResult);

            await expect(service.update(optionId, updateServiceOptionDto)).rejects.toThrow(
                new AppException({ code: 400, message: "Invalid price" })
            );
            expect(prisma.serviceOption.update).not.toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should remove a service option", async () => {
            const { optionId, expectedResult } = serviceOptionTestCases.delete.valid;

            prisma.serviceOption.findUnique.mockResolvedValue(expectedResult);
            prisma.serviceOption.delete.mockResolvedValue(expectedResult);

            const result = await service.remove(optionId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
            expect(prisma.serviceOption.delete).toHaveBeenCalledWith({
                where: { optionId },
            });
        });

        it("should throw an error if service option does not exist", async () => {
            const { optionId } = serviceOptionTestCases.delete.invalid;

            prisma.serviceOption.findUnique.mockResolvedValue(null);

            await expect(service.remove(optionId)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND)
            );
            expect(prisma.serviceOption.delete).not.toHaveBeenCalled();
        });
    });
});
