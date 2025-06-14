import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../../src/users/users.service";
import { PrismaService } from "../../src/prisma/prisma.service";
import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { userTestCases } from "./test-cases/user.test-cases";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { HttpStatus } from "@nestjs/common";

describe("UsersService", () => {
    let service: UsersService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(async () => {
        const prismaMock = mockDeep<PrismaClient>();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a new user successfully", async () => {
            const { createUserDto, expectedUser } = userTestCases.create.valid;
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockResolvedValue(expectedUser);

            const result = await service.create(createUserDto);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { username: createUserDto.username },
            });
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    ...createUserDto,
                    password: expect.any(String), // Password should be hashed
                }),
            });
            expect(result).toEqual({ code: 1, data: expectedUser, message: "Success" });
        });

        it("should throw an error when creating a user with existing username", async () => {
            const { createUserDto } = userTestCases.create.invalid.duplicateUsername;
            const existingUser = { ...userTestCases.create.valid.expectedUser, username: createUserDto.username };
            prisma.user.findUnique.mockResolvedValue(existingUser);

            await expect(service.create(createUserDto)).rejects.toThrow(
                new AppException(ExceptionCode.USER_ALREADY_EXISTS, null, HttpStatus.CONFLICT)
            );
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { username: createUserDto.username },
            });
            expect(prisma.user.create).not.toHaveBeenCalled();
        });

        it("should throw an error when creating a user with existing email", async () => {
            const { createUserDto } = userTestCases.create.invalid.duplicateEmail;
            const existingUser = { ...userTestCases.create.valid.expectedUser, email: createUserDto.email };
            prisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(existingUser);

            await expect(service.create(createUserDto)).rejects.toThrow(
                new AppException(ExceptionCode.EMAIL_ALREADY_EXISTS, null, HttpStatus.CONFLICT)
            );
            expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
            expect(prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
                where: { username: createUserDto.username },
            });
            expect(prisma.user.findUnique).toHaveBeenNthCalledWith(2, {
                where: { email: createUserDto.email },
            });
            expect(prisma.user.create).not.toHaveBeenCalled();
        });
    });

    describe("findById", () => {
        it("should find a user by id successfully", async () => {
            const { userId, existingUser } = userTestCases.find.byId.valid;
            prisma.user.findUnique.mockResolvedValue(existingUser);

            const result = await service.findById(userId);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { userId },
                include: {
                    _count: false,
                },
            });
            expect(result).toEqual(existingUser);
        });

        it("should return null when user is not found", async () => {
            const { userId } = userTestCases.find.byId.invalid;
            prisma.user.findUnique.mockResolvedValue(null);

            const result = await service.findById(userId);
            expect(result).toBeNull();
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { userId },
                include: {
                    _count: false,
                },
            });
        });
    });

    describe("findByEmail", () => {
        it("should find a user by email successfully", async () => {
            const { email, existingUser } = userTestCases.find.byEmail.valid;
            prisma.user.findUnique.mockResolvedValue(existingUser);

            const result = await service.findByEmail(email);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email },
                include: {
                    _count: false,
                },
            });
            expect(result).toEqual(existingUser);
        });

        it("should return null when user is not found", async () => {
            const { email } = userTestCases.find.byEmail.invalid;
            prisma.user.findUnique.mockResolvedValue(null);

            const result = await service.findByEmail(email);
            expect(result).toBeNull();
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email },
                include: {
                    _count: false,
                },
            });
        });
    });

    describe("findAll", () => {
        it("should find all users successfully", async () => {
            const { existingUsers } = userTestCases.find.all.valid;
            prisma.user.findMany.mockResolvedValue(existingUsers);

            const result = await service.findAll();

            expect(prisma.user.findMany).toHaveBeenCalledWith({
                select: {
                    userId: true,
                    username: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    address: true,
                    role: true,
                },
            });
            expect(result).toEqual({ code: 1, data: existingUsers, message: "Success" });
        });
    });

    describe("update", () => {
        it("should update a user successfully", async () => {
            const { userId, updateUserDto, existingUser, expectedUser } = userTestCases.update.valid;
            prisma.user.findUnique.mockResolvedValue(existingUser);
            prisma.user.update.mockResolvedValue(expectedUser);

            const result = await service.update(userId, updateUserDto);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { userId },
            });
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { userId },
                data: updateUserDto,
                select: {
                    userId: true,
                    username: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    address: true,
                    role: true,
                },
            });
            expect(result).toEqual({ code: 1, data: expectedUser, message: "Success" });
        });

        it("should throw an error when updating non-existent user", async () => {
            const { userId, updateUserDto } = userTestCases.update.invalid;
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.update(userId, updateUserDto)).rejects.toThrow(
                new AppException(ExceptionCode.USER_NOT_FOUND, null, HttpStatus.NOT_FOUND)
            );
            expect(prisma.user.findUnique).toHaveBeenCalled();
            expect(prisma.user.update).not.toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should delete a user successfully", async () => {
            const { userId, existingUser } = userTestCases.delete.valid;
            prisma.user.findUnique.mockResolvedValue(existingUser);
            prisma.user.delete.mockResolvedValue(existingUser);

            const result = await service.remove(userId);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { userId },
            });
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { userId },
            });
            expect(result).toEqual({ code: 1, data: existingUser, message: "Success" });
        });

        it("should throw an error when deleting non-existent user", async () => {
            const { userId } = userTestCases.delete.invalid;
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.remove(userId)).rejects.toThrow(
                new AppException(ExceptionCode.USER_NOT_FOUND, null, HttpStatus.NOT_FOUND)
            );
            expect(prisma.user.findUnique).toHaveBeenCalled();
            expect(prisma.user.delete).not.toHaveBeenCalled();
        });
    });
});
