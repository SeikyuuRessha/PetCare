import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Core modules
import { PrismaService } from "./prisma/prisma.service";

// Business modules
import { UsersModule } from "./users/users.module";
import { PetsModule } from "./pets/pets.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { ServicesModule } from "./services/services.module";
import { ServiceOptionsModule } from "./service-options/service-options.module";
import { ServiceBookingsModule } from "./service-bookings/service-bookings.module";
import { RoomsModule } from "./rooms/rooms.module";
import { BoardingReservationsModule } from "./boarding-reservations/boarding-reservations.module";
import { MedicalRecordsModule } from "./medical-records/medical-records.module";
import { MedicinesModule } from "./medicines/medicines.module";
import { MedicationPackagesModule } from "./medication-packages/medication-packages.module";
import { PrescriptionsModule } from "./prescriptions/prescriptions.module";
import { PrescriptionDetailsModule } from "./prescription-details/prescription-details.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PaymentsModule } from "./payments/payments.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        PetsModule,
        AppointmentsModule,
        ServicesModule,
        ServiceOptionsModule,
        ServiceBookingsModule,
        RoomsModule,
        BoardingReservationsModule,
        MedicalRecordsModule,
        MedicinesModule,
        MedicationPackagesModule,
        PrescriptionsModule,
        PrescriptionDetailsModule,
        NotificationsModule,
        PaymentsModule,
    ],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule {}
