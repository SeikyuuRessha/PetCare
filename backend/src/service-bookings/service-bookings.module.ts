import { Module } from "@nestjs/common";
import { ServiceBookingsService } from "./service-bookings.service";
import { ServiceBookingsController } from "./service-bookings.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [ServiceBookingsController],
    providers: [ServiceBookingsService, PrismaService],
    exports: [ServiceBookingsService],
})
export class ServiceBookingsModule {}
