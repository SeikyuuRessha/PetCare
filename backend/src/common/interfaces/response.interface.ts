export interface IResponse<T = any> {
    code: string | number;
    message: string;
    data: T;
}

export interface ISuccessResponse<T = any> extends IResponse<T> {
    code: 200;
    message: string;
    data: T;
}

export interface IErrorResponse extends IResponse<null> {
    code: string | number;
    message: string;
    data: null;
}
