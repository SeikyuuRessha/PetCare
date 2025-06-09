import { IsString, IsOptional } from "class-validator";

export class CreateServiceDto {
    @IsString()
    serviceName: string;

    @IsOptional()
    @IsString()
    description?: string;
}
