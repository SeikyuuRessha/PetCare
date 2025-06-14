import { Test, TestingModule } from "@nestjs/testing";
import { RoomsService } from "../../src/rooms/rooms.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { roomTestCases } from "./test-cases/room.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { RoomStatus } from "../../src/common/enums";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

describe("RoomsService", () => {
    let service: RoomsService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomsService,
                {
                    provide: PrismaService,
                    useValue: mockDeep<PrismaClient>(),
                },
            ],
        }).compile();

        service = module.get<RoomsService>(RoomsService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a room", async () => {
            const { createRoomDto, expectedRoom } = roomTestCases.create.valid;

            // Mock that room number doesn't exist
            prisma.room.findUnique.mockResolvedValue(null);
            prisma.room.create.mockResolvedValue(expectedRoom as any);

            const result = await service.create(createRoomDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedRoom);
        });

        it("should throw error if room number already exists", async () => {
            const { createRoomDto } = roomTestCases.create.invalid.duplicateRoomNumber;

            // Mock that room number already exists
            prisma.room.findUnique.mockResolvedValue({ roomNumber: 101 } as any);

            await expect(service.create(createRoomDto)).rejects.toThrow(
                new AppException(ExceptionCode.ROOM_NUMBER_ALREADY_EXISTS)
            );
        });
    });

    describe("findAll", () => {
        it("should return all rooms", async () => {
            const { existingRooms } = roomTestCases.find.all.valid;

            prisma.room.findMany.mockResolvedValue(existingRooms as any);

            const result = await service.findAll();

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingRooms);
        });
    });

    describe("findAvailable", () => {
        it("should return available rooms", async () => {
            const { availableRooms } = roomTestCases.find.available.valid;

            prisma.room.findMany.mockResolvedValue(availableRooms as any);

            const result = await service.findAvailable();

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(availableRooms);
            expect(prisma.room.findMany).toHaveBeenCalledWith({
                where: { status: RoomStatus.AVAILABLE },
                orderBy: { roomNumber: "asc" },
            });
        });
    });

    describe("findOne", () => {
        it("should return a room by id", async () => {
            const { roomId, existingRoom } = roomTestCases.find.byId.valid;

            prisma.room.findUnique.mockResolvedValue(existingRoom as any);

            const result = await service.findOne(roomId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(existingRoom);
        });

        it("should throw error if room not found", async () => {
            const { roomId } = roomTestCases.find.byId.invalid;

            prisma.room.findUnique.mockResolvedValue(null);

            await expect(service.findOne(roomId)).rejects.toThrow(new AppException(ExceptionCode.ROOM_NOT_FOUND));
        });
    });

    describe("update", () => {
        it("should update a room", async () => {
            const { roomId, updateRoomDto, existingRoom, expectedRoom } = roomTestCases.update.valid;

            prisma.room.findUnique.mockResolvedValue(existingRoom as any);
            prisma.room.update.mockResolvedValue(expectedRoom as any);

            const result = await service.update(roomId, updateRoomDto);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
            expect(result.data).toEqual(expectedRoom);
        });

        it("should throw error if room not found", async () => {
            const { roomId, updateRoomDto } = roomTestCases.update.invalid;

            prisma.room.findUnique.mockResolvedValue(null);

            await expect(service.update(roomId, updateRoomDto)).rejects.toThrow(
                new AppException(ExceptionCode.ROOM_NOT_FOUND)
            );
        });
    });

    describe("remove", () => {
        it("should remove a room", async () => {
            const { roomId, existingRoom } = roomTestCases.delete.valid;

            prisma.room.findUnique.mockResolvedValue(existingRoom as any);
            prisma.room.delete.mockResolvedValue(existingRoom as any);

            const result = await service.remove(roomId);

            expect(result.code).toBe(1);
            expect(result.message).toBe("Success");
        });

        it("should throw error if room not found", async () => {
            const { roomId } = roomTestCases.delete.invalid;

            prisma.room.findUnique.mockResolvedValue(null);

            await expect(service.remove(roomId)).rejects.toThrow(new AppException(ExceptionCode.ROOM_NOT_FOUND));
        });
    });
});
