import { Test, TestingModule } from "@nestjs/testing";
import { RoomsController } from "../../src/rooms/rooms.controller";
import { RoomsService } from "../../src/rooms/rooms.service";
import { CreateRoomDto } from "../../src/rooms/dtos/create-room.dto";
import { UpdateRoomDto } from "../../src/rooms/dtos/update-room.dto";
import { roomTestCases } from "./test-cases/room.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { CustomValidationPipe } from "../../src/common/pipes/custom-validation.pipe";
import { RoomStatus } from "../../src/common/enums";
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

describe("RoomsController", () => {
    let controller: RoomsController;
    let service: RoomsService;

    const mockRoomsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findAvailable: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RoomsController],
            providers: [
                {
                    provide: RoomsService,
                    useValue: mockRoomsService,
                },
            ],
        })
            .overridePipe(CustomValidationPipe)
            .useValue(new CustomValidationPipe())
            .compile();

        controller = module.get<RoomsController>(RoomsController);
        service = module.get<RoomsService>(RoomsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a room", async () => {
            const { createRoomDto, expectedRoom } = roomTestCases.create.valid;

            mockRoomsService.create.mockResolvedValue({
                code: 1,
                message: "Success",
                data: expectedRoom,
            });

            const result = await controller.create(createRoomDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedRoom);
            expect(mockRoomsService.create).toHaveBeenCalledWith(createRoomDto);
        });

        it("should validate required fields", async () => {
            const invalidDto = {} as CreateRoomDto;

            await expect(validateDto(invalidDto, CreateRoomDto)).rejects.toThrow();
        });

        it("should validate roomNumber is positive", async () => {
            const { createRoomDto } = roomTestCases.create.invalid.negativeRoomNumber;

            await expect(validateDto(createRoomDto, CreateRoomDto)).rejects.toThrow();
        });

        it("should validate capacity is positive", async () => {
            const { createRoomDto } = roomTestCases.create.invalid.negativeCapacity;

            await expect(validateDto(createRoomDto, CreateRoomDto)).rejects.toThrow();
        });
    });

    describe("findAll", () => {
        it("should return all rooms", async () => {
            const { existingRooms } = roomTestCases.find.all.valid;

            mockRoomsService.findAll.mockResolvedValue({
                code: 1,
                message: "Success",
                data: existingRooms,
            });

            const result = await controller.findAll();

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingRooms);
            expect(mockRoomsService.findAll).toHaveBeenCalled();
        });
    });

    describe("findAvailable", () => {
        it("should return available rooms", async () => {
            const { availableRooms } = roomTestCases.find.available.valid;

            mockRoomsService.findAvailable.mockResolvedValue({
                code: 1,
                message: "Success",
                data: availableRooms,
            });

            const result = await controller.findAvailable();

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(availableRooms);
            expect(mockRoomsService.findAvailable).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return a room by id", async () => {
            const { roomId, existingRoom } = roomTestCases.find.byId.valid;

            mockRoomsService.findOne.mockResolvedValue({
                code: 1,
                message: "Success",
                data: existingRoom,
            });

            const result = await controller.findOne(roomId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingRoom);
            expect(mockRoomsService.findOne).toHaveBeenCalledWith(roomId);
        });

        it("should throw error if room not found", async () => {
            const { roomId } = roomTestCases.find.byId.invalid;

            mockRoomsService.findOne.mockRejectedValue(new AppException(ExceptionCode.ROOM_NOT_FOUND));

            await expect(controller.findOne(roomId)).rejects.toThrow(new AppException(ExceptionCode.ROOM_NOT_FOUND));
        });
    });

    describe("update", () => {
        it("should update a room", async () => {
            const { roomId, updateRoomDto, expectedRoom } = roomTestCases.update.valid;

            mockRoomsService.update.mockResolvedValue({
                code: 1,
                message: "Success",
                data: expectedRoom,
            });

            const result = await controller.update(roomId, updateRoomDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedRoom);
            expect(mockRoomsService.update).toHaveBeenCalledWith(roomId, updateRoomDto);
        });

        it("should validate capacity is positive when updating", async () => {
            const invalidDto = { capacity: -1 };

            await expect(validateDto(invalidDto, UpdateRoomDto)).rejects.toThrow();
        });

        it("should throw error if room not found", async () => {
            const { roomId, updateRoomDto } = roomTestCases.update.invalid;

            mockRoomsService.update.mockRejectedValue(new AppException(ExceptionCode.ROOM_NOT_FOUND));

            await expect(controller.update(roomId, updateRoomDto)).rejects.toThrow(
                new AppException(ExceptionCode.ROOM_NOT_FOUND)
            );
        });
    });

    describe("remove", () => {
        it("should remove a room", async () => {
            const { roomId } = roomTestCases.delete.valid;

            mockRoomsService.remove.mockResolvedValue({
                code: 1,
                message: "Success",
            });

            const result = await controller.remove(roomId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(mockRoomsService.remove).toHaveBeenCalledWith(roomId);
        });

        it("should throw error if room not found", async () => {
            const { roomId } = roomTestCases.delete.invalid;

            mockRoomsService.remove.mockRejectedValue(new AppException(ExceptionCode.ROOM_NOT_FOUND));

            await expect(controller.remove(roomId)).rejects.toThrow(new AppException(ExceptionCode.ROOM_NOT_FOUND));
        });
    });
});
