import { IsString, IsOptional, IsDateString } from "class-validator";

export class CreateMedicalRecordDto {
    @IsString()
    doctorId: string;

    @IsOptional()
    @IsString()
    appointmentId?: string;

    @IsOptional()
    @IsString()
    diagnosis?: string;

    @IsOptional()
    @IsDateString()
    nextCheckupDate?: string;
}
