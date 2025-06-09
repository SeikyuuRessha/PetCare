import { IsString, IsDateString, IsOptional, IsEnum } from "class-validator";
import { BoardingReservationStatus } from "../../common/enums";

export class CreateBoardingReservationDto {
    @IsString()
    petId: string;

    @IsString()
    roomId: string;

    @IsDateString()
    checkInDate: string;

    @IsDateString()
    checkOutDate: string;

    @IsOptional()
    @IsEnum(BoardingReservationStatus)
    status?: BoardingReservationStatus = BoardingReservationStatus.CONFIRMED;
}
