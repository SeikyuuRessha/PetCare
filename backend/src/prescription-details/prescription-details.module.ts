import { Module } from "@nestjs/common";
import { PrescriptionDetailsService } from "./prescription-details.service";
import { PrescriptionDetailsController } from "./prescription-details.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [PrescriptionDetailsController],
    providers: [PrescriptionDetailsService, PrismaService],
    exports: [PrescriptionDetailsService],
})
export class PrescriptionDetailsModule {}
