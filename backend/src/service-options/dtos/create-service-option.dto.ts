import { IsString, IsOptional, IsNumber, IsPositive } from "class-validator";

export class CreateServiceOptionDto {
    @IsString()
    optionName: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    serviceId: string;
}
