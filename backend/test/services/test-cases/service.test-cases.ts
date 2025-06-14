const baseService = {
    serviceId: "service-1",
    serviceName: "Basic Checkup",
    description: "Regular health checkup for pets",
    price: 50.0,
    duration: 30, // minutes
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceOptions: [],
};

export const serviceTestCases = {
    create: {
        valid: {
            createServiceDto: {
                serviceName: "Basic Checkup",
                description: "Regular health checkup for pets",
            },
            expectedService: baseService,
        },
        invalid: {
            duplicateName: {
                createServiceDto: {
                    serviceName: "Existing Service",
                    description: "This service already exists",
                },
            },
            emptyName: {
                createServiceDto: {
                    serviceName: "",
                    description: "Service with empty name",
                },
            },
            tooLongName: {
                createServiceDto: {
                    serviceName: "a".repeat(101), // Max length is 100
                    description: "Service with too long name",
                },
            },
        },
    },
    find: {
        byId: {
            valid: {
                serviceId: "service-1",
                existingService: baseService,
            },
            invalid: {
                serviceId: "non-existent",
            },
        },
        all: {
            valid: {
                existingServices: [
                    baseService,
                    {
                        ...baseService,
                        serviceId: "service-2",
                        serviceName: "Advanced Checkup",
                        description: "Comprehensive health checkup for pets",
                    },
                ],
            },
        },
    },
    update: {
        valid: {
            serviceId: "service-1",
            updateServiceDto: {
                serviceName: "Updated Checkup",
                description: "Updated health checkup service",
            },
            existingService: baseService,
            expectedService: {
                ...baseService,
                serviceName: "Updated Checkup",
                description: "Updated health checkup service",
                price: 75.0,
                duration: 45,
                updatedAt: expect.any(Date),
            },
        },
        invalid: {
            serviceId: "non-existent",
            updateServiceDto: {
                serviceName: "Updated Service",
            },
        },
    },
    delete: {
        valid: {
            serviceId: "service-1",
            existingService: baseService,
        },
        invalid: {
            serviceId: "non-existent",
        },
    },
};
