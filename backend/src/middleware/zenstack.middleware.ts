import { Injectable, NestMiddleware } from "@nestjs/common";
import { ZenStackMiddleware } from "@zenstackhq/server/express";
import type { Request, Response } from "express";
import { PrismaService } from "../common/prisma.service";
import { enhance } from "@zenstackhq/runtime";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

@Injectable()
export class CrudMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: AuthenticatedRequest, _res: Response, next: (error?) => void) {
        const inner = ZenStackMiddleware({
            getPrisma: () => {
                // Create enhanced Prisma client with user context for access control
                const userContext = req.user || {
                    userId: "anonymous",
                    username: "anonymous",
                    role: "ANONYMOUS",
                };

                return enhance(this.prismaService, {
                    user: userContext,
                });
            },
        });
        inner(req, _res, next);
    }
}
