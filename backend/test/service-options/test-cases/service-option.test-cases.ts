import { Prisma } from "@prisma/client";

const baseServiceOption = {
    optionId: "option-1",
    optionName: "Basic Option",
    price: new Prisma.Decimal(50.0),
    description: "Basic service option",
    serviceId: "service-1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockService = {
    serviceId: "service-1",
    serviceName: "Test Service",
    description: "Test Description",
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const serviceOptionTestCases = {
    create: {
        valid: {
            createServiceOptionDto: {
                optionName: "Basic Option",
                price: 50.0,
                description: "Basic service option",
                serviceId: "service-1",
            },
            expectedResult: {
                ...baseServiceOption,
                service: mockService,
            },
        },
        invalid: {
            nonExistentService: {
                createServiceOptionDto: {
                    optionName: "Invalid Service Option",
                    price: 50.0,
                    description: "Option with non-existent service",
                    serviceId: "non-existent-service",
                },
            },
            negativePrice: {
                createServiceOptionDto: {
                    optionName: "Invalid Price Option",
                    price: -50.0,
                    description: "Option with negative price",
                    serviceId: "service-1",
                },
            },
        },
    },
    find: {
        byService: {
            valid: {
                serviceId: "service-1",
                expectedResult: [
                    {
                        ...baseServiceOption,
                        service: mockService,
                    },
                ],
            },
            empty: {
                serviceId: "service-2",
                expectedResult: [],
            },
            invalid: {
                serviceId: "non-existent-service",
            },
        },
        byId: {
            valid: {
                optionId: "option-1",
                expectedResult: {
                    ...baseServiceOption,
                    service: mockService,
                },
            },
            invalid: {
                optionId: "non-existent-option",
            },
        },
        all: {
            valid: {
                expectedResult: [
                    {
                        ...baseServiceOption,
                        service: mockService,
                    },
                ],
            },
        },
    },
    update: {
        valid: {
            optionId: "option-1",
            updateServiceOptionDto: {
                optionName: "Updated Option",
                price: 75.0,
                description: "Updated service option",
            },
            expectedResult: {
                ...baseServiceOption,
                optionName: "Updated Option",
                price: new Prisma.Decimal(75.0),
                description: "Updated service option",
                service: mockService,
            },
        },
        invalid: {
            nonExistentOption: {
                optionId: "non-existent-option",
                updateServiceOptionDto: {
                    optionName: "Updated Option",
                    price: 75.0,
                },
            },
            negativePrice: {
                optionId: "option-1",
                updateServiceOptionDto: {
                    optionName: "Invalid Price Option",
                    price: -75.0,
                },
            },
        },
    },
    delete: {
        valid: {
            optionId: "option-1",
            expectedResult: {
                ...baseServiceOption,
                service: mockService,
            },
        },
        invalid: {
            optionId: "non-existent-option",
        },
    },
};
