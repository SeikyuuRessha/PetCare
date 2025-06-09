import { ApiResponse } from "../interfaces/api-response.interface";

export const handleService = async <T>(serviceFunction: () => Promise<T>): Promise<ApiResponse<T>> => {
    try {
        const data = await serviceFunction();
        return {
            code: 1,
            msg: "Success",
            data,
        };
    } catch (error) {
        return {
            code: 0,
            msg: error.message || "An unexpected error occurred",
            data: null,
        };
    }
};
