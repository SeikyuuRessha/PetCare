import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { PetsModule } from "./pets/pets.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { MedicalRecordsModule } from "./medical-records/medical-records.module";
import { ServicesModule } from "./services/services.module";
import { ServiceBookingsModule } from "./service-bookings/service-bookings.module";
import { RoomsModule } from "./rooms/rooms.module";
import { BoardingReservationsModule } from "./boarding-reservations/boarding-reservations.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { MedicinesModule } from "./medicines/medicines.module";
import { PrescriptionsModule } from "./prescriptions/prescriptions.module";
import { PaymentsModule } from "./payments/payments.module";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";

@Module({
    imports: [
        UsersModule,
        PetsModule,
        AppointmentsModule,
        MedicalRecordsModule,
        ServicesModule,
        ServiceBookingsModule,
        RoomsModule,
        BoardingReservationsModule,
        NotificationsModule,
        MedicinesModule,
        PrescriptionsModule,
        PaymentsModule,
        AuthModule,
        CommonModule,
    ],
})
export class AppModule {}
