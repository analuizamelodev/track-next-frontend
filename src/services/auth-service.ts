import { apiClient } from "../libs/api";

export interface LoginResponse {
  access_token: string;
  isTempPassword: boolean;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}
