import { IsString, IsOptional, IsEnum } from "class-validator";
import { NotificationType } from "../../common/enums";

export class CreateNotificationDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsEnum(NotificationType)
    @IsOptional()
    type?: NotificationType;
}
