import { apiClient } from "../libs/api";

export function register(email: string, password: string) {
    return apiClient.post("/auth/register", {
        email,
        password,
    });
}

export function login(email: string, password: string) {
    return apiClient.post("/auth/login", {
        email,
        password,
    });
}