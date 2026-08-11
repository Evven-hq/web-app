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
    tokens?: TokenResponse | null;
}

export interface SendOtpResponse {
    message: string;
    challenge_token?: string | null;
}

export interface VerifyOtpResponse {
    message: string;
    user?: User | null;
    tokens?: TokenResponse | null;
    signup_token?: string | null;
    email?: string | null;
}

export interface SendOtpRequest {
    email: string;
    purpose?: string;
}

export interface VerifyOtpRequest {
    email?: string | null;
    otp: string;
    purpose?: string;
    challenge_token?: string | null;
}
