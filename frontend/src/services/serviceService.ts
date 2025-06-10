import api from "./api";

// Service interfaces
export interface Service {
    serviceId: string;
    serviceName: string;
    description?: string;
    serviceOptions?: ServiceOption[];
}

export interface ServiceOption {
    optionId: string;
    serviceId: string;
    optionName: string;
    price?: number;
    description?: string;
    service?: {
        serviceId: string;
        serviceName: string;
        description?: string;
    };
}

export interface CreateServiceData {
    serviceName: string;
    description?: string;
}

export interface UpdateServiceData {
    serviceName?: string;
    description?: string;
}

export interface CreateServiceOptionData {
    serviceId: string;
    optionName: string;
    price: number;
    description?: string;
}

export interface UpdateServiceOptionData {
    serviceId?: string;
    optionName?: string;
    price?: number;
    description?: string;
}

export const serviceService = {
    // Get all services (everyone can access)
    getAllServices: async (): Promise<Service[]> => {
        const response = await api.get("/services");
        return response.data.data;
    },

    // Get service by ID (everyone can access)
    getServiceById: async (id: string): Promise<Service> => {
        const response = await api.get(`/services/${id}`);
        return response.data.data;
    },

    // Create service (ADMIN/EMPLOYEE only)
    createService: async (data: CreateServiceData): Promise<Service> => {
        const response = await api.post("/services", data);
        return response.data.data;
    },

    // Update service (ADMIN/EMPLOYEE only)
    updateService: async (
        id: string,
        data: UpdateServiceData
    ): Promise<Service> => {
        const response = await api.patch(`/services/${id}`, data);
        return response.data.data;
    },

    // Delete service (ADMIN only)
    deleteService: async (id: string): Promise<void> => {
        await api.delete(`/services/${id}`);
    },
};

export const serviceOptionService = {
    // Get all service options (everyone can access)
    getAllServiceOptions: async (): Promise<ServiceOption[]> => {
        const response = await api.get("/service-options");
        return response.data.data;
    },

    // Get service option by ID (everyone can access)
    getServiceOptionById: async (id: string): Promise<ServiceOption> => {
        const response = await api.get(`/service-options/${id}`);
        return response.data.data;
    },

    // Get service options by service ID (everyone can access)
    getServiceOptionsByService: async (
        serviceId: string
    ): Promise<ServiceOption[]> => {
        const response = await api.get(`/service-options/service/${serviceId}`);
        return response.data.data;
    },

    // Create service option (ADMIN/EMPLOYEE only)
    createServiceOption: async (
        data: CreateServiceOptionData
    ): Promise<ServiceOption> => {
        const response = await api.post("/service-options", data);
        return response.data.data;
    },

    // Update service option (ADMIN/EMPLOYEE only)
    updateServiceOption: async (
        id: string,
        data: UpdateServiceOptionData
    ): Promise<ServiceOption> => {
        const response = await api.patch(`/service-options/${id}`, data);
        return response.data.data;
    },

    // Delete service option (ADMIN only)
    deleteServiceOption: async (id: string): Promise<void> => {
        await api.delete(`/service-options/${id}`);
    },
};
