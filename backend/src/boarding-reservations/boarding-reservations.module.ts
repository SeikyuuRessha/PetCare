import { Module } from "@nestjs/common";
import { BoardingReservationsService } from "./boarding-reservations.service";
import { BoardingReservationsController } from "./boarding-reservations.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [BoardingReservationsController],
    providers: [BoardingReservationsService, PrismaService],
    exports: [BoardingReservationsService],
})
export class BoardingReservationsModule {}
