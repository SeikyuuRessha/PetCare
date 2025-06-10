import api from "./api";

// Notification interfaces
export interface Notification {
    notificationId: string;
    title?: string;
    message?: string;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
    createdAt?: string;
}

export interface NotificationUser {
    notificationId: string;
    userId: string;
    notification?: Notification;
    user?: {
        userId: string;
        fullName: string;
        username: string;
        email: string;
    };
}

export interface CreateNotificationData {
    title?: string;
    message?: string;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
}

export interface CreateNotificationUserData {
    notificationId: string;
    userIds: string[];
}

export interface UpdateNotificationData {
    title?: string;
    message?: string;
    type?: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
}

export const notificationService = {
    // Create notification (ADMIN, EMPLOYEE)
    createNotification: async (
        data: CreateNotificationData
    ): Promise<Notification> => {
        const response = await api.post("/notifications", data);
        return response.data.data;
    },

    // Get all notifications (ADMIN, EMPLOYEE)
    getAllNotifications: async (): Promise<Notification[]> => {
        const response = await api.get("/notifications");
        return response.data.data.items;
    },

    // Get notification by ID (ADMIN, EMPLOYEE)
    getNotificationById: async (id: string): Promise<Notification> => {
        const response = await api.get(`/notifications/${id}`);
        return response.data.data;
    },

    // Send notification to users (ADMIN, EMPLOYEE)
    sendNotificationToUsers: async (
        data: CreateNotificationUserData
    ): Promise<void> => {
        await api.post("/notifications/send-to-users", data);
    },

    // Get my notifications (authenticated user)
    getMyNotifications: async (): Promise<NotificationUser[]> => {
        const response = await api.get("/notifications/my");
        return response.data.data.items;
    },

    // Get unread notifications count (authenticated user)
    getUnreadCount: async (): Promise<number> => {
        const response = await api.get("/notifications/unread-count");
        return response.data.data.count;
    },

    // Mark notification as read (authenticated user)
    markAsRead: async (notificationUserId: string): Promise<void> => {
        await api.patch(`/notifications/mark-read/${notificationUserId}`);
    },

    // Mark all notifications as read (authenticated user)
    markAllAsRead: async (): Promise<void> => {
        await api.patch("/notifications/mark-all-read");
    },

    // Update notification (ADMIN, EMPLOYEE)
    updateNotification: async (
        id: string,
        data: UpdateNotificationData
    ): Promise<Notification> => {
        const response = await api.patch(`/notifications/${id}`, data);
        return response.data.data;
    },

    // Delete notification (ADMIN only)
    deleteNotification: async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    },

    // Delete notification user (ADMIN, EMPLOYEE, own notification)
    deleteNotificationUser: async (id: string): Promise<void> => {
        await api.delete(`/notifications/user/${id}`);
    },
};
