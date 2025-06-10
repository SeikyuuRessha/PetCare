import api from "./api";

// Pet service functions
export interface Pet {
    petId: string; // Match backend field
    name: string;
    gender?: string; // Backend có MALE, FEMALE
    species?: string;
    breed?: string;
    color?: string;
    imageUrl?: string; // Backend field
    identifyingMarks?: string; // Backend field
    ownerId?: string;
    owner?: {
        userId: string; // Match backend field
        username: string;
        fullName: string;
    };
}

export interface CreatePetData {
    name: string;
    gender?: string;
    species?: string;
    breed?: string;
    color?: string;
    imageUrl?: string;
    identifyingMarks?: string;
    medicalHistory?: string;
    // ownerId không cần thiết vì backend tự động gán từ token
}

export const petService = {
    // Create new pet
    createPet: async (data: CreatePetData): Promise<Pet> => {
        const response = await api.post("/pets", data);
        return response.data.data;
    }, // Get current user's pets
    getMyPets: async (): Promise<Pet[]> => {
        const response = await api.get("/pets/my/pets");
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    },

    // Get all pets (ADMIN/EMPLOYEE only)
    getAllPets: async (): Promise<Pet[]> => {
        const response = await api.get("/pets");
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    },

    // Get pet by ID
    getPetById: async (id: string): Promise<Pet> => {
        const response = await api.get(`/pets/${id}`);
        return response.data.data;
    }, // Get pets by owner ID (ADMIN/EMPLOYEE only)
    getPetsByOwner: async (ownerId: string): Promise<Pet[]> => {
        const response = await api.get(`/pets/owner/${ownerId}`);
        // Handle different possible response structures
        if (response.data.data) {
            return response.data.data.items || response.data.data || [];
        }
        return response.data || [];
    },

    // Update pet
    updatePet: async (
        id: string,
        data: Partial<CreatePetData>
    ): Promise<Pet> => {
        const response = await api.patch(`/pets/${id}`, data);
        return response.data.data;
    },

    // Delete pet
    deletePet: async (id: string): Promise<void> => {
        await api.delete(`/pets/${id}`);
    },
};
