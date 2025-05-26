import { Module } from "@nestjs/common";
import { ServiceBookingsService } from "./service-bookings.service";
import { ServiceBookingsController } from "./service-bookings.controller";

@Module({
    controllers: [ServiceBookingsController],
    providers: [ServiceBookingsService],
})
export class ServiceBookingsModule {}
