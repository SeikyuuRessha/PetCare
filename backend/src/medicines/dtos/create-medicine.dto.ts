import { IsString, IsOptional } from "class-validator";

export class CreateMedicineDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    unit?: string;

    @IsOptional()
    @IsString()
    concentration?: string;
}
