import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext } from "@nestjs/common";
import { AppException } from "../../common/exceptions/app.exception";
import { ExceptionCode } from "../../common/exception/exception-code";

@Injectable()
export class AccessTokenGuard extends AuthGuard("jwt-access") {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        // If there's an error or no user, throw our custom exception
        if (err || !user) {
            throw new AppException(ExceptionCode.UNAUTHORIZED);
        }
        return user;
    }
}
