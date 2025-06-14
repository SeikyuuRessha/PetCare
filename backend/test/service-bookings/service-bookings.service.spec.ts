import { Test, TestingModule } from "@nestjs/testing";
import { ServiceBookingsService } from "../../src/service-bookings/service-bookings.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { serviceBookingTestCases } from "./test-cases/service-booking.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { ServiceBookingStatus } from "../../src/common/enums";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

describe("ServiceBookingsService", () => {
    let service: ServiceBookingsService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ServiceBookingsService,
                {
                    provide: PrismaService,
                    useValue: mockDeep<PrismaClient>(),
                },
            ],
        }).compile();

        service = module.get<ServiceBookingsService>(ServiceBookingsService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("create", () => {
        it("should create a service booking", async () => {
            const { createServiceBookingDto, expectedBooking } = serviceBookingTestCases.create.valid;

            // Mock pet exists
            prisma.pet.findUnique.mockResolvedValue({
                petId: "pet-1",
                ownerId: "user-1",
            } as any);

            // Mock service option exists
            prisma.serviceOption.findUnique.mockResolvedValue({
                optionId: "option-1",
                price: 75.0,
            } as any);

            // Mock payment creation
            prisma.payment.create.mockResolvedValue({} as any);

            prisma.serviceBooking.create.mockResolvedValue(expectedBooking as any);

            const result = await service.create(createServiceBookingDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedBooking);
        });

        it("should throw error if pet not found", async () => {
            const { createServiceBookingDto } = serviceBookingTestCases.create.valid;

            // Mock pet doesn't exist
            prisma.pet.findUnique.mockResolvedValue(null);

            await expect(service.create(createServiceBookingDto)).rejects.toThrow(
                new AppException(ExceptionCode.PET_NOT_FOUND)
            );
        });

        it("should throw error if service option not found", async () => {
            const { createServiceBookingDto } = serviceBookingTestCases.create.valid;

            // Mock pet exists but service option doesn't
            prisma.pet.findUnique.mockResolvedValue({
                petId: "pet-1",
                ownerId: "user-1",
            } as any);
            prisma.serviceOption.findUnique.mockResolvedValue(null);

            await expect(service.create(createServiceBookingDto)).rejects.toThrow(
                new AppException(ExceptionCode.SERVICE_OPTION_NOT_FOUND)
            );
        });
    });

    describe("findAll", () => {
        it("should return all service bookings", async () => {
            const { existingBookings } = serviceBookingTestCases.find.all.valid;

            prisma.serviceBooking.findMany.mockResolvedValue(existingBookings);

            const result = await service.findAll();

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingBookings);
        });
    });

    describe("findOne", () => {
        it("should return a service booking by id", async () => {
            const { bookingId, existingBooking } = serviceBookingTestCases.find.byId.valid;

            prisma.serviceBooking.findUnique.mockResolvedValue(existingBooking);

            const result = await service.findOne(bookingId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingBooking);
        });

        it("should throw error if booking not found", async () => {
            const { bookingId } = serviceBookingTestCases.find.byId.invalid;

            prisma.serviceBooking.findUnique.mockResolvedValue(null);
            await expect(service.findOne(bookingId)).rejects.toThrow(new AppException(ExceptionCode.BOOKING_NOT_FOUND));
        });
    });

    describe("findByPet", () => {
        it("should return service bookings for a pet", async () => {
            const { petId, existingBookings } = serviceBookingTestCases.find.byPet.valid;

            prisma.serviceBooking.findMany.mockResolvedValue(existingBookings);

            const result = await service.findByPet(petId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingBookings);
            expect(prisma.serviceBooking.findMany).toHaveBeenCalledWith({
                where: { petId },
                include: {
                    pet: {
                        select: {
                            petId: true,
                            name: true,
                            species: true,
                            breed: true,
                            owner: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    serviceOption: {
                        include: {
                            service: {
                                select: {
                                    serviceId: true,
                                    serviceName: true,
                                    description: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { bookingDate: "desc" },
            });
        });
    });

    describe("update", () => {
        it("should update a service booking", async () => {
            const { bookingId, updateServiceBookingDto, existingBooking, expectedBooking } =
                serviceBookingTestCases.update.valid;

            prisma.serviceBooking.findUnique.mockResolvedValue(existingBooking);
            prisma.serviceBooking.update.mockResolvedValue(expectedBooking);

            const result = await service.update(bookingId, updateServiceBookingDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedBooking);
        });

        it("should throw error if booking not found", async () => {
            const { bookingId, updateServiceBookingDto } = serviceBookingTestCases.update.invalid;

            prisma.serviceBooking.findUnique.mockResolvedValue(null);
            await expect(service.update(bookingId, updateServiceBookingDto)).rejects.toThrow(
                new AppException(ExceptionCode.BOOKING_NOT_FOUND)
            );
        });
    });

    describe("cancelBooking", () => {
        it("should cancel a booking for the owner", async () => {
            const { bookingId, userId, existingBooking } = serviceBookingTestCases.cancel.valid;

            // Mock booking with pet owner info
            const bookingWithOwner = {
                ...existingBooking,
                pet: {
                    ownerId: userId,
                },
            };

            prisma.serviceBooking.findUnique.mockResolvedValue(bookingWithOwner as any);
            prisma.serviceBooking.update.mockResolvedValue({
                ...existingBooking,
                status: "CANCELLED",
            } as any);
            prisma.payment.deleteMany.mockResolvedValue({ count: 1 } as any);

            const result = await service.cancelBooking(bookingId, userId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
        });

        it("should throw error if user is not the owner", async () => {
            const { bookingId, userId, existingBooking } = serviceBookingTestCases.cancel.unauthorized;

            // Mock booking with different owner
            const bookingWithDifferentOwner = {
                ...existingBooking,
                pet: {
                    ownerId: "different-user",
                },
            };

            prisma.serviceBooking.findUnique.mockResolvedValue(bookingWithDifferentOwner as any);

            await expect(service.cancelBooking(bookingId, userId)).rejects.toThrow(
                new AppException(ExceptionCode.ACCESS_DENIED)
            );
        });
    });

    describe("remove", () => {
        it("should remove a service booking as admin", async () => {
            const { bookingId, userId, userRole, existingBooking } = serviceBookingTestCases.delete.valid;

            prisma.serviceBooking.findUnique.mockResolvedValue(existingBooking);
            prisma.serviceBooking.delete.mockResolvedValue(existingBooking);

            const result = await service.remove(bookingId, userId, userRole);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
        });

        it("should throw error if booking not found", async () => {
            const { bookingId, userId, userRole } = serviceBookingTestCases.delete.invalid;

            prisma.serviceBooking.findUnique.mockResolvedValue(null);

            await expect(service.remove(bookingId, userId, userRole)).rejects.toThrow(
                new AppException(ExceptionCode.BOOKING_NOT_FOUND)
            );
        });
    });
});
