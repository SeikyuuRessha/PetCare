import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { RolesGuard } from "./guards/roles.guard";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_ACCESS_SECRET"),
                signOptions: {
                    expiresIn: configService.get<string>("JWT_ACCESS_EXPIRES_IN", "15m"),
                },
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, AccessTokenGuard, RolesGuard],
    exports: [AuthService, AccessTokenGuard, RolesGuard],
})
export class AuthModule {}
