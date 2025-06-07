import { AppException } from "../exception/app-exception";
import { ExceptionCode } from "../exception/exception-code";
import { ISuccessResponse } from "../interfaces/response.interface";

export async function handleService<T>(
    fn: () => Promise<T>,
    successMessage?: string,
    fallbackError = ExceptionCode.INTERNAL_SERVER_ERROR
): Promise<ISuccessResponse<T>> {
    try {
        const data = await fn();
        return {
            code: 200,
            message: "Success",
            data,
        };
    } catch (error) {
        if (error instanceof AppException) {
            throw error;
        }

        throw new AppException(fallbackError, { originalError: error?.toString() });
    }
}
