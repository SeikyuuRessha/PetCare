import { IsString, IsDateString, IsOptional, IsEnum } from "class-validator";
import { AppointmentStatus } from "../../common/enums";

export class CreateAppointmentDto {
    @IsString()
    petId: string;

    @IsDateString()
    appointmentDate: string;

    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus = AppointmentStatus.PENDING;

    @IsOptional()
    @IsString()
    symptoms?: string;
}
