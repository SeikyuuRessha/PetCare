import { Test, TestingModule } from "@nestjs/testing";
import { AppointmentsService } from "../../src/appointments/appointments.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { appointmentTestCases } from "./test-cases/appointment.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";

describe("AppointmentsService", () => {
    let service: AppointmentsService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        appointment: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        },
        pet: {
            findUnique: jest.fn(),
        },
        payment: {
            create: jest.fn(),
            deleteMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppointmentsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<AppointmentsService>(AppointmentsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create an appointment successfully", async () => {
            const { input, expectedPet, expectedAppointment } = appointmentTestCases.create.valid;

            mockPrismaService.pet.findUnique.mockResolvedValue(expectedPet);
            mockPrismaService.appointment.create.mockResolvedValue(expectedAppointment);
            mockPrismaService.payment.create.mockResolvedValue({});

            const result = await service.create(input);

            expect(mockPrismaService.pet.findUnique).toHaveBeenCalledWith({
                where: { petId: input.petId },
            });
            expect(mockPrismaService.appointment.create).toHaveBeenCalledWith({
                data: {
                    ...input,
                    appointmentDate: new Date(input.appointmentDate),
                },
                include: expect.any(Object),
            });
            expect(mockPrismaService.payment.create).toHaveBeenCalledWith({
                data: {
                    userId: expectedPet.ownerId,
                    totalAmount: 50.0,
                    status: "PENDING",
                },
            });
            expect(result).toEqual({
                code: 1,
                data: expectedAppointment,
                message: "Success",
            });
        });

        it("should throw PET_NOT_FOUND when pet does not exist", async () => {
            const { input } = appointmentTestCases.create.invalid.nonExistentPet;

            mockPrismaService.pet.findUnique.mockResolvedValue(null);

            await expect(service.create(input)).rejects.toThrow(new AppException(ExceptionCode.PET_NOT_FOUND));
        });
    });

    describe("findOne", () => {
        it("should find an appointment by id", async () => {
            const { appointmentId, existingAppointment } = appointmentTestCases.find.byId.valid;

            mockPrismaService.appointment.findUnique.mockResolvedValue(existingAppointment);

            const result = await service.findOne(appointmentId);

            expect(mockPrismaService.appointment.findUnique).toHaveBeenCalledWith({
                where: { appointmentId },
                include: expect.any(Object),
            });
            expect(result).toEqual({
                code: 1,
                data: existingAppointment,
                message: "Success",
            });
        });

        it("should throw APPOINTMENT_NOT_FOUND when appointment does not exist", async () => {
            const { nonExistentId } = appointmentTestCases.find.byId.invalid;

            mockPrismaService.appointment.findUnique.mockResolvedValue(null);

            await expect(service.findOne(nonExistentId)).rejects.toThrow(
                new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND)
            );
        });
    });

    describe("findByPet", () => {
        it("should find appointments by pet id", async () => {
            const { petId, existingAppointments } = appointmentTestCases.find.byPet.valid;

            mockPrismaService.appointment.findMany.mockResolvedValue(existingAppointments);

            const result = await service.findByPet(petId);

            expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
                where: { petId },
                include: expect.any(Object),
                orderBy: { appointmentDate: "desc" },
            });
            expect(result).toEqual({
                code: 1,
                data: existingAppointments,
                message: "Success",
            });
        });
    });

    describe("findByUser", () => {
        it("should find appointments by user id", async () => {
            const { userId, existingAppointments } = appointmentTestCases.find.byUser.valid;

            mockPrismaService.appointment.findMany.mockResolvedValue(existingAppointments);

            const result = await service.findByUser(userId);

            expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
                where: {
                    pet: {
                        ownerId: userId,
                    },
                },
                include: expect.any(Object),
                orderBy: { appointmentDate: "desc" },
            });
            expect(result).toEqual({
                code: 1,
                data: existingAppointments,
                message: "Success",
            });
        });
    });

    describe("update", () => {
        it("should update an appointment successfully", async () => {
            const { input, existingAppointment, expected } = appointmentTestCases.update.valid;
            const { appointmentId, updateData } = input;

            mockPrismaService.appointment.findUnique.mockResolvedValue(existingAppointment);
            mockPrismaService.appointment.update.mockResolvedValue(expected);

            const result = await service.update(appointmentId, updateData);

            expect(mockPrismaService.appointment.findUnique).toHaveBeenCalledWith({
                where: { appointmentId },
            });
            expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
                where: { appointmentId },
                data: updateData,
                include: expect.any(Object),
            });
            expect(result).toEqual({
                code: 1,
                data: expected,
                message: "Success",
            });
        });

        it("should throw APPOINTMENT_NOT_FOUND when appointment does not exist", async () => {
            const { appointmentId, updateData } = appointmentTestCases.update.invalid.nonExistentAppointment;

            mockPrismaService.appointment.findUnique.mockResolvedValue(null);

            await expect(service.update(appointmentId, updateData)).rejects.toThrow(
                new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND)
            );
        });
    });

    describe("cancelAppointment", () => {
        it("should cancel an appointment successfully", async () => {
            const { appointmentId, userId, existingAppointment, expected } = appointmentTestCases.cancel.valid;

            mockPrismaService.appointment.findUnique.mockResolvedValue(existingAppointment);
            mockPrismaService.appointment.update.mockResolvedValue(expected);
            mockPrismaService.payment.deleteMany.mockResolvedValue({ count: 1 });

            const result = await service.cancelAppointment(appointmentId, userId);

            expect(mockPrismaService.appointment.findUnique).toHaveBeenCalledWith({
                where: { appointmentId },
                include: expect.any(Object),
            });
            expect(mockPrismaService.payment.deleteMany).toHaveBeenCalled();
            expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
                where: { appointmentId },
                data: { status: "CANCELLED" },
                include: expect.any(Object),
            });
            expect(result).toEqual({
                code: 1,
                data: expected,
                message: "Success",
            });
        });

        it("should throw ACCESS_DENIED when user is not the owner", async () => {
            const { appointmentId, userId, existingAppointment } = appointmentTestCases.cancel.invalid.wrongOwner;

            mockPrismaService.appointment.findUnique.mockResolvedValue(existingAppointment);

            await expect(service.cancelAppointment(appointmentId, userId)).rejects.toThrow(
                new AppException(ExceptionCode.ACCESS_DENIED)
            );
        });

        it("should throw INVALID_OPERATION when appointment is already cancelled", async () => {
            const { appointmentId, userId, existingAppointment } = appointmentTestCases.cancel.invalid.alreadyCancelled;

            mockPrismaService.appointment.findUnique.mockResolvedValue(existingAppointment);

            await expect(service.cancelAppointment(appointmentId, userId)).rejects.toThrow(
                new AppException(ExceptionCode.INVALID_OPERATION)
            );
        });
    });

    describe("remove", () => {
        it("should remove an appointment successfully", async () => {
            const appointmentId = "test-appointment-id";
            const existingAppointment = {
                appointmentId,
                petId: "test-pet-id",
                pet: {
                    ownerId: "test-owner-id",
                },
            };

            mockPrismaService.appointment.findUnique.mockResolvedValue(existingAppointment);
            mockPrismaService.payment.deleteMany.mockResolvedValue({ count: 1 });
            mockPrismaService.appointment.delete.mockResolvedValue(existingAppointment);

            await service.remove(appointmentId);

            expect(mockPrismaService.appointment.findUnique).toHaveBeenCalledWith({
                where: { appointmentId },
                include: expect.any(Object),
            });
            expect(mockPrismaService.payment.deleteMany).toHaveBeenCalled();
            expect(mockPrismaService.appointment.delete).toHaveBeenCalledWith({
                where: { appointmentId },
            });
        });

        it("should throw APPOINTMENT_NOT_FOUND when appointment does not exist", async () => {
            const appointmentId = "non-existent-id";

            mockPrismaService.appointment.findUnique.mockResolvedValue(null);

            await expect(service.remove(appointmentId)).rejects.toThrow(
                new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND)
            );
        });
    });
});
