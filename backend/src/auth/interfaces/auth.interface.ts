export interface JwtPayload {
    sub: string; // user id
    username: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    user: {
        id: string;
        username: string;
        email: string;
        fullName: string;
        role: string;
    };
    tokens: TokenPair;
}
