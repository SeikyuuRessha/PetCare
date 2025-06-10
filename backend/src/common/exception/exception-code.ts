export const ExceptionCode = {
    // Common errors
    INTERNAL_SERVER_ERROR: { code: 5000, message: "Internal server error occurred" },
    BAD_REQUEST: { code: 4000, message: "Bad request" },
    UNAUTHORIZED: { code: 4001, message: "Unauthorized access" },
    FORBIDDEN: { code: 4003, message: "Forbidden access" },
    NOT_FOUND: { code: 4004, message: "Resource not found" },
    CONFLICT: { code: 4009, message: "Resource conflict" },
    VALIDATION_ERROR: { code: 4022, message: "Validation failed" },

    // Operation errors
    INVALID_OPERATION: { code: 4023, message: "Invalid operation" },

    // Authentication errors
    INVALID_CREDENTIALS: { code: 4101, message: "Invalid username or password" },
    TOKEN_EXPIRED: { code: 4102, message: "Token has expired" },
    TOKEN_INVALID: { code: 4103, message: "Invalid token provided" },
    ACCESS_DENIED: { code: 4104, message: "Access denied" },

    // User errors
    USER_NOT_FOUND: { code: 4201, message: "User not found" },
    USER_ALREADY_EXISTS: { code: 4202, message: "User already exists" },
    EMAIL_ALREADY_EXISTS: { code: 4203, message: "Email already exists" },
    INVALID_USER_DATA: { code: 4204, message: "Invalid user data provided" },

    // Pet errors
    PET_NOT_FOUND: { code: 4301, message: "Pet not found" },
    PET_ALREADY_EXISTS: { code: 4302, message: "Pet already exists" },
    INVALID_PET_DATA: { code: 4303, message: "Invalid pet data provided" },

    // Appointment errors
    APPOINTMENT_NOT_FOUND: { code: 4401, message: "Appointment not found" },
    APPOINTMENT_CONFLICT: { code: 4402, message: "Appointment time conflict" },
    INVALID_APPOINTMENT_TIME: { code: 4403, message: "Invalid appointment time" },

    // Service errors
    SERVICE_NOT_FOUND: { code: 4501, message: "Service not found" },
    SERVICE_OPTION_NOT_FOUND: { code: 4502, message: "Service option not found" },
    INVALID_SERVICE_DATA: { code: 4504, message: "Invalid service data provided" }, // Medical Record errors
    MEDICAL_RECORD_NOT_FOUND: { code: 4601, message: "Medical record not found" },
    PRESCRIPTION_NOT_FOUND: { code: 4602, message: "Prescription not found" },
    MEDICINE_NOT_FOUND: { code: 4603, message: "Medicine not found" },
    MEDICATION_PACKAGE_NOT_FOUND: { code: 4604, message: "Medication package not found" },
    PRESCRIPTION_DETAIL_NOT_FOUND: { code: 4605, message: "Prescription detail not found" },
    PRESCRIPTION_ALREADY_EXISTS: { code: 4606, message: "Prescription already exists" },
    PRESCRIPTION_DETAIL_ALREADY_EXISTS: { code: 4607, message: "Prescription detail already exists" },

    // Notification errors
    NOTIFICATION_NOT_FOUND: { code: 4701, message: "Notification not found" },
    NOTIFICATION_USER_NOT_FOUND: { code: 4702, message: "Notification user not found" },

    // Payment errors
    PAYMENT_NOT_FOUND: { code: 4801, message: "Payment not found" },
    PAYMENT_FAILED: { code: 4802, message: "Payment processing failed" }, // Booking errors
    BOOKING_NOT_FOUND: { code: 4901, message: "Booking not found" },
    ROOM_NOT_FOUND: { code: 4902, message: "Room not found" },
    ROOM_NOT_AVAILABLE: { code: 4903, message: "Room not available" },
    ROOM_NUMBER_ALREADY_EXISTS: { code: 4904, message: "Room number already exists" },
    RESERVATION_NOT_FOUND: { code: 4905, message: "Reservation not found" },
    RESERVATION_CONFLICT: { code: 4906, message: "Reservation time conflict" },
};
