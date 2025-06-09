import { IsNumber, IsPositive, IsOptional, IsString, IsEnum } from "class-validator";
import { RoomStatus } from "../../common/enums";

export class CreateRoomDto {
    @IsNumber()
    @IsPositive()
    roomNumber: number;

    @IsNumber()
    @IsPositive()
    capacity: number;

    @IsOptional()
    @IsEnum(RoomStatus)
    status?: RoomStatus = RoomStatus.AVAILABLE;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price?: number;
}
