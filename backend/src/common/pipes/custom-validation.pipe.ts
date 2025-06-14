import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpStatus } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { AppException } from "../exceptions/app.exception";
import { ExceptionCode } from "../exception/exception-code";

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errorMessages = errors.map((error) => {
                return Object.values(error.constraints || {}).join(", ");
            });

            throw new AppException(ExceptionCode.VALIDATION_ERROR, { errors: errorMessages }, HttpStatus.BAD_REQUEST);
        }

        return value;
    }
    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
