import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ISuccessResponse } from "../interfaces/response.interface";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ISuccessResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ISuccessResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                // If data is already in our standard format, return as is
                if (
                    data &&
                    typeof data === "object" &&
                    "code" in data &&
                    "message" in data &&
                    "data" in data
                ) {
                    return data;
                }

                // Otherwise, wrap it in our standard format
                return {
                    code: 200,
                    message: "Success",
                    data,
                };
            })
        );
    }
}
