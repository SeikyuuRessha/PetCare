import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

interface LoginResponse {
    code: number;
    message: string;
    data: {
        user: {
            id: string;
            username: string;
            email?: string;
            fullName: string;
            role: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    };
}

interface RegisterData {
    username: string;
    email?: string;
    fullName: string;
    password: string;
    phone?: string;
    address?: string;
    role?: string;
}

export const login = async (
    username: string,
    password: string
): Promise<boolean> => {
    try {
        const response = await axios.post<LoginResponse>(
            `${API_BASE_URL}/auth/login`,
            {
                username,
                password,
            }
        );

        if (response.data.code === 1) {
            // Store tokens and user info
            localStorage.setItem(
                "accessToken",
                response.data.data.tokens.accessToken
            );
            localStorage.setItem(
                "refreshToken",
                response.data.data.tokens.refreshToken
            );
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.data.user)
            );
            localStorage.setItem("isLoggedIn", "true");
            return true;
        } else {
            alert(response.data.message);
            return false;
        }
    } catch (error: any) {
        console.error("Login error:", error);
        const message = error.response?.data?.message || "Đăng nhập thất bại";
        alert(message);
        return false;
    }
};

export const register = async (data: RegisterData): Promise<boolean> => {
    try {
        const response = await axios.post<LoginResponse>(
            `${API_BASE_URL}/auth/register`,
            {
                ...data,
                role: "USER", // Default role
            }
        );

        if (response.data.code === 1) {
            // Auto login after successful registration
            localStorage.setItem(
                "accessToken",
                response.data.data.tokens.accessToken
            );
            localStorage.setItem(
                "refreshToken",
                response.data.data.tokens.refreshToken
            );
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.data.user)
            );
            localStorage.setItem("isLoggedIn", "true");
            return true;
        } else {
            alert(response.data.message);
            return false;
        }
    } catch (error: any) {
        console.error("Register error:", error);
        const message = error.response?.data?.message || "Đăng ký thất bại";
        alert(message);
        return false;
    }
};

export const logout = async (): Promise<void> => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            await axios.post(`${API_BASE_URL}/auth/logout`, { refreshToken });
        }
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Clear all stored data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
    }
};

export const checkIsLoggedIn = (): boolean => {
    return localStorage.getItem("isLoggedIn") === "true";
};

export const getUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem("accessToken");
};

// Get user role from localStorage
export const getUserRole = (): string | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            return user.role;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    }
    return null;
};

// Get user info from localStorage
export const getUserInfo = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    }
    return null;
};

// Get redirect path based on user role
export const getRedirectPath = (role: string): string => {
    switch (role?.toUpperCase()) {
        case "ADMIN":
            return "/admin";
        case "DOCTOR":
            return "/doctor";
        case "EMPLOYEE":
            return "/employee";
        case "USER":
        default:
            return "/home";
    }
};

// Setup axios interceptor for authentication
axios.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Setup axios interceptor for token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired, try to refresh
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_BASE_URL}/auth/refresh`,
                        { refreshToken }
                    );
                    if (response.data.code === 1) {
                        localStorage.setItem(
                            "accessToken",
                            response.data.data.accessToken
                        );
                        // Retry the original request
                        error.config.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
                        return axios.request(error.config);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                }
            }
            // If refresh fails, logout user
            logout();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
