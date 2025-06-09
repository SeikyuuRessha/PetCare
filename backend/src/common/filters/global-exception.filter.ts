import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";
import { AppException } from "../exceptions/app.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseBody: any;

        if (exception instanceof AppException) {
            status = HttpStatus.BAD_REQUEST;
            responseBody = {
                code: exception.code,
                message: exception.message,
                data: exception.data || null,
            };
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            responseBody = {
                code: 0,
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
                code: 0,
                message: "Internal server error",
                data: null,
            };
        }

        response.status(status).json(responseBody);
    }
}
