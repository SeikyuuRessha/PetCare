import { Test, TestingModule } from "@nestjs/testing";
import { AppointmentsController } from "../../src/appointments/appointments.controller";
import { AppointmentsService } from "../../src/appointments/appointments.service";
import { appointmentTestCases } from "./test-cases/appointment.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";

describe("AppointmentsController", () => {
    let controller: AppointmentsController;
    let service: AppointmentsService;

    const mockAppointmentsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByPet: jest.fn(),
        findByUser: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        cancelAppointment: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppointmentsController],
            providers: [
                {
                    provide: AppointmentsService,
                    useValue: mockAppointmentsService,
                },
            ],
        }).compile();

        controller = module.get<AppointmentsController>(AppointmentsController);
        service = module.get<AppointmentsService>(AppointmentsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create an appointment", async () => {
            const { input, expectedAppointment } = appointmentTestCases.create.valid;

            mockAppointmentsService.create.mockResolvedValue(expectedAppointment);

            const result = await controller.create(input);

            expect(service.create).toHaveBeenCalledWith(input);
            expect(result).toEqual(expectedAppointment);
        });

        it("should handle service errors", async () => {
            const { input } = appointmentTestCases.create.invalid.nonExistentPet;

            mockAppointmentsService.create.mockRejectedValue(new AppException(ExceptionCode.PET_NOT_FOUND));

            await expect(controller.create(input)).rejects.toThrow(new AppException(ExceptionCode.PET_NOT_FOUND));
        });
    });

    describe("findAll", () => {
        it("should return an array of appointments", async () => {
            const appointments = [
                appointmentTestCases.find.byPet.valid.existingAppointments[0],
                appointmentTestCases.find.byPet.valid.existingAppointments[1],
            ];

            mockAppointmentsService.findAll.mockResolvedValue(appointments);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(appointments);
        });
    });

    describe("findOne", () => {
        it("should return a single appointment", async () => {
            const { appointmentId, existingAppointment } = appointmentTestCases.find.byId.valid;

            mockAppointmentsService.findOne.mockResolvedValue(existingAppointment);

            const result = await controller.findOne(appointmentId);

            expect(service.findOne).toHaveBeenCalledWith(appointmentId);
            expect(result).toEqual(existingAppointment);
        });

        it("should handle not found error", async () => {
            const { nonExistentId } = appointmentTestCases.find.byId.invalid;

            mockAppointmentsService.findOne.mockRejectedValue(new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND));

            await expect(controller.findOne(nonExistentId)).rejects.toThrow(
                new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND)
            );
        });
    });

    describe("findByPet", () => {
        it("should return appointments for a pet", async () => {
            const { petId, existingAppointments } = appointmentTestCases.find.byPet.valid;

            mockAppointmentsService.findByPet.mockResolvedValue(existingAppointments);

            const result = await controller.findByPet(petId);

            expect(service.findByPet).toHaveBeenCalledWith(petId);
            expect(result).toEqual(existingAppointments);
        });
    });

    describe("findByUser", () => {
        it("should return appointments for a user", async () => {
            const { userId, existingAppointments } = appointmentTestCases.find.byUser.valid;
            const currentUserId = "test-current-user";
            const userRole = "DOCTOR";

            mockAppointmentsService.findByUser.mockResolvedValue({
                code: 1,
                data: existingAppointments,
                message: "Success",
            });

            const result = await controller.findByUser(userId, currentUserId, userRole);

            expect(service.findByUser).toHaveBeenCalledWith(userId);
            expect(result).toEqual({
                code: 1,
                data: existingAppointments,
                message: "Success",
            });
        });

        it("should throw ACCESS_DENIED when user tries to access other user appointments", async () => {
            const { userId } = appointmentTestCases.find.byUser.valid;
            const currentUserId = "different-user";
            const userRole = "USER";

            try {
                await controller.findByUser(userId, currentUserId, userRole);
                fail("Expected AppException to be thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(AppException);
                expect(error.code).toBe(ExceptionCode.ACCESS_DENIED.code);
                expect(error.message).toBe(ExceptionCode.ACCESS_DENIED.message);
            }
        });
    });

    describe("update", () => {
        it("should update an appointment", async () => {
            const { input, expected } = appointmentTestCases.update.valid;
            const { appointmentId, updateData } = input;

            mockAppointmentsService.update.mockResolvedValue(expected);

            const result = await controller.update(appointmentId, updateData);

            expect(service.update).toHaveBeenCalledWith(appointmentId, updateData);
            expect(result).toEqual(expected);
        });

        it("should handle not found error", async () => {
            const { appointmentId, updateData } = appointmentTestCases.update.invalid.nonExistentAppointment;

            mockAppointmentsService.update.mockRejectedValue(new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND));

            await expect(controller.update(appointmentId, updateData)).rejects.toThrow(
                new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND)
            );
        });
    });

    describe("remove", () => {
        it("should remove an appointment", async () => {
            const appointmentId = "test-appointment-id";

            mockAppointmentsService.remove.mockResolvedValue(undefined);

            await controller.remove(appointmentId);

            expect(service.remove).toHaveBeenCalledWith(appointmentId);
        });

        it("should handle not found error", async () => {
            const appointmentId = "non-existent-id";

            mockAppointmentsService.remove.mockRejectedValue(new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND));

            await expect(controller.remove(appointmentId)).rejects.toThrow(
                new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND)
            );
        });
    });

    describe("cancelAppointment", () => {
        it("should cancel an appointment", async () => {
            const { appointmentId, userId, expected } = appointmentTestCases.cancel.valid;

            mockAppointmentsService.cancelAppointment.mockResolvedValue(expected);

            const result = await controller.cancelAppointment(appointmentId, userId);

            expect(service.cancelAppointment).toHaveBeenCalledWith(appointmentId, userId);
            expect(result).toEqual(expected);
        });

        it("should handle access denied error", async () => {
            const { appointmentId, userId } = appointmentTestCases.cancel.invalid.wrongOwner;

            mockAppointmentsService.cancelAppointment.mockRejectedValue(new AppException(ExceptionCode.ACCESS_DENIED));

            await expect(controller.cancelAppointment(appointmentId, userId)).rejects.toThrow(
                new AppException(ExceptionCode.ACCESS_DENIED)
            );
        });

        it("should handle invalid operation error", async () => {
            const { appointmentId, userId } = appointmentTestCases.cancel.invalid.alreadyCancelled;

            mockAppointmentsService.cancelAppointment.mockRejectedValue(
                new AppException(ExceptionCode.INVALID_OPERATION)
            );

            await expect(controller.cancelAppointment(appointmentId, userId)).rejects.toThrow(
                new AppException(ExceptionCode.INVALID_OPERATION)
            );
        });
    });
});
