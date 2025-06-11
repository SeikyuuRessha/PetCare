import api from "./api";

// User service functions
export interface User {
    userId: string;
    id: string;
    username: string;
    email: string;
    fullName: string;
    phone?: string;
    address?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    username: string;
    email?: string;
    fullName: string;
    phone?: string;
    address?: string;
}

export const userService = {
    // Get current user profile
    getProfile: async (): Promise<User> => {
        const response = await api.get("/users/me");
        return response.data.data;
    },

    // Update current user profile
    updateProfile: async (data: Partial<UserProfile>): Promise<User> => {
        const response = await api.patch("/users/me", data);
        return response.data.data;
    },

    // Get all users (ADMIN only)
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get("/users");
        return response.data.data;
    },

    // Get user by ID (ADMIN only)
    getUserById: async (id: string): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data.data;
    },

    // Update user by ID (ADMIN only)
    updateUser: async (
        id: string,
        data: Partial<UserProfile>
    ): Promise<User> => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data.data;
    },

    // Delete user by ID (ADMIN only)
    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
    getAll: async (): Promise<User[]> => {
        const response = await api.get("/users");
        return response.data.data.items || [];
    }
};
