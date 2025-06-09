export class AppException extends Error {
    constructor(
        public readonly code: string,
        public readonly data?: any,
        message?: string
    ) {
        super(message || code);
    }
}

export class ExceptionCode {
    static readonly USER_NOT_FOUND = "USER_NOT_FOUND";
    static readonly PET_NOT_FOUND = "PET_NOT_FOUND";
    static readonly APPOINTMENT_NOT_FOUND = "APPOINTMENT_NOT_FOUND";
    static readonly SERVICE_NOT_FOUND = "SERVICE_NOT_FOUND";
    static readonly SERVICE_OPTION_NOT_FOUND = "SERVICE_OPTION_NOT_FOUND";
    static readonly BOOKING_NOT_FOUND = "BOOKING_NOT_FOUND";
    static readonly ROOM_NOT_FOUND = "ROOM_NOT_FOUND";
    static readonly RESERVATION_NOT_FOUND = "RESERVATION_NOT_FOUND";
    static readonly MEDICAL_RECORD_NOT_FOUND = "MEDICAL_RECORD_NOT_FOUND";
    static readonly MEDICINE_NOT_FOUND = "MEDICINE_NOT_FOUND";
    static readonly PRESCRIPTION_NOT_FOUND = "PRESCRIPTION_NOT_FOUND";
    static readonly PAYMENT_NOT_FOUND = "PAYMENT_NOT_FOUND";
    static readonly NOTIFICATION_NOT_FOUND = "NOTIFICATION_NOT_FOUND";
    static readonly MEDICATION_PACKAGE_NOT_FOUND = "MEDICATION_PACKAGE_NOT_FOUND";
    static readonly PRESCRIPTION_DETAIL_NOT_FOUND = "PRESCRIPTION_DETAIL_NOT_FOUND";
    static readonly NOTIFICATION_USER_NOT_FOUND = "NOTIFICATION_USER_NOT_FOUND";

    static readonly USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS";
    static readonly EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    static readonly PHONE_ALREADY_EXISTS = "PHONE_ALREADY_EXISTS";
    static readonly ROOM_NOT_AVAILABLE = "ROOM_NOT_AVAILABLE";
    static readonly PRESCRIPTION_ALREADY_EXISTS = "PRESCRIPTION_ALREADY_EXISTS";
    static readonly PRESCRIPTION_DETAIL_ALREADY_EXISTS = "PRESCRIPTION_DETAIL_ALREADY_EXISTS";
    static readonly UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS";
    static readonly INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
}
