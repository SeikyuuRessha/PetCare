import { IsString, IsInt, IsOptional, Min } from "class-validator";

export class CreateMedicationPackageDto {
    @IsString()
    medicineId: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsString()
    @IsOptional()
    instruction?: string;
}
