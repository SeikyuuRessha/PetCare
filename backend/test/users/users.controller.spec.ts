import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../../src/users/users.controller";
import { UsersService } from "../../src/users/users.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { userTestCases } from "./test-cases/user.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { HttpStatus } from "@nestjs/common";
import { UserRole } from "../../src/common/enums";
import { JwtService } from "@nestjs/jwt";

describe("UsersController", () => {
    let controller: UsersController;
    let service: UsersService;
    let prisma: DeepMockProxy<PrismaClient>;

    const mockUser = {
        userId: "user-1",
        username: "testuser",
        email: "test@example.com",
        fullName: "Test User",
        password: "hashedPassword",
        refreshToken: null,
        phone: "1234567890",
        address: "123 Test St",
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const prismaMock = mockDeep<PrismaClient>();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue("mock-token"),
                    },
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a new user successfully", async () => {
            const { createUserDto, expectedUser } = userTestCases.create.valid;
            jest.spyOn(service, "create").mockResolvedValue({ code: 1, data: expectedUser, message: "Success" });

            const result = await controller.create(createUserDto);

            expect(service.create).toHaveBeenCalledWith(createUserDto);
            expect(result).toEqual({ code: 1, data: expectedUser, message: "Success" });
        });

        it("should throw an error when creating a user with existing username", async () => {
            const { createUserDto } = userTestCases.create.invalid.duplicateUsername;
            jest.spyOn(service, "create").mockRejectedValue(
                new AppException(ExceptionCode.USER_ALREADY_EXISTS, null, HttpStatus.CONFLICT)
            );

            await expect(controller.create(createUserDto)).rejects.toThrow(
                new AppException(ExceptionCode.USER_ALREADY_EXISTS, null, HttpStatus.CONFLICT)
            );
            expect(service.create).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe("findAll", () => {
        it("should return all users for admin", async () => {
            const { existingUsers } = userTestCases.find.all.valid;
            jest.spyOn(service, "findAll").mockResolvedValue({ code: 1, data: existingUsers, message: "Success" });

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual({ code: 1, data: existingUsers, message: "Success" });
        });
    });

    describe("getMyProfile", () => {
        it("should return user profile for own user", async () => {
            const { userId, existingUser } = userTestCases.find.byId.valid;
            jest.spyOn(service, "findOne").mockResolvedValue({ code: 1, data: existingUser, message: "Success" });

            const result = await controller.getMyProfile(userId);

            expect(service.findOne).toHaveBeenCalledWith(userId);
            expect(result).toEqual({ code: 1, data: existingUser, message: "Success" });
        });
    });

    describe("findOne", () => {
        it("should return user profile for admin", async () => {
            const { userId, existingUser } = userTestCases.find.byId.valid;
            jest.spyOn(service, "findOne").mockResolvedValue({ code: 1, data: existingUser, message: "Success" });

            const result = await controller.findOne(userId);

            expect(service.findOne).toHaveBeenCalledWith(userId);
            expect(result).toEqual({ code: 1, data: existingUser, message: "Success" });
        });
    });

    describe("updateMyProfile", () => {
        it("should update own user profile successfully", async () => {
            const { userId, updateUserDto, expectedUser } = userTestCases.update.valid;
            jest.spyOn(service, "update").mockResolvedValue({ code: 1, data: expectedUser, message: "Success" });

            const result = await controller.updateMyProfile(userId, updateUserDto);

            expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
            expect(result).toEqual({ code: 1, data: expectedUser, message: "Success" });
        });
    });

    describe("update", () => {
        it("should allow admin to update any user profile", async () => {
            const { userId, updateUserDto, expectedUser } = userTestCases.update.valid;
            jest.spyOn(service, "update").mockResolvedValue({ code: 1, data: expectedUser, message: "Success" });

            const result = await controller.update(userId, updateUserDto);

            expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
            expect(result).toEqual({ code: 1, data: expectedUser, message: "Success" });
        });
    });

    describe("remove", () => {
        it("should delete user profile successfully", async () => {
            const { userId, existingUser } = userTestCases.delete.valid;
            jest.spyOn(service, "remove").mockResolvedValue({ code: 1, data: existingUser, message: "Success" });

            const result = await controller.remove(userId);

            expect(service.remove).toHaveBeenCalledWith(userId);
            expect(result).toEqual({ code: 1, data: existingUser, message: "Success" });
        });
    });
});
