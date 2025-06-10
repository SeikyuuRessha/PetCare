import api from "./api";

// Room interfaces
export interface Room {
    roomId: string;
    roomNumber: number;
    capacity: number;
    price: number;
    status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoomData {
    roomNumber: number;
    capacity: number;
    price: number;
    status?: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
    description?: string;
}

export interface UpdateRoomData {
    roomNumber?: number;
    capacity?: number;
    price?: number;
    status?: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
    description?: string;
}

export const roomService = {
    // Get all rooms (ADMIN/EMPLOYEE can see all)
    getAllRooms: async (): Promise<Room[]> => {
        const response = await api.get("/rooms");
        return response.data.data;
    },

    // Get available rooms (everyone can access for booking)
    getAvailableRooms: async (): Promise<Room[]> => {
        const response = await api.get("/rooms/available");
        return response.data.data;
    },

    // Get room by ID
    getRoomById: async (id: string): Promise<Room> => {
        const response = await api.get(`/rooms/${id}`);
        return response.data.data;
    },

    // Create room (ADMIN/EMPLOYEE only)
    createRoom: async (data: CreateRoomData): Promise<Room> => {
        const response = await api.post("/rooms", data);
        return response.data.data;
    },

    // Update room (ADMIN/EMPLOYEE only)
    updateRoom: async (id: string, data: UpdateRoomData): Promise<Room> => {
        const response = await api.patch(`/rooms/${id}`, data);
        return response.data.data;
    },

    // Delete room (ADMIN only)
    deleteRoom: async (id: string): Promise<void> => {
        await api.delete(`/rooms/${id}`);
    },
};
