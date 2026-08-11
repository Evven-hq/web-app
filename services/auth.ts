import axios from "axios";
import api from "@/lib/api";
import { getAccessToken } from "@/lib/desktop";
import { User } from "@/types/user";
import {
    AuthResponse,
    RegisterResponse,
    SendOtpRequest,
    TokenResponse,
    VerifyOtpRequest,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const authClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

export async function login(
            email: string, 
            password: string
        ): Promise<AuthResponse> {
        
            const response = await api.post("/auth/login", {email,password});
            return response.data;
    }

export async function getCurrentUser(): Promise<User> {

        const response = await api.get("/auth/me");
        return response.data;
}

export async function register(
    name: string,
    email: string,
    password: string
): Promise<RegisterResponse> {
    const response = await api.post("/auth/register", {email, password, name});
    return response.data;
}

export async function requestPasswordReset(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, password: string): Promise<void> {
    await api.put("/auth/reset-password", { token, password });
}

export async function googleLogin(credential: string): Promise<AuthResponse> {
    const response = await api.post("/auth/google", { token: credential });
    return response.data;
}

export async function sendOtp(
    email: string,
    purpose = "email_verification"
): Promise<void> {
    const payload: SendOtpRequest = { email, purpose };
    await api.post("/auth/send-otp", payload);
}

export async function verifyOtp(
    email: string,
    otp: string,
    purpose = "email_verification"
): Promise<AuthResponse> {
    const payload: VerifyOtpRequest = { email, otp, purpose };
    const response = await api.post("/auth/verify-otp", payload);
    return response.data;
}

export async function refreshSession(refreshToken: string): Promise<{ tokens: TokenResponse }> {
    const response = await authClient.post("/auth/refresh", {
        refresh_token: refreshToken,
    });
    const tokens = response.data?.tokens ?? response.data;
    return { tokens };
}

export async function logoutSession(refreshToken: string): Promise<void> {
    let accessToken = getAccessToken();
    let refreshTokenToRevoke = refreshToken;

    const revoke = () =>
        authClient.post(
            "/auth/logout",
            { refresh_token: refreshTokenToRevoke },
            accessToken
                ? { headers: { Authorization: `Bearer ${accessToken}` } }
                : undefined
        );

    if (!accessToken) {
        const refreshed = await refreshSession(refreshTokenToRevoke);
        accessToken = refreshed.tokens.access_token;
        refreshTokenToRevoke = refreshed.tokens.refresh_token;
    }

    try {
        await revoke();
    } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
            throw error;
        }

        const refreshed = await refreshSession(refreshTokenToRevoke);
        accessToken = refreshed.tokens.access_token;
        refreshTokenToRevoke = refreshed.tokens.refresh_token;
        await revoke();
    }
}
