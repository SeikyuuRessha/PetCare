import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionCode } from '../enums/exception-code.enum';

export class AppException extends HttpException {
  constructor(
    public readonly code: ExceptionCode,
    message: string,
    httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly details?: any,
  ) {
    super(message, httpStatus);
  }

  static badRequest(message: string, code: ExceptionCode = ExceptionCode.BAD_REQUEST): AppException {
    return new AppException(code, message, HttpStatus.BAD_REQUEST);
  }

  static unauthorized(message: string, code: ExceptionCode = ExceptionCode.UNAUTHORIZED): AppException {
    return new AppException(code, message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message: string, code: ExceptionCode = ExceptionCode.FORBIDDEN): AppException {
    return new AppException(code, message, HttpStatus.FORBIDDEN);
  }

  static notFound(message: string, code: ExceptionCode = ExceptionCode.NOT_FOUND): AppException {
    return new AppException(code, message, HttpStatus.NOT_FOUND);
  }

  static conflict(message: string, code: ExceptionCode = ExceptionCode.CONFLICT): AppException {
    return new AppException(code, message, HttpStatus.CONFLICT);
  }

  static validation(message: string, details?: any): AppException {
    return new AppException(ExceptionCode.VALIDATION_ERROR, message, HttpStatus.BAD_REQUEST, details);
  }

  static internal(message: string): AppException {
    return new AppException(ExceptionCode.INTERNAL_SERVER_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
