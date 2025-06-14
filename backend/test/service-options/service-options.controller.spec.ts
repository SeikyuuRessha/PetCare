import { Test, TestingModule } from "@nestjs/testing";
import { ServiceOptionsController } from "../../src/service-options/service-options.controller";
import { ServiceOptionsService } from "../../src/service-options/service-options.service";
import { CreateServiceOptionDto } from "../../src/service-options/dtos/create-service-option.dto";
import { UpdateServiceOptionDto } from "../../src/service-options/dtos/update-service-option.dto";
import { serviceOptionTestCases } from "./test-cases/service-option.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { ValidationPipe } from "@nestjs/common";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaService } from "../../src/prisma/prisma.service";
import { PrismaClient } from "@prisma/client";

describe("ServiceOptionsController", () => {
    let controller: ServiceOptionsController;
    let service: ServiceOptionsService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServiceOptionsController],
            providers: [
                ServiceOptionsService,
                {
                    provide: PrismaService,
                    useValue: mockDeep<PrismaClient>(),
                },
            ],
        })
            .overridePipe(ValidationPipe)
            .useValue(new ValidationPipe({ transform: true, whitelist: true }))
            .compile();

        controller = module.get<ServiceOptionsController>(ServiceOptionsController);
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

            const result = await controller.create(createServiceOptionDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
        });

        it("should validate required fields", async () => {
            const invalidDto = {} as CreateServiceOptionDto;

            await expect(controller.create(invalidDto)).rejects.toThrow();
        });

        it("should validate price is positive", async () => {
            const { createServiceOptionDto } = serviceOptionTestCases.create.invalid.negativePrice;

            await expect(controller.create(createServiceOptionDto)).rejects.toThrow();
        });

        it("should validate service exists", async () => {
            const { createServiceOptionDto } = serviceOptionTestCases.create.invalid.nonExistentService;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(controller.create(createServiceOptionDto)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_NOT_FOUND)
            );
        });
    });

    describe("findAll", () => {
        it("should return all service options", async () => {
            const { expectedResult } = serviceOptionTestCases.find.all.valid;

            prisma.serviceOption.findMany.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
        });
    });

    describe("findOne", () => {
        it("should return a service option by id", async () => {
            const { optionId, expectedResult } = serviceOptionTestCases.find.byId.valid;

            prisma.serviceOption.findUnique.mockResolvedValue(expectedResult);

            const result = await controller.findOne(optionId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
        });

        it("should throw error if service option not found", async () => {
            const { optionId } = serviceOptionTestCases.find.byId.invalid;

            prisma.serviceOption.findUnique.mockResolvedValue(null);

            await expect(controller.findOne(optionId)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND)
            );
        });
    });

    describe("findByService", () => {
        it("should return service options for a service", async () => {
            const { serviceId, expectedResult } = serviceOptionTestCases.find.byService.valid;

            prisma.service.findUnique.mockResolvedValue(expectedResult[0].service);
            prisma.serviceOption.findMany.mockResolvedValue(expectedResult);

            const result = await controller.findByService(serviceId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
        });

        it("should return empty array if no options found", async () => {
            const { serviceId, expectedResult } = serviceOptionTestCases.find.byService.empty;

            prisma.service.findUnique.mockResolvedValue(serviceOptionTestCases.create.valid.expectedResult.service);
            prisma.serviceOption.findMany.mockResolvedValue(expectedResult);

            const result = await controller.findByService(serviceId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
        });

        it("should throw error if service not found", async () => {
            const { serviceId } = serviceOptionTestCases.find.byService.invalid;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(controller.findByService(serviceId)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_NOT_FOUND)
            );
        });
    });

    describe("update", () => {
        it("should update a service option", async () => {
            const { optionId, updateServiceOptionDto, expectedResult } = serviceOptionTestCases.update.valid;

            prisma.serviceOption.findUnique.mockResolvedValue(serviceOptionTestCases.create.valid.expectedResult);
            prisma.serviceOption.update.mockResolvedValue(expectedResult);

            const result = await controller.update(optionId, updateServiceOptionDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
        });

        it("should validate price is positive", async () => {
            const { optionId, updateServiceOptionDto } = serviceOptionTestCases.update.invalid.negativePrice;

            await expect(controller.update(optionId, updateServiceOptionDto)).rejects.toThrow();
        });

        it("should throw error if service option not found", async () => {
            const { optionId, updateServiceOptionDto } = serviceOptionTestCases.update.invalid.nonExistentOption;

            prisma.serviceOption.findUnique.mockResolvedValue(null);

            await expect(controller.update(optionId, updateServiceOptionDto)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND)
            );
        });
    });

    describe("remove", () => {
        it("should remove a service option", async () => {
            const { optionId, expectedResult } = serviceOptionTestCases.delete.valid;

            prisma.serviceOption.findUnique.mockResolvedValue(expectedResult);
            prisma.serviceOption.delete.mockResolvedValue(expectedResult);

            const result = await controller.remove(optionId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedResult);
        });

        it("should throw error if service option not found", async () => {
            const { optionId } = serviceOptionTestCases.delete.invalid;

            prisma.serviceOption.findUnique.mockResolvedValue(null);

            await expect(controller.remove(optionId)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND)
            );
        });
    });
});
