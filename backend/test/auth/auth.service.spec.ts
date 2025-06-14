import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { AuthService } from "../../src/auth/auth.service";
import { UsersService } from "../../src/users/users.service";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { UserRole } from "../../src/common/enums";
import { authTestCases } from "./test-cases/auth.test-cases";

// Mock bcrypt
jest.mock("bcrypt");
const mockedBcrypt = jest.mocked(bcrypt);

describe("AuthService", () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;
    let configService: ConfigService;

    const mockUsersService = {
        findByUsername: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        updateRefreshToken: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
        verify: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);

        // Setup config service defaults
        mockConfigService.get.mockImplementation((key: string, defaultValue?: string) => {
            const config = {
                JWT_ACCESS_SECRET: "access-secret",
                JWT_REFRESH_SECRET: "refresh-secret",
                JWT_ACCESS_EXPIRES_IN: "15m",
                JWT_REFRESH_EXPIRES_IN: "7d",
            };
            return config[key] || defaultValue;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        const mockUser = {
            userId: "user-1",
            username: "testuser",
            email: "test@example.com",
            fullName: "Test User",
            password: "hashed-password",
            role: UserRole.USER,
        };

        const mockTokens = {
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
        };

        it("should successfully login with valid credentials", async () => {
            const { loginDto } = authTestCases.login.valid;

            mockUsersService.findByUsername.mockResolvedValue(mockUser);
            mockedBcrypt.compare.mockResolvedValue(true as never);
            mockJwtService.signAsync.mockResolvedValueOnce(mockTokens.accessToken);
            mockJwtService.signAsync.mockResolvedValueOnce(mockTokens.refreshToken);
            mockedBcrypt.hash.mockResolvedValue("hashed-refresh-token" as never);
            mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

            const result = await service.login(loginDto);

            expect(mockUsersService.findByUsername).toHaveBeenCalledWith(loginDto.username);
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
            expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
            expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(mockUser.userId, "hashed-refresh-token");

            expect(result).toEqual({
                user: {
                    id: mockUser.userId,
                    username: mockUser.username,
                    email: mockUser.email,
                    fullName: mockUser.fullName,
                    role: mockUser.role,
                },
                tokens: mockTokens,
            });
        });

        it("should throw exception when user not found", async () => {
            const { loginDto } = authTestCases.login.invalid.userNotFound;

            mockUsersService.findByUsername.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(new AppException(ExceptionCode.INVALID_CREDENTIALS));

            expect(mockUsersService.findByUsername).toHaveBeenCalledWith(loginDto.username);
            expect(mockedBcrypt.compare).not.toHaveBeenCalled();
        });

        it("should throw exception when password is invalid", async () => {
            const { loginDto } = authTestCases.login.invalid.wrongCredentials;

            mockUsersService.findByUsername.mockResolvedValue(mockUser);
            mockedBcrypt.compare.mockResolvedValue(false as never);

            await expect(service.login(loginDto)).rejects.toThrow(new AppException(ExceptionCode.INVALID_CREDENTIALS));

            expect(mockUsersService.findByUsername).toHaveBeenCalledWith(loginDto.username);
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
            expect(mockJwtService.signAsync).not.toHaveBeenCalled();
        });
    });

    describe("register", () => {
        const mockCreatedUser = {
            userId: "user-2",
            username: "newuser",
            email: "newuser@example.com",
            fullName: "New User",
            role: UserRole.USER,
        };

        const mockTokens = {
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
        };

        it("should successfully register a new user", async () => {
            const { registerDto } = authTestCases.register.valid;

            mockUsersService.create.mockResolvedValue({
                success: true,
                data: mockCreatedUser,
                message: null,
            });
            mockJwtService.signAsync.mockResolvedValueOnce(mockTokens.accessToken);
            mockJwtService.signAsync.mockResolvedValueOnce(mockTokens.refreshToken);
            mockedBcrypt.hash.mockResolvedValue("hashed-refresh-token" as never);
            mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

            const result = await service.register(registerDto);

            expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
            expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
            expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
                mockCreatedUser.userId,
                "hashed-refresh-token"
            );

            expect(result).toEqual({
                user: {
                    id: mockCreatedUser.userId,
                    username: mockCreatedUser.username,
                    email: mockCreatedUser.email,
                    fullName: mockCreatedUser.fullName,
                    role: mockCreatedUser.role,
                },
                tokens: mockTokens,
            });
        });

        it("should throw exception when username already exists", async () => {
            const { registerDto } = authTestCases.register.invalid.duplicateUsername;

            mockUsersService.create.mockRejectedValue(new AppException(ExceptionCode.USER_ALREADY_EXISTS));

            await expect(service.register(registerDto)).rejects.toThrow(
                new AppException(ExceptionCode.USER_ALREADY_EXISTS)
            );

            expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
            expect(mockJwtService.signAsync).not.toHaveBeenCalled();
        });

        it("should throw exception when email already exists", async () => {
            const { registerDto } = authTestCases.register.invalid.duplicateEmail;

            mockUsersService.create.mockRejectedValue(new AppException(ExceptionCode.EMAIL_ALREADY_EXISTS));

            await expect(service.register(registerDto)).rejects.toThrow(
                new AppException(ExceptionCode.EMAIL_ALREADY_EXISTS)
            );

            expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
            expect(mockJwtService.signAsync).not.toHaveBeenCalled();
        });
    });

    describe("refreshTokens", () => {
        const mockUser = {
            userId: "user-1",
            username: "testuser",
            email: "test@example.com",
            fullName: "Test User",
            role: UserRole.USER,
            refreshToken: "hashed-stored-refresh-token",
        };

        const mockNewTokens = {
            accessToken: "new-access-token",
            refreshToken: "new-refresh-token",
        };

        it("should successfully refresh tokens with valid refresh token", async () => {
            const { refreshTokenDto } = authTestCases.refreshTokens.valid;
            const mockPayload = {
                sub: mockUser.userId,
                username: mockUser.username,
                email: mockUser.email,
                role: mockUser.role,
            };

            mockJwtService.verify.mockReturnValue(mockPayload);
            mockUsersService.findById.mockResolvedValue(mockUser);
            mockedBcrypt.compare.mockResolvedValue(true as never);
            mockJwtService.signAsync.mockResolvedValueOnce(mockNewTokens.accessToken);
            mockJwtService.signAsync.mockResolvedValueOnce(mockNewTokens.refreshToken);
            mockedBcrypt.hash.mockResolvedValue("new-hashed-refresh-token" as never);
            mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

            const result = await service.refreshTokens(refreshTokenDto.refreshToken);

            expect(mockJwtService.verify).toHaveBeenCalledWith(refreshTokenDto.refreshToken, {
                secret: "refresh-secret",
            });
            expect(mockUsersService.findById).toHaveBeenCalledWith(mockPayload.sub);
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(refreshTokenDto.refreshToken, mockUser.refreshToken);
            expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
            expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
                mockUser.userId,
                "new-hashed-refresh-token"
            );

            expect(result).toEqual(mockNewTokens);
        });

        it("should throw exception when JWT verification fails", async () => {
            const { refreshTokenDto } = authTestCases.refreshTokens.invalid.invalidToken;

            mockJwtService.verify.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            await expect(service.refreshTokens(refreshTokenDto.refreshToken)).rejects.toThrow(
                new AppException(ExceptionCode.TOKEN_INVALID)
            );

            expect(mockJwtService.verify).toHaveBeenCalledWith(refreshTokenDto.refreshToken, {
                secret: "refresh-secret",
            });
            expect(mockUsersService.findById).not.toHaveBeenCalled();
        });

        it("should throw exception when user not found", async () => {
            const { refreshTokenDto } = authTestCases.refreshTokens.valid;
            const mockPayload = {
                sub: "non-existent-user",
                username: "testuser",
                email: "test@example.com",
                role: UserRole.USER,
            };

            mockJwtService.verify.mockReturnValue(mockPayload);
            mockUsersService.findById.mockResolvedValue(null);

            await expect(service.refreshTokens(refreshTokenDto.refreshToken)).rejects.toThrow(
                new AppException(ExceptionCode.TOKEN_INVALID)
            );

            expect(mockJwtService.verify).toHaveBeenCalledWith(refreshTokenDto.refreshToken, {
                secret: "refresh-secret",
            });
            expect(mockUsersService.findById).toHaveBeenCalledWith(mockPayload.sub);
            expect(mockedBcrypt.compare).not.toHaveBeenCalled();
        });

        it("should throw exception when user has no refresh token stored", async () => {
            const { refreshTokenDto } = authTestCases.refreshTokens.valid;
            const mockPayload = {
                sub: mockUser.userId,
                username: mockUser.username,
                email: mockUser.email,
                role: mockUser.role,
            };
            const userWithoutRefreshToken = { ...mockUser, refreshToken: null };

            mockJwtService.verify.mockReturnValue(mockPayload);
            mockUsersService.findById.mockResolvedValue(userWithoutRefreshToken);

            await expect(service.refreshTokens(refreshTokenDto.refreshToken)).rejects.toThrow(
                new AppException(ExceptionCode.TOKEN_INVALID)
            );

            expect(mockJwtService.verify).toHaveBeenCalledWith(refreshTokenDto.refreshToken, {
                secret: "refresh-secret",
            });
            expect(mockUsersService.findById).toHaveBeenCalledWith(mockPayload.sub);
            expect(mockedBcrypt.compare).not.toHaveBeenCalled();
        });

        it("should throw exception when refresh token does not match stored token", async () => {
            const { refreshTokenDto } = authTestCases.refreshTokens.invalid.invalidToken;
            const mockPayload = {
                sub: mockUser.userId,
                username: mockUser.username,
                email: mockUser.email,
                role: mockUser.role,
            };

            mockJwtService.verify.mockReturnValue(mockPayload);
            mockUsersService.findById.mockResolvedValue(mockUser);
            mockedBcrypt.compare.mockResolvedValue(false as never);

            await expect(service.refreshTokens(refreshTokenDto.refreshToken)).rejects.toThrow(
                new AppException(ExceptionCode.TOKEN_INVALID)
            );

            expect(mockJwtService.verify).toHaveBeenCalledWith(refreshTokenDto.refreshToken, {
                secret: "refresh-secret",
            });
            expect(mockUsersService.findById).toHaveBeenCalledWith(mockPayload.sub);
            expect(mockedBcrypt.compare).toHaveBeenCalledWith(refreshTokenDto.refreshToken, mockUser.refreshToken);
            expect(mockJwtService.signAsync).not.toHaveBeenCalled();
        });
    });

    describe("logout", () => {
        it("should successfully logout user", async () => {
            const { userId } = authTestCases.logout.valid;

            mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

            await service.logout(userId);

            expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(userId, null);
        });

        it("should handle logout for non-existent user gracefully", async () => {
            const { invalidUserId } = authTestCases.logout.invalid;

            mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

            await service.logout(invalidUserId);

            expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(invalidUserId, null);
        });
    });

    describe("validateAccessToken", () => {
        const mockUser = {
            userId: "user-1",
            username: "testuser",
            email: "test@example.com",
            fullName: "Test User",
            role: UserRole.USER,
        };

        const mockPayload = {
            sub: mockUser.userId,
            username: mockUser.username,
            email: mockUser.email,
            role: mockUser.role,
        };

        it("should successfully validate access token and return user", async () => {
            mockUsersService.findById.mockResolvedValue(mockUser);

            const result = await service.validateAccessToken(mockPayload);

            expect(mockUsersService.findById).toHaveBeenCalledWith(mockPayload.sub);
            expect(result).toEqual(mockUser);
        });

        it("should throw exception when user not found", async () => {
            mockUsersService.findById.mockResolvedValue(null);

            await expect(service.validateAccessToken(mockPayload)).rejects.toThrow(
                new AppException(ExceptionCode.USER_NOT_FOUND)
            );

            expect(mockUsersService.findById).toHaveBeenCalledWith(mockPayload.sub);
        });
    });
});
