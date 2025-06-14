import { UserRole } from "../../../src/common/enums";

const baseUser = {
    userId: "user-1",
    username: "testuser",
    email: "test@example.com",
    fullName: "Test User",
    phone: "+1234567890",
    address: "123 Test Street",
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const baseTokens = {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    expiresIn: 3600,
};

export const authTestCases = {
    login: {
        valid: {
            loginDto: {
                username: "testuser",
                password: "password123",
            },
            expectedResponse: {
                user: {
                    userId: baseUser.userId,
                    username: baseUser.username,
                    email: baseUser.email,
                    fullName: baseUser.fullName,
                    role: baseUser.role,
                },
                tokens: baseTokens,
            },
        },
        invalid: {
            wrongCredentials: {
                loginDto: {
                    username: "testuser",
                    password: "wrongpassword",
                },
            },
            userNotFound: {
                loginDto: {
                    username: "nonexistentuser",
                    password: "password123",
                },
            },
            missingUsername: {
                loginDto: {
                    password: "password123",
                },
            },
            missingPassword: {
                loginDto: {
                    username: "testuser",
                },
            },
            shortPassword: {
                loginDto: {
                    username: "testuser",
                    password: "123",
                },
            },
        },
    },
    register: {
        valid: {
            registerDto: {
                username: "newuser",
                email: "newuser@example.com",
                fullName: "New User",
                password: "password123",
                phone: "+1234567890",
                address: "456 New Street",
                role: UserRole.USER,
            },
            expectedResponse: {
                user: {
                    userId: "user-2",
                    username: "newuser",
                    email: "newuser@example.com",
                    fullName: "New User",
                    role: UserRole.USER,
                },
                tokens: baseTokens,
            },
        },
        invalid: {
            duplicateUsername: {
                registerDto: {
                    username: "testuser", // Already exists
                    email: "new@example.com",
                    fullName: "New User",
                    password: "password123",
                },
            },
            duplicateEmail: {
                registerDto: {
                    username: "newuser",
                    email: "test@example.com", // Already exists
                    fullName: "New User",
                    password: "password123",
                },
            },
            missingUsername: {
                registerDto: {
                    email: "new@example.com",
                    fullName: "New User",
                    password: "password123",
                },
            },
            shortUsername: {
                registerDto: {
                    username: "ab", // Too short
                    email: "new@example.com",
                    fullName: "New User",
                    password: "password123",
                },
            },
            invalidEmail: {
                registerDto: {
                    username: "newuser",
                    email: "invalid-email",
                    fullName: "New User",
                    password: "password123",
                },
            },
            shortPassword: {
                registerDto: {
                    username: "newuser",
                    email: "new@example.com",
                    fullName: "New User",
                    password: "123",
                },
            },
        },
    },
    refreshTokens: {
        valid: {
            refreshTokenDto: {
                refreshToken: "valid-refresh-token",
            },
            expectedTokens: baseTokens,
        },
        invalid: {
            invalidToken: {
                refreshTokenDto: {
                    refreshToken: "invalid-refresh-token",
                },
            },
            expiredToken: {
                refreshTokenDto: {
                    refreshToken: "expired-refresh-token",
                },
            },
            missingToken: {
                refreshTokenDto: {},
            },
        },
    },
    logout: {
        valid: {
            userId: "user-1",
        },
        invalid: {
            invalidUserId: "non-existent-user",
        },
    },
};
