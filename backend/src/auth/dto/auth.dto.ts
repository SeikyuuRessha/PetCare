import { IsNotEmpty, IsString, MinLength, IsEmail, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "../../common/enums";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
