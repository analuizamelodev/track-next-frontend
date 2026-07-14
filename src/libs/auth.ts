import { jwtDecode } from "jwt-decode";

export enum UserRole {
  ADMIN = 1,
  OPERATOR = 2,
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: number;
  exp?: number;
}

const TOKEN_KEY = "token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearToken();
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role as UserRole,
    };
  } catch {
    clearToken();
    return null;
  }
}

export function isAdmin(role?: number | null): boolean {
  return role === UserRole.ADMIN;
}

export function getRoleLabel(role: number): string {
  if (role === UserRole.ADMIN) return "Admin";
  if (role === UserRole.OPERATOR) return "Operador";
  return "Desconhecido";
}
