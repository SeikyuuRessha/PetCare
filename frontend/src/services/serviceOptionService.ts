import api from "./api";

export interface ServiceOption {
    optionId: string; // Match backend field
    optionName: string;
    price?: number; // Backend field name (Decimal)
    description?: string;
    serviceId: string;
    service?: {
        serviceId: string; // Match backend field
        serviceName: string; // Match backend field
        description?: string;
    };
}

export interface CreateServiceOptionDto {
    serviceId: string;
    optionName: string;
    description?: string;
    price?: number; // Match backend field
}

export interface UpdateServiceOptionDto {
    serviceId?: string;
    optionName?: string;
    description?: string;
    price?: number;
}

export const serviceOptionService = {
    // Create service option (ADMIN, EMPLOYEE)
    create: async (data: CreateServiceOptionDto): Promise<ServiceOption> => {
        try {
            const response = await api.post("/service-options", data);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to create service option"
            );
        }
    },

    // Get all service options (public access)
    getAll: async (): Promise<ServiceOption[]> => {
        try {
            const response = await api.get("/service-options");
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch service options"
            );
        }
    },

    // Get service option by ID (public access)
    getById: async (id: string): Promise<ServiceOption> => {
        try {
            const response = await api.get(`/service-options/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch service option"
            );
        }
    },

    // Get service options by service ID (public access)
    getByService: async (serviceId: string): Promise<ServiceOption[]> => {
        try {
            const response = await api.get(
                `/service-options/service/${serviceId}`
            );
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to fetch service options"
            );
        }
    },

    // Update service option (ADMIN, EMPLOYEE)
    update: async (
        id: string,
        data: UpdateServiceOptionDto
    ): Promise<ServiceOption> => {
        try {
            const response = await api.patch(`/service-options/${id}`, data);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to update service option"
            );
        }
    },

    // Delete service option (ADMIN only)
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/service-options/${id}`);
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                    "Failed to delete service option"
            );
        }
    },

    // Helper method to format option display
    formatOptionDisplay: (option: ServiceOption): string => {
        const priceText = option.price ? ` (+$${option.price})` : "";
        return `${option.optionName}${priceText}`;
    },
};
