import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { ZenStackModule } from "@zenstackhq/server/nestjs";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { PrismaService } from "./common/prisma.service";
import { CrudMiddleware } from "./middleware/zenstack.middleware";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { JwtModule } from "@nestjs/jwt";
import type { Request } from "express";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_ACCESS_SECRET"),
                signOptions: {
                    expiresIn: configService.get<string>("JWT_ACCESS_EXPIRESIN"),
                },
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        CommonModule,
        ZenStackModule.registerAsync({
            useFactory: (request: Request, prisma: PrismaService) => {
                return {
                    getEnhancedPrisma: () => prisma,
                };
            },
            inject: [REQUEST, PrismaService],
            extraProviders: [PrismaService],
            global: true,
        }),
    ],
    providers: [PrismaService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply authentication middleware first to populate req.user
        consumer.apply(AuthMiddleware).forRoutes("/");

        // Apply ZenStack CRUD middleware to / routes for REST API
        consumer.apply(CrudMiddleware).exclude("auth/(.*)").forRoutes("/");
    }
}
