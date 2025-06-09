export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}

export interface PaginatedResponse<T = any> {
    code: number;
    msg: string;
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
