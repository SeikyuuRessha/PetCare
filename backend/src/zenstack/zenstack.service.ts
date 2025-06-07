import { Injectable } from "@nestjs/common";
import { enhance } from "@zenstackhq/runtime";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class ZenStackService {
    private prisma = new PrismaClient();

    /**
     * Get enhanced Prisma client with ZenStack access control
     * @param user Current authenticated user
     * @returns Enhanced Prisma client
     */
    getEnhancedPrisma(user?: any) {
        return enhance(this.prisma, { user });
    }

    /**
     * Get regular Prisma client (bypasses access control)
     * @returns Regular Prisma client
     */
    getPrisma() {
        return this.prisma;
    }
}
