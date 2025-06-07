export const ExceptionCode = {
    // Generic errors
    UNKNOWN_ERROR: { code: 1000, message: "Unknown error" },
    VALIDATION_ERROR: { code: 1001, message: "Validation failed" },
    NOT_FOUND: { code: 1002, message: "Resource not found" },
    UNAUTHORIZED: { code: 1003, message: "Unauthorized access" },
    FORBIDDEN: { code: 1004, message: "Forbidden access" },
    CONFLICT: { code: 1005, message: "Conflict error" },
    BAD_REQUEST: { code: 1006, message: "Bad request" },
    INTERNAL_SERVER_ERROR: { code: 1007, message: "Internal server error" },

    // Authentication errors
    INVALID_PASSWORD: { code: 1008, message: "Password is incorrect" },
    ACCESS_DENIED: { code: 1009, message: "Access denied" },
    TOKEN_FAILED: { code: 4000, message: "Token validation failed" },
    HASHING_FAILED: { code: 4001, message: "Hashing failed" },

    // User management
    USER_NOT_FOUND: { code: 2001, message: "User not found" },
    USER_ALREADY_EXISTS: { code: 2002, message: "User already exists" },
    EMAIL_ALREADY_EXISTS: { code: 2003, message: "Email already exists" },

    // Pet management
    PET_NOT_FOUND: { code: 3001, message: "Pet not found" },
    PET_OWNER_MISMATCH: { code: 3002, message: "Pet does not belong to this user" },

    // Veterinarian management
    VET_NOT_FOUND: { code: 4001, message: "Veterinarian not found" },
    VET_NOT_AVAILABLE: { code: 4002, message: "Veterinarian is not available" },

    // Appointment management
    APPOINTMENT_NOT_FOUND: { code: 5001, message: "Appointment not found" },
    APPOINTMENT_CONFLICT: { code: 5002, message: "Appointment time conflict" },
    APPOINTMENT_PAST_TIME: { code: 5003, message: "Cannot book appointment in the past" },

    // Medical records
    MEDICAL_RECORD_NOT_FOUND: { code: 6001, message: "Medical record not found" },
    MEDICAL_RECORD_ACCESS_DENIED: { code: 6002, message: "Access denied to medical record" },

    // Service management
    SERVICE_NOT_FOUND: { code: 7001, message: "Service not found" },
    SERVICE_UNAVAILABLE: { code: 7002, message: "Service is currently unavailable" },
};
