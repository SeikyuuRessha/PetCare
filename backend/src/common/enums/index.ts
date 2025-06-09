// User roles
export enum UserRole {
    USER = "USER",
    EMPLOYEE = "EMPLOYEE",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN",
}

// Pet gender
export enum PetGender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

// Appointment status
export enum AppointmentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

// Service booking status
export enum ServiceBookingStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

// Room status
export enum RoomStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    MAINTENANCE = "MAINTENANCE",
}

// Boarding reservation status
export enum BoardingReservationStatus {
    CONFIRMED = "CONFIRMED",
    CHECKED_IN = "CHECKED_IN",
    CHECKED_OUT = "CHECKED_OUT",
    CANCELLED = "CANCELLED",
}

// Notification type
export enum NotificationType {
    REMINDER = "REMINDER",
    ALERT = "ALERT",
    INFO = "INFO",
}

// Payment status
export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
}
