import { Test, TestingModule } from "@nestjs/testing";
import { ServicesController } from "../../src/services/services.controller";
import { ServicesService } from "../../src/services/services.service";
import { CreateServiceDto } from "../../src/services/dtos/create-service.dto";
import { UpdateServiceDto } from "../../src/services/dtos/update-service.dto";
import { serviceTestCases } from "./test-cases/service.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { CustomValidationPipe } from "../../src/common/pipes/custom-validation.pipe";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaService } from "../../src/prisma/prisma.service";
import { PrismaClient } from "@prisma/client";
import { ArgumentMetadata } from "@nestjs/common";

// Helper function to manually validate DTOs in tests
async function validateDto<T>(dto: any, metatype: new () => T): Promise<T> {
    const validationPipe = new CustomValidationPipe();
    const metadata: ArgumentMetadata = {
        type: "body",
        metatype,
        data: "",
    };
    return await validationPipe.transform(dto, metadata);
}

describe("ServicesController", () => {
    let controller: ServicesController;
    let service: ServicesService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServicesController],
            providers: [
                ServicesService,
                {
                    provide: PrismaService,
                    useValue: mockDeep<PrismaClient>(),
                },
            ],
        })
            .overridePipe(CustomValidationPipe)
            .useValue(new CustomValidationPipe())
            .compile();

        controller = module.get<ServicesController>(ServicesController);
        service = module.get<ServicesService>(ServicesService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a service", async () => {
            const { createServiceDto, expectedService } = serviceTestCases.create.valid;

            prisma.service.create.mockResolvedValue(expectedService);

            const result = await controller.create(createServiceDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedService);
        });
        it("should validate required fields", async () => {
            const invalidDto = {} as CreateServiceDto;

            await expect(validateDto(invalidDto, CreateServiceDto)).rejects.toThrow();
        });

        it("should validate service name is not empty", async () => {
            const { createServiceDto } = serviceTestCases.create.invalid.emptyName;

            await expect(validateDto(createServiceDto, CreateServiceDto)).rejects.toThrow();
        });

        it("should validate service name is not too long", async () => {
            const { createServiceDto } = serviceTestCases.create.invalid.tooLongName;

            await expect(validateDto(createServiceDto, CreateServiceDto)).rejects.toThrow();
        });
    });

    describe("findAll", () => {
        it("should return all services", async () => {
            const { existingServices } = serviceTestCases.find.all.valid;

            prisma.service.findMany.mockResolvedValue(existingServices);

            const result = await controller.findAll();

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingServices);
        });
    });

    describe("findOne", () => {
        it("should return a service by id", async () => {
            const { serviceId, existingService } = serviceTestCases.find.byId.valid;

            prisma.service.findUnique.mockResolvedValue(existingService);

            const result = await controller.findOne(serviceId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingService);
        });

        it("should throw error if service not found", async () => {
            const { serviceId } = serviceTestCases.find.byId.invalid;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(controller.findOne(serviceId)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_NOT_FOUND)
            );
        });
    });

    describe("update", () => {
        it("should update a service", async () => {
            const { serviceId, updateServiceDto, existingService, expectedService } = serviceTestCases.update.valid;

            prisma.service.findUnique.mockResolvedValue(existingService);
            prisma.service.update.mockResolvedValue(expectedService);

            const result = await controller.update(serviceId, updateServiceDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedService);
        });

        it("should validate service name is not empty", async () => {
            const { serviceId } = serviceTestCases.update.valid;
            const invalidDto = { serviceName: "" } as UpdateServiceDto;

            await expect(controller.update(serviceId, invalidDto)).rejects.toThrow();
        });

        it("should validate service name is not too long", async () => {
            const { serviceId } = serviceTestCases.update.valid;
            const invalidDto = { serviceName: "a".repeat(101) } as UpdateServiceDto;

            await expect(controller.update(serviceId, invalidDto)).rejects.toThrow();
        });

        it("should throw error if service not found", async () => {
            const { serviceId, updateServiceDto } = serviceTestCases.update.invalid;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(controller.update(serviceId, updateServiceDto)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_NOT_FOUND)
            );
        });
    });

    describe("remove", () => {
        it("should remove a service", async () => {
            const { serviceId, existingService } = serviceTestCases.delete.valid;

            prisma.service.findUnique.mockResolvedValue(existingService);
            prisma.service.delete.mockResolvedValue(existingService);

            const result = await controller.remove(serviceId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingService);
        });

        it("should throw error if service not found", async () => {
            const { serviceId } = serviceTestCases.delete.invalid;

            prisma.service.findUnique.mockResolvedValue(null);

            await expect(controller.remove(serviceId)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_NOT_FOUND)
            );
        });
    });
});
