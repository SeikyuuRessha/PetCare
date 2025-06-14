import { UserRole } from "../../../src/common/enums";

const baseUser = {
    userId: "user-1",
    username: "testuser",
    email: "test@example.com" as string | null,
    fullName: "Test User",
    password: "hashedPassword",
    refreshToken: null,
    phone: "1234567890" as string | null,
    address: "123 Test St" as string | null,
    role: UserRole.USER as string,
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const userTestCases = {
    create: {
        valid: {
            createUserDto: {
                username: "testuser",
                email: "test@example.com",
                fullName: "Test User",
                password: "password123",
                phone: "1234567890",
                address: "123 Test St",
                role: UserRole.USER,
            },
            expectedUser: baseUser,
        },
        invalid: {
            duplicateUsername: {
                createUserDto: {
                    username: "existinguser",
                    email: "new@example.com",
                    fullName: "New User",
                    password: "password123",
                    phone: "9876543210",
                    address: "456 New St",
                    role: UserRole.USER,
                },
            },
            duplicateEmail: {
                createUserDto: {
                    username: "newuser",
                    email: "existing@example.com",
                    fullName: "New User",
                    password: "password123",
                    phone: "9876543210",
                    address: "456 New St",
                    role: UserRole.USER,
                },
            },
            invalidEmail: {
                createUserDto: {
                    username: "newuser",
                    email: "invalid-email",
                    fullName: "New User",
                    password: "password123",
                    phone: "9876543210",
                    address: "456 New St",
                    role: UserRole.USER,
                },
            },
            weakPassword: {
                createUserDto: {
                    username: "newuser",
                    email: "new@example.com",
                    fullName: "New User",
                    password: "123",
                    phone: "9876543210",
                    address: "456 New St",
                    role: UserRole.USER,
                },
            },
        },
    },
    find: {
        byId: {
            valid: {
                userId: "user-1",
                existingUser: baseUser,
            },
            invalid: {
                userId: "non-existent",
            },
        },
        byEmail: {
            valid: {
                email: "test@example.com",
                existingUser: baseUser,
            },
            invalid: {
                email: "nonexistent@example.com",
            },
        },
        all: {
            valid: {
                existingUsers: [
                    baseUser,
                    {
                        ...baseUser,
                        userId: "user-2",
                        username: "testuser2",
                        email: "test2@example.com",
                        refreshToken: null,
                    },
                ],
            },
        },
    },
    update: {
        valid: {
            userId: "user-1",
            updateUserDto: {
                fullName: "Updated Name",
                phone: "9876543210",
                address: "789 Test St",
            },
            existingUser: baseUser,
            expectedUser: {
                ...baseUser,
                fullName: "Updated Name",
                phone: "9876543210",
                address: "789 Test St",
                updatedAt: expect.any(Date),
            },
        },
        invalid: {
            userId: "non-existent",
            updateUserDto: {
                fullName: "Updated Name",
            },
        },
    },
    delete: {
        valid: {
            userId: "user-1",
            existingUser: baseUser,
        },
        invalid: {
            userId: "non-existent",
        },
    },
};
