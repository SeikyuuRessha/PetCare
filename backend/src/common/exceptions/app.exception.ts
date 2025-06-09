import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException {
    readonly code: number;
    readonly message: string;
    readonly data: any;

    constructor(
        codeObj: { code: number; message: string },
        data: any = null,
        httpStatus: HttpStatus = HttpStatus.BAD_REQUEST
    ) {
        super(
            {
                code: codeObj.code,
                message: codeObj.message,
                data,
            },
            httpStatus
        );

        this.code = codeObj.code;
        this.message = codeObj.message;
        this.data = data;
    }
}
