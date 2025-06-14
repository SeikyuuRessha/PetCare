import { Test, TestingModule } from "@nestjs/testing";
import { ServicesService } from "../../src/services/services.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { serviceTestCases } from "./test-cases/service.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

describe("ServicesService", () => {
    let service: ServicesService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        const prismaMock = mockDeep<PrismaClient>();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ServicesService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<ServicesService>(ServicesService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a new service", async () => {
            const { createServiceDto, expectedService } = serviceTestCases.create.valid;

            prisma.service.create.mockResolvedValue(expectedService);

            const result = await service.create(createServiceDto);

            expect(prisma.service.create).toHaveBeenCalledWith({
                data: createServiceDto,
                include: {
                    serviceOptions: true,
                },
            });
            expect(result.data).toEqual(expectedService);
        });

        // NOTE: Validation for serviceName is handled at the controller layer, not in the service unit test.
    });

    describe("findAll", () => {
        it("should return all services", async () => {
            const { existingServices } = serviceTestCases.find.all.valid;

            prisma.service.findMany.mockResolvedValue(existingServices);

            const result = await service.findAll();

            expect(prisma.service.findMany).toHaveBeenCalledWith({
                include: {
                    serviceOptions: true,
                },
            });
            expect(result.data).toEqual(existingServices);
        });
    });

    describe("findOne", () => {
        it("should return a service by id", async () => {
            const { serviceId, existingService } = serviceTestCases.find.byId.valid;

            prisma.service.findUnique.mockResolvedValue(existingService);

            const result = await service.findOne(serviceId);

            expect(prisma.service.findUnique).toHaveBeenCalledWith({
                where: { serviceId },
                include: {
                    serviceOptions: true,
                },
            });
            expect(result.data).toEqual(existingService);
        });

        it("should throw an error when service is not found", async () => {
            const { serviceId } = serviceTestCases.find.byId.invalid;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(service.findOne(serviceId)).rejects.toThrow(new AppException(ExceptionCode.SERVICE_NOT_FOUND));
        });
    });

    describe("update", () => {
        it("should update a service", async () => {
            const { serviceId, updateServiceDto, existingService, expectedService } = serviceTestCases.update.valid;

            prisma.service.findUnique.mockResolvedValue(existingService);
            prisma.service.update.mockResolvedValue(expectedService);

            const result = await service.update(serviceId, updateServiceDto);

            expect(prisma.service.findUnique).toHaveBeenCalledWith({
                where: { serviceId },
            });
            expect(prisma.service.update).toHaveBeenCalledWith({
                where: { serviceId },
                data: updateServiceDto,
                include: {
                    serviceOptions: true,
                },
            });
            expect(result.data).toEqual(expectedService);
        });

        it("should throw an error when service is not found", async () => {
            const { serviceId, updateServiceDto } = serviceTestCases.update.invalid;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(service.update(serviceId, updateServiceDto)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_NOT_FOUND)
            );
            expect(prisma.service.update).not.toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should delete a service", async () => {
            const { serviceId, existingService } = serviceTestCases.delete.valid;

            prisma.service.findUnique.mockResolvedValue(existingService);
            prisma.service.delete.mockResolvedValue(existingService);

            const result = await service.remove(serviceId);

            expect(prisma.service.findUnique).toHaveBeenCalledWith({
                where: { serviceId },
            });
            expect(prisma.service.delete).toHaveBeenCalledWith({
                where: { serviceId },
            });
            expect(result.data).toEqual(existingService);
        });

        it("should throw an error when service is not found", async () => {
            const { serviceId } = serviceTestCases.delete.invalid;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(service.remove(serviceId)).rejects.toThrow(new AppException(ExceptionCode.SERVICE_NOT_FOUND));
            expect(prisma.service.delete).not.toHaveBeenCalled();
        });
    });
});
