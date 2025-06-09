import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dtos/create-notification.dto";
import { UpdateNotificationDto } from "./dtos/update-notification.dto";
import { CreateNotificationUserDto } from "./dtos/create-notification-user.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("notifications")
@UseGuards(AccessTokenGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    // Only ADMIN and EMPLOYEE can create notifications
    @Post()
    @UseGuards(RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }

    // Only ADMIN and EMPLOYEE can view all notifications
    @Get()
    @UseGuards(RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    findAll() {
        return this.notificationsService.findAll();
    }

    // All authenticated users can view specific notification
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.notificationsService.findOne(id);
    }

    // Users can view their own notifications
    @Get("user/:userId")
    findByUser(
        @Param("userId") userId: string,
        @CurrentUser("userId") currentUserId: string,
        @CurrentUser("role") userRole: string
    ) {
        return this.notificationsService.findByUser(userId);
    }

    // Get current user's notifications
    @Get("my/notifications")
    getMyNotifications(@CurrentUser("userId") userId: string) {
        return this.notificationsService.findByUser(userId);
    }

    // Only ADMIN and EMPLOYEE can add users to notifications
    @Post("add-users")
    @UseGuards(RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    addUsersToNotification(@Body() createNotificationUserDto: CreateNotificationUserDto) {
        return this.notificationsService.addUsersToNotification(createNotificationUserDto);
    }

    // Only ADMIN and EMPLOYEE can update notifications
    @Patch(":id")
    @UseGuards(RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    update(@Param("id") id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
        return this.notificationsService.update(id, updateNotificationDto);
    }

    // Only ADMIN can delete notifications
    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.notificationsService.remove(id);
    }

    // Users can remove themselves from notifications
    @Delete(":notificationId/user/:userId")
    removeUserFromNotification(
        @Param("notificationId") notificationId: string,
        @Param("userId") userId: string,
        @CurrentUser("userId") currentUserId: string
    ) {
        return this.notificationsService.removeUserFromNotification(notificationId, userId);
    }
}
