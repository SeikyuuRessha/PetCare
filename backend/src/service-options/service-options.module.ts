import { Module } from "@nestjs/common";
import { ServiceOptionsService } from "./service-options.service";
import { ServiceOptionsController } from "./service-options.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [ServiceOptionsController],
    providers: [ServiceOptionsService, PrismaService],
    exports: [ServiceOptionsService],
})
export class ServiceOptionsModule {}
