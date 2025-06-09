import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../interfaces/auth.interface";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access") {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
        const secret = configService.get<string>("JWT_ACCESS_SECRET");
        if (!secret) {
            throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayload) {
        return await this.authService.validateAccessToken(payload);
    }
}
