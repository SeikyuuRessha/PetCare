import { Module } from "@nestjs/common";
import { MedicationPackagesService } from "./medication-packages.service";
import { MedicationPackagesController } from "./medication-packages.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [MedicationPackagesController],
    providers: [MedicationPackagesService, PrismaService],
    exports: [MedicationPackagesService],
})
export class MedicationPackagesModule {}
