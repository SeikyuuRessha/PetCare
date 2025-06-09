import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotificationDto } from "./dtos/create-notification.dto";
import { UpdateNotificationDto } from "./dtos/update-notification.dto";
import { CreateNotificationUserDto } from "./dtos/create-notification-user.dto";
import { handleService } from "../common/utils/handleService";
import { AppException, ExceptionCode } from "../common/exception/app-exception";

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createNotificationDto: CreateNotificationDto) {
        return handleService(() =>
            this.prisma.notification.create({
                data: createNotificationDto,
                include: {
                    notificationUsers: {
                        include: {
                            user: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
            })
        );
    }

    async findAll() {
        return handleService(() =>
            this.prisma.notification.findMany({
                include: {
                    notificationUsers: {
                        include: {
                            user: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const notification = await this.prisma.notification.findUnique({
                where: { notificationId: id },
                include: {
                    notificationUsers: {
                        include: {
                            user: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!notification) {
                throw new AppException(ExceptionCode.NOTIFICATION_NOT_FOUND);
            }

            return notification;
        });
    }

    async findByUser(userId: string) {
        return handleService(() =>
            this.prisma.notification.findMany({
                where: {
                    notificationUsers: {
                        some: {
                            userId: userId,
                        },
                    },
                },
                include: {
                    notificationUsers: {
                        where: {
                            userId: userId,
                        },
                        include: {
                            user: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            })
        );
    }

    async addUsersToNotification(createNotificationUserDto: CreateNotificationUserDto) {
        return handleService(async () => {
            // Check if notification exists
            const notification = await this.prisma.notification.findUnique({
                where: { notificationId: createNotificationUserDto.notificationId },
            });

            if (!notification) {
                throw new AppException(ExceptionCode.NOTIFICATION_NOT_FOUND);
            }

            // Check if all users exist
            const users = await this.prisma.user.findMany({
                where: {
                    userId: {
                        in: createNotificationUserDto.userIds,
                    },
                },
            });

            if (users.length !== createNotificationUserDto.userIds.length) {
                throw new AppException(ExceptionCode.USER_NOT_FOUND);
            }

            // Create notification-user relationships
            const notificationUsers = createNotificationUserDto.userIds.map((userId) => ({
                notificationId: createNotificationUserDto.notificationId,
                userId,
            }));
            await this.prisma.notificationUser.createMany({
                data: notificationUsers,
            });

            return this.findOne(createNotificationUserDto.notificationId);
        });
    }

    async update(id: string, updateNotificationDto: UpdateNotificationDto) {
        return handleService(async () => {
            const notification = await this.prisma.notification.findUnique({
                where: { notificationId: id },
            });

            if (!notification) {
                throw new AppException(ExceptionCode.NOTIFICATION_NOT_FOUND);
            }

            return this.prisma.notification.update({
                where: { notificationId: id },
                data: updateNotificationDto,
                include: {
                    notificationUsers: {
                        include: {
                            user: {
                                select: {
                                    userId: true,
                                    fullName: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const notification = await this.prisma.notification.findUnique({
                where: { notificationId: id },
            });

            if (!notification) {
                throw new AppException(ExceptionCode.NOTIFICATION_NOT_FOUND);
            }

            return this.prisma.notification.delete({
                where: { notificationId: id },
            });
        });
    }

    async removeUserFromNotification(notificationId: string, userId: string) {
        return handleService(async () => {
            const notificationUser = await this.prisma.notificationUser.findUnique({
                where: {
                    notificationId_userId: {
                        notificationId,
                        userId,
                    },
                },
            });

            if (!notificationUser) {
                throw new AppException(ExceptionCode.NOTIFICATION_USER_NOT_FOUND);
            }

            await this.prisma.notificationUser.delete({
                where: {
                    notificationId_userId: {
                        notificationId,
                        userId,
                    },
                },
            });

            return { message: "User removed from notification successfully" };
        });
    }
}
