import { IsString, IsArray, IsOptional } from "class-validator";

export class CreateNotificationUserDto {
    @IsString()
    notificationId: string;

    @IsArray()
    @IsString({ each: true })
    userIds: string[];
}
