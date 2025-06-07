import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        // For now, just add a mock user for testing
        // In production, you should validate JWT token here
        request.user = {
            userId: "user1",
            username: "testuser",
            role: "USER",
        };

        return true;
    }
}
