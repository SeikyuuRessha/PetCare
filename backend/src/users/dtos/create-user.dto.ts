import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from "class-validator";
import { UserRole } from "../../common/enums";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    username: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    fullName: string;

    @IsString()
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
    role?: UserRole = UserRole.USER;
}
