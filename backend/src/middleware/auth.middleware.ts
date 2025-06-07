import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            // Skip auth middleware for auth routes
            if (req.path.startsWith("/api/auth/")) {
                return next();
            }
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.substring(7);
                try {
                    const payload = await this.jwtService.verifyAsync(token, {
                        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
                    });

                    // Log the JWT payload for debugging
                    console.log("🔑 JWT Payload:", payload);

                    // Set user context for ZenStack
                    req.user = {
                        userId: payload.userId,
                        username: payload.username,
                        role: payload.role,
                    };

                    console.log("🔐 Auth Middleware - User authenticated:", req.user);
                } catch (error) {
                    console.log("🚫 Auth Middleware - Invalid token:", error.message);
                    // Don't set user, will be treated as anonymous
                }
            }
        } catch (error) {
            console.log("🚫 Auth Middleware - Error:", error.message);
        }

        next();
    }
}
