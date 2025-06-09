import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";
import { JwtPayload, TokenPair, LoginResponse } from "./interfaces/auth.interface";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService
    ) {}
    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { username, password } = loginDto;

        // Find user by username
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new AppException(ExceptionCode.INVALID_CREDENTIALS);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppException(ExceptionCode.INVALID_CREDENTIALS);
        }

        // Generate tokens
        const tokens = await this.generateTokens({
            sub: user.userId,
            username: user.username,
            email: user.email || "",
            role: user.role,
        });

        // Update refresh token in database
        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.updateRefreshToken(user.userId, hashedRefreshToken);

        return {
            user: {
                id: user.userId,
                username: user.username,
                email: user.email || "",
                fullName: user.fullName || "",
                role: user.role,
            },
            tokens,
        };
    }
    async register(registerDto: RegisterDto): Promise<LoginResponse> {
        // Create user through UsersService (it will handle validation and hashing)
        const userResponse = await this.usersService.create(registerDto);
        const newUser = userResponse.data; // Extract user from response

        // Generate tokens for the new user
        const tokens = await this.generateTokens({
            sub: newUser.userId,
            username: newUser.username,
            email: newUser.email || "",
            role: newUser.role,
        });

        // Update refresh token in database
        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.updateRefreshToken(newUser.userId, hashedRefreshToken);

        return {
            user: {
                id: newUser.userId,
                username: newUser.username,
                email: newUser.email || "",
                fullName: newUser.fullName || "",
                role: newUser.role,
            },
            tokens,
        };
    }

    async logout(userId: string): Promise<void> {
        await this.usersService.updateRefreshToken(userId, null);
    }

    async refreshTokens(refreshToken: string): Promise<TokenPair> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.refreshToken) {
                throw new AppException(ExceptionCode.TOKEN_INVALID);
            }

            const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isRefreshTokenValid) {
                throw new AppException(ExceptionCode.TOKEN_INVALID);
            }
            const tokens = await this.generateTokens({
                sub: user.userId,
                username: user.username,
                email: user.email || "",
                role: user.role,
            });

            const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
            await this.usersService.updateRefreshToken(user.userId, hashedRefreshToken);

            return tokens;
        } catch (error) {
            throw new AppException(ExceptionCode.TOKEN_INVALID);
        }
    }

    async validateAccessToken(payload: JwtPayload): Promise<any> {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new AppException(ExceptionCode.USER_NOT_FOUND);
        }
        return user;
    }

    private async generateTokens(payload: JwtPayload): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
                expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRES_IN", "15m"),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
                expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN", "7d"),
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
