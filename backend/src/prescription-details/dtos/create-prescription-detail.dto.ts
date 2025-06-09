import { IsString } from "class-validator";

export class CreatePrescriptionDetailDto {
    @IsString()
    prescriptionId: string;

    @IsString()
    packageId: string;
}
