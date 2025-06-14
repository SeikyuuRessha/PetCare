import { Test, TestingModule } from "@nestjs/testing";
import { ServiceBookingsController } from "../../src/service-bookings/service-bookings.controller";
import { ServiceBookingsService } from "../../src/service-bookings/service-bookings.service";
import { CreateServiceBookingDto } from "../../src/service-bookings/dtos/create-service-booking.dto";
import { UpdateServiceBookingDto } from "../../src/service-bookings/dtos/update-service-booking.dto";
import { serviceBookingTestCases } from "./test-cases/service-booking.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { CustomValidationPipe } from "../../src/common/pipes/custom-validation.pipe";
import { ServiceBookingStatus } from "../../src/common/enums";
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

describe("ServiceBookingsController", () => {
    let controller: ServiceBookingsController;
    let service: ServiceBookingsService;

    const mockServiceBookingsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByPet: jest.fn(),
        update: jest.fn(),
        cancelBooking: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServiceBookingsController],
            providers: [
                {
                    provide: ServiceBookingsService,
                    useValue: mockServiceBookingsService,
                },
            ],
        })
            .overridePipe(CustomValidationPipe)
            .useValue(new CustomValidationPipe())
            .compile();

        controller = module.get<ServiceBookingsController>(ServiceBookingsController);
        service = module.get<ServiceBookingsService>(ServiceBookingsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a service booking", async () => {
            const { createServiceBookingDto, expectedBooking } = serviceBookingTestCases.create.valid;

            mockServiceBookingsService.create.mockResolvedValue({
                code: 1,
                message: "Success",
                data: expectedBooking,
            });

            const result = await controller.create(createServiceBookingDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedBooking);
            expect(mockServiceBookingsService.create).toHaveBeenCalledWith(createServiceBookingDto);
        });

        it("should validate required fields", async () => {
            const invalidDto = {} as CreateServiceBookingDto;

            await expect(validateDto(invalidDto, CreateServiceBookingDto)).rejects.toThrow();
        });

        it("should validate petId is required", async () => {
            const { createServiceBookingDto } = serviceBookingTestCases.create.invalid.missingPetId;

            await expect(validateDto(createServiceBookingDto, CreateServiceBookingDto)).rejects.toThrow();
        });

        it("should validate serviceOptionId is required", async () => {
            const { createServiceBookingDto } = serviceBookingTestCases.create.invalid.missingServiceOption;

            await expect(validateDto(createServiceBookingDto, CreateServiceBookingDto)).rejects.toThrow();
        });

        it("should validate booking date format", async () => {
            const { createServiceBookingDto } = serviceBookingTestCases.create.invalid.invalidDate;

            await expect(validateDto(createServiceBookingDto, CreateServiceBookingDto)).rejects.toThrow();
        });
    });

    describe("findAll", () => {
        it("should return all service bookings", async () => {
            const { existingBookings } = serviceBookingTestCases.find.all.valid;

            mockServiceBookingsService.findAll.mockResolvedValue({
                code: 1,
                message: "Success",
                data: existingBookings,
            });

            const result = await controller.findAll();

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingBookings);
            expect(mockServiceBookingsService.findAll).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return a service booking by id", async () => {
            const { bookingId, existingBooking } = serviceBookingTestCases.find.byId.valid;

            mockServiceBookingsService.findOne.mockResolvedValue({
                code: 1,
                message: "Success",
                data: existingBooking,
            });

            const result = await controller.findOne(bookingId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingBooking);
            expect(mockServiceBookingsService.findOne).toHaveBeenCalledWith(bookingId);
        });

        it("should throw error if booking not found", async () => {
            const { bookingId } = serviceBookingTestCases.find.byId.invalid;

            mockServiceBookingsService.findOne.mockRejectedValue(new AppException(ExceptionCode.BOOKING_NOT_FOUND));

            await expect(controller.findOne(bookingId)).rejects.toThrow(
                new AppException(ExceptionCode.BOOKING_NOT_FOUND)
            );
        });
    });

    describe("findByPet", () => {
        it("should return service bookings for a pet", async () => {
            const { petId, existingBookings } = serviceBookingTestCases.find.byPet.valid;

            mockServiceBookingsService.findByPet.mockResolvedValue({
                code: 1,
                message: "Success",
                data: existingBookings,
            });

            const result = await controller.findByPet(petId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingBookings);
            expect(mockServiceBookingsService.findByPet).toHaveBeenCalledWith(petId);
        });
    });

    describe("update", () => {
        it("should update a service booking", async () => {
            const { bookingId, updateServiceBookingDto, expectedBooking } = serviceBookingTestCases.update.valid;

            mockServiceBookingsService.update.mockResolvedValue({
                code: 1,
                message: "Success",
                data: expectedBooking,
            });

            const result = await controller.update(bookingId, updateServiceBookingDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedBooking);
            expect(mockServiceBookingsService.update).toHaveBeenCalledWith(bookingId, updateServiceBookingDto);
        });

        it("should validate status enum", async () => {
            const invalidDto = { status: "INVALID_STATUS" as any };

            await expect(validateDto(invalidDto, UpdateServiceBookingDto)).rejects.toThrow();
        });

        it("should throw error if booking not found", async () => {
            const { bookingId, updateServiceBookingDto } = serviceBookingTestCases.update.invalid;

            mockServiceBookingsService.update.mockRejectedValue(new AppException(ExceptionCode.BOOKING_NOT_FOUND));

            await expect(controller.update(bookingId, updateServiceBookingDto)).rejects.toThrow(
                new AppException(ExceptionCode.BOOKING_NOT_FOUND)
            );
        });
    });

    describe("cancelBooking", () => {
        it("should cancel a booking for the owner", async () => {
            const { bookingId, userId } = serviceBookingTestCases.cancel.valid;

            mockServiceBookingsService.cancelBooking.mockResolvedValue({
                code: 1,
                message: "Booking cancelled successfully",
            });

            const result = await controller.cancelBooking(bookingId, userId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Booking cancelled successfully");
            expect(mockServiceBookingsService.cancelBooking).toHaveBeenCalledWith(bookingId, userId);
        });

        it("should throw error if user is not the owner", async () => {
            const { bookingId, userId } = serviceBookingTestCases.cancel.unauthorized;

            mockServiceBookingsService.cancelBooking.mockRejectedValue(new AppException(ExceptionCode.UNAUTHORIZED));

            await expect(controller.cancelBooking(bookingId, userId)).rejects.toThrow(
                new AppException(ExceptionCode.UNAUTHORIZED)
            );
        });
    });

    describe("remove", () => {
        it("should remove a service booking as admin", async () => {
            const { bookingId, userId, userRole } = serviceBookingTestCases.delete.valid;

            mockServiceBookingsService.remove.mockResolvedValue({
                code: 1,
                message: "Success",
            });

            const result = await controller.remove(bookingId, userId, userRole);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(mockServiceBookingsService.remove).toHaveBeenCalledWith(bookingId, userId, userRole);
        });

        it("should throw error if booking not found", async () => {
            const { bookingId, userId, userRole } = serviceBookingTestCases.delete.invalid;

            mockServiceBookingsService.remove.mockRejectedValue(new AppException(ExceptionCode.BOOKING_NOT_FOUND));

            await expect(controller.remove(bookingId, userId, userRole)).rejects.toThrow(
                new AppException(ExceptionCode.BOOKING_NOT_FOUND)
            );
        });
    });
});
