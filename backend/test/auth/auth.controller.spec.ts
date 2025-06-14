import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../src/auth/auth.controller";
import { AuthService } from "../../src/auth/auth.service";
import { LoginDto, RegisterDto, RefreshTokenDto } from "../../src/auth/dto/auth.dto";
import { AppException } from "../../src/common/exceptions/app.exception";
import { ExceptionCode } from "../../src/common/exception/exception-code";
import { CustomValidationPipe } from "../../src/common/pipes/custom-validation.pipe";
import { authTestCases } from "./test-cases/auth.test-cases";
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

describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshTokens: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();
        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        it("should successfully login with valid credentials", async () => {
            const { loginDto, expectedResponse } = authTestCases.login.valid;

            mockAuthService.login.mockResolvedValue(expectedResponse);

            const result = await controller.login(loginDto);

            expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
            expect(result).toEqual({
                code: 1,
                data: expectedResponse,
                message: "Success",
            });
        });

        it("should throw exception for invalid credentials", async () => {
            const { loginDto } = authTestCases.login.invalid.wrongCredentials;

            mockAuthService.login.mockRejectedValue(new AppException(ExceptionCode.INVALID_CREDENTIALS));

            await expect(controller.login(loginDto)).rejects.toThrow(AppException);
            expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
        });

        it("should throw exception for non-existent user", async () => {
            const { loginDto } = authTestCases.login.invalid.userNotFound;

            mockAuthService.login.mockRejectedValue(new AppException(ExceptionCode.INVALID_CREDENTIALS));

            await expect(controller.login(loginDto)).rejects.toThrow(AppException);
            expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
        });
        it("should validate required username field", async () => {
            const { loginDto } = authTestCases.login.invalid.missingUsername;

            await expect(validateDto(loginDto, LoginDto)).rejects.toThrow("Validation failed");
        });

        it("should validate required password field", async () => {
            const { loginDto } = authTestCases.login.invalid.missingPassword;

            await expect(validateDto(loginDto, LoginDto)).rejects.toThrow("Validation failed");
        });

        it("should validate minimum password length", async () => {
            const { loginDto } = authTestCases.login.invalid.shortPassword;

            await expect(validateDto(loginDto, LoginDto)).rejects.toThrow("Validation failed");
        });
    });

    describe("register", () => {
        it("should successfully register a new user", async () => {
            const { registerDto, expectedResponse } = authTestCases.register.valid;

            mockAuthService.register.mockResolvedValue(expectedResponse);

            const result = await controller.register(registerDto);

            expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
            expect(result).toEqual({
                code: 1,
                data: expectedResponse,
                message: "Success",
            });
        });

        it("should throw exception for duplicate username", async () => {
            const { registerDto } = authTestCases.register.invalid.duplicateUsername;

            mockAuthService.register.mockRejectedValue(new AppException(ExceptionCode.USER_ALREADY_EXISTS));

            await expect(controller.register(registerDto)).rejects.toThrow(AppException);
            expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
        });

        it("should throw exception for duplicate email", async () => {
            const { registerDto } = authTestCases.register.invalid.duplicateEmail;

            mockAuthService.register.mockRejectedValue(new AppException(ExceptionCode.EMAIL_ALREADY_EXISTS));

            await expect(controller.register(registerDto)).rejects.toThrow(AppException);
            expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
        });
        it("should validate required username field", async () => {
            const { registerDto } = authTestCases.register.invalid.missingUsername;

            await expect(validateDto(registerDto, RegisterDto)).rejects.toThrow("Validation failed");
        });

        it("should validate minimum username length", async () => {
            const { registerDto } = authTestCases.register.invalid.shortUsername;

            await expect(validateDto(registerDto, RegisterDto)).rejects.toThrow("Validation failed");
        });

        it("should validate email format", async () => {
            const { registerDto } = authTestCases.register.invalid.invalidEmail;

            await expect(validateDto(registerDto, RegisterDto)).rejects.toThrow("Validation failed");
        });

        it("should validate minimum password length", async () => {
            const { registerDto } = authTestCases.register.invalid.shortPassword;

            await expect(validateDto(registerDto, RegisterDto)).rejects.toThrow("Validation failed");
        });
    });

    describe("refreshTokens", () => {
        it("should successfully refresh tokens", async () => {
            const { refreshTokenDto, expectedTokens } = authTestCases.refreshTokens.valid;

            mockAuthService.refreshTokens.mockResolvedValue(expectedTokens);

            const result = await controller.refreshTokens(refreshTokenDto);

            expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
            expect(result).toEqual({
                code: 1,
                data: expectedTokens,
                message: "Success",
            });
        });

        it("should throw exception for invalid refresh token", async () => {
            const { refreshTokenDto } = authTestCases.refreshTokens.invalid.invalidToken;

            mockAuthService.refreshTokens.mockRejectedValue(new AppException(ExceptionCode.TOKEN_INVALID));

            await expect(controller.refreshTokens(refreshTokenDto)).rejects.toThrow(AppException);
            expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
        });

        it("should throw exception for expired refresh token", async () => {
            const { refreshTokenDto } = authTestCases.refreshTokens.invalid.expiredToken;

            mockAuthService.refreshTokens.mockRejectedValue(new AppException(ExceptionCode.TOKEN_INVALID));

            await expect(controller.refreshTokens(refreshTokenDto)).rejects.toThrow(AppException);
            expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
        });
        it("should validate required refresh token field", async () => {
            const { refreshTokenDto } = authTestCases.refreshTokens.invalid.missingToken;

            await expect(validateDto(refreshTokenDto, RefreshTokenDto)).rejects.toThrow("Validation failed");
        });
    });

    describe("logout", () => {
        it("should successfully logout user", async () => {
            const { userId } = authTestCases.logout.valid;

            mockAuthService.logout.mockResolvedValue(undefined);

            const result = await controller.logout(userId);

            expect(mockAuthService.logout).toHaveBeenCalledWith(userId);
            expect(result).toEqual({
                code: 1,
                data: undefined,
                message: "Success",
            });
        });

        it("should handle logout for non-existent user gracefully", async () => {
            const { invalidUserId } = authTestCases.logout.invalid;

            mockAuthService.logout.mockResolvedValue(undefined);

            const result = await controller.logout(invalidUserId);

            expect(mockAuthService.logout).toHaveBeenCalledWith(invalidUserId);
            expect(result).toEqual({
                code: 1,
                data: undefined,
                message: "Success",
            });
        });
    });
});
