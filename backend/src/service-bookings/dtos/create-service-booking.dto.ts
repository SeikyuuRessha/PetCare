import { IsString, IsDateString, IsOptional, IsEnum } from "class-validator";
import { ServiceBookingStatus } from "../../common/enums";

export class CreateServiceBookingDto {
    @IsString()
    petId: string;

    @IsString()
    serviceOptionId: string;

    @IsDateString()
    bookingDate: string;

    @IsOptional()
    @IsEnum(ServiceBookingStatus)
    status?: ServiceBookingStatus = ServiceBookingStatus.PENDING;

    @IsOptional()
    @IsString()
    specialRequirements?: string;
}
