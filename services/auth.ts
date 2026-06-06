import axios from "axios";
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