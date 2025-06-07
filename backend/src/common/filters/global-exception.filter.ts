import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Response } from "express";
import { AppException } from "../exception/app-exception";
import { IErrorResponse } from "../interfaces/response.interface";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseBody: IErrorResponse;

        if (exception instanceof AppException) {
            status = HttpStatus.BAD_REQUEST;
            responseBody = {
                code: exception.code,
                message: exception.message,
                data: null,
            };
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            responseBody = {
                code: status === HttpStatus.UNAUTHORIZED ? 1003 : 0,
                message:
                    typeof exceptionResponse === "string"
                        ? exceptionResponse
                        : (exceptionResponse as any).message || "HTTP Exception",
                data: null,
            };
        } else {
            // Log the full error details for debugging
            this.logger.error("Unhandled exception:", exception);
            responseBody = {
                code: 1007,
                message: "Internal server error",
                data: null,
            };
        }

        this.logger.error(
            `HTTP Status: ${status} Error Message: ${responseBody.message}`,
            exception instanceof Error ? exception.stack : exception
        );

        response.status(status).json(responseBody);
    }
}
