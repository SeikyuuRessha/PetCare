import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dtos/create-notification.dto";
import { UpdateNotificationDto } from "./dtos/update-notification.dto";
import { CreateNotificationUserDto } from "./dtos/create-notification-user.dto";

@Controller("notifications")
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }

    @Get()
    findAll() {
        return this.notificationsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.notificationsService.findOne(id);
    }

    @Get("user/:userId")
    findByUser(@Param("userId") userId: string) {
        return this.notificationsService.findByUser(userId);
    }

    @Post("add-users")
    addUsersToNotification(@Body() createNotificationUserDto: CreateNotificationUserDto) {
        return this.notificationsService.addUsersToNotification(createNotificationUserDto);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
        return this.notificationsService.update(id, updateNotificationDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.notificationsService.remove(id);
    }

    @Delete(":notificationId/user/:userId")
    removeUserFromNotification(@Param("notificationId") notificationId: string, @Param("userId") userId: string) {
        return this.notificationsService.removeUserFromNotification(notificationId, userId);
    }
}
