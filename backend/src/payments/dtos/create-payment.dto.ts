import { IsString, IsOptional, IsNumber, IsPositive, IsEnum } from "class-validator";
import { PaymentStatus } from "../../common/enums";

export class CreatePaymentDto {
    @IsString()
    userId: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    totalAmount?: number;

    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus = PaymentStatus.PENDING;

    @IsOptional()
    @IsString()
    roomBookId?: string;

    @IsOptional()
    @IsString()
    serviceBookingId?: string;
}
