import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class CreateServiceDto {
    @IsString()
    @MinLength(1, { message: "Service name cannot be empty" })
    @MaxLength(100, { message: "Service name cannot be longer than 100 characters" })
    serviceName: string;

    @IsOptional()
    @IsString()
    description?: string;
}
