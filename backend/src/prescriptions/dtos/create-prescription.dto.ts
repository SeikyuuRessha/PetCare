import { IsString } from "class-validator";

export class CreatePrescriptionDto {
    @IsString()
    recordId: string;
}
