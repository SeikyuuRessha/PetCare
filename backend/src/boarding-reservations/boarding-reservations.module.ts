import { Module } from "@nestjs/common";
import { BoardingReservationsService } from "./boarding-reservations.service";
import { BoardingReservationsController } from "./boarding-reservations.controller";

@Module({
    controllers: [BoardingReservationsController],
    providers: [BoardingReservationsService],
})
export class BoardingReservationsModule {}
