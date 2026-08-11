import { User } from "./user";

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    tokens: TokenResponse;
}

export interface RegisterResponse {
    message: string;
    user: User;
}

export interface SendOtpRequest {
    email: string;
    purpose?: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
    purpose?: string;
}
