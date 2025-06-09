import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from '../exceptions/app.exception';
import { ExceptionCode } from '../enums/exception-code.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status: number;
    let message: string;
    let code: number;

    if (exception instanceof AppException) {
      status = exception.getStatus();
      message = exception.message;
      code = exception.code;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      code = this.getCodeFromHttpStatus(status);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = ExceptionCode.INTERNAL_SERVER_ERROR;
    }

    const errorResponse = {
      code: 0, // Always 0 for errors
      msg: message,
      data: null,
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(status).json(errorResponse);
  }

  private getCodeFromHttpStatus(status: number): number {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ExceptionCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ExceptionCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ExceptionCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ExceptionCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ExceptionCode.CONFLICT;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ExceptionCode.VALIDATION_ERROR;
      default:
        return ExceptionCode.INTERNAL_SERVER_ERROR;
    }
  }
}
