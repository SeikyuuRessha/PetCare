import { Injectable, CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AppException } from "../../common/exceptions/app.exception";
import { ExceptionCode } from "../../common/exception/exception-code";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new AppException(ExceptionCode.UNAUTHORIZED, null, HttpStatus.UNAUTHORIZED);
        }

        const hasRole = requiredRoles.some((role) => user.role === role);

        if (!hasRole) {
            throw new AppException(ExceptionCode.ACCESS_DENIED, null, HttpStatus.FORBIDDEN);
        }

        return true;
    }
}
