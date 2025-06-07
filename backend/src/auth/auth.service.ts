import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../common/prisma.service";
import { v4 as uuidv4 } from "uuid";

export interface LoginDto {
    username: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    email?: string;
    fullName: string;
    password: string;
    phone?: string;
    address?: string;
    role?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async register(registerDto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.prismaService.user.findFirst({
            where: {
                OR: [{ username: registerDto.username }, { email: registerDto.email }],
            },
        });

        if (existingUser) {
            throw new ConflictException("User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 12);

        // Create user
        const user = await this.prismaService.user.create({
            data: {
                ...registerDto,
                password: hashedPassword,
                role: registerDto.role || "USER",
                userId: uuidv4(), // Generate a new UUID for userId
            },
            select: {
                userId: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                phone: true,
                address: true,
            },
        });

        // Generate JWT
        const payload = {
            userId: user.userId,
            username: user.username,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            user,
            accessToken,
            tokenType: "Bearer",
        };
    }

    async login(loginDto: LoginDto) {
        // Find user
        const user = await this.prismaService.user.findUnique({
            where: { username: loginDto.username },
        });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Generate JWT
        const payload = {
            userId: user.userId,
            username: user.username,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                phone: user.phone,
                address: user.address,
            },
            accessToken,
        };
    }

    async validateUser(userId: string) {
        const user = await this.prismaService.user.findUnique({
            where: { userId },
            select: {
                userId: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                phone: true,
                address: true,
            },
        });

        return user;
    }

    async getProfile(userId: string) {
        return this.validateUser(userId);
    }
}
