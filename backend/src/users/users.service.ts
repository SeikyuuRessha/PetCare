import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/enums/exception-code.enum";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        return handleService(async () => {
            // Check if username already exists
            const existingUser = await this.prisma.user.findUnique({
                where: { username: createUserDto.username },
            });
            if (existingUser) {
                throw AppException.conflict("Username already exists", ExceptionCode.USERNAME_ALREADY_EXISTS);
            }

            // Check if email already exists (if provided)
            if (createUserDto.email) {
                const existingEmail = await this.prisma.user.findUnique({
                    where: { email: createUserDto.email },
                });
                if (existingEmail) {
                    throw AppException.conflict("Email already exists", ExceptionCode.EMAIL_ALREADY_EXISTS);
                }
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

            return this.prisma.user.create({
                data: {
                    ...createUserDto,
                    password: hashedPassword,
                },
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.user.findMany({
                select: {
                    userId: true,
                    username: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    address: true,
                    role: true,
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const user = await this.prisma.user.findUnique({
                where: { userId: id },
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

            if (!user) {
                throw AppException.notFound("User not found", ExceptionCode.USER_NOT_FOUND);
            }

            return user;
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return handleService(async () => {
            const user = await this.prisma.user.findUnique({
                where: { userId: id },
            });

            if (!user) {
                throw AppException.notFound("User not found", ExceptionCode.USER_NOT_FOUND);
            }

            // Check username uniqueness if updating
            if (updateUserDto.username && updateUserDto.username !== user.username) {
                const existingUser = await this.prisma.user.findUnique({
                    where: { username: updateUserDto.username },
                });
                if (existingUser) {
                    throw AppException.conflict("Username already exists", ExceptionCode.USERNAME_ALREADY_EXISTS);
                }
            }

            // Check email uniqueness if updating
            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingEmail = await this.prisma.user.findUnique({
                    where: { email: updateUserDto.email },
                });
                if (existingEmail) {
                    throw AppException.conflict("Email already exists", ExceptionCode.EMAIL_ALREADY_EXISTS);
                }
            }

            // Hash password if updating
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }

            return this.prisma.user.update({
                where: { userId: id },
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
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const user = await this.prisma.user.findUnique({
                where: { userId: id },
            });

            if (!user) {
                throw AppException.notFound("User not found", ExceptionCode.USER_NOT_FOUND);
            }

            return this.prisma.user.delete({
                where: { userId: id },
            });
        });
    }

    // Authentication-related methods
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { userId: id },
        });
    }

    async updateRefreshToken(userId: string, refreshToken: string | null) {
        return this.prisma.user.update({
            where: { userId },
            data: { refreshToken },
        });
    }
}
