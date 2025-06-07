import { Controller, All, Req, Res, Next } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ZenStackMiddleware } from "@zenstackhq/server/express";
import { ZenStackService } from "./zenstack.service";

@Controller("model")
export class ZenStackController {
    private middleware: any;

    constructor(private zenStackService: ZenStackService) {
        // Initialize ZenStack middleware
        this.middleware = ZenStackMiddleware({
            getPrisma: (req: Request) => {
                // Extract user from request (implement auth later)
                const user = (req as any).user;
                return this.zenStackService.getEnhancedPrisma(user);
            },
        });
    }

    @All("*")
    async handleZenStackAPI(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        // Let the middleware handle the request directly
        this.middleware(req, res, next);
    }
}
