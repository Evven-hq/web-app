import api from "@/lib/api";
import { User } from "@/types/user";
import { AuthResponse } from "@/types/auth";

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

export async function register( name: string , email: string , password: string): Promise<AuthResponse> {
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
