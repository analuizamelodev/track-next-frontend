"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { login as loginRequest } from "@/src/services/auth-service";
import {
  AuthUser,
  clearToken,
  decodeToken,
  getToken,
  isAdmin,
  setToken,
  UserRole,
} from "@/src/libs/auth";

const TEMP_PASSWORD_KEY = "isTempPassword";

function getTempPasswordFlag(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(TEMP_PASSWORD_KEY) === "true";
}
function setTempPasswordFlag(value: boolean) {
  localStorage.setItem(TEMP_PASSWORD_KEY, String(value));
}
function clearTempPasswordFlag() {
  localStorage.removeItem(TEMP_PASSWORD_KEY);
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTempPassword: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearTempFlag: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTempPassword, setIsTempPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser(decodeToken(token));
      setIsTempPassword(getTempPasswordFlag());
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginRequest(email, password);
      setToken(data.access_token);
      setTempPasswordFlag(data.isTempPassword);
      setUser(decodeToken(data.access_token));
      setIsTempPassword(data.isTempPassword);

      if (data.isTempPassword) {
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    clearToken();
    clearTempPasswordFlag();
    setUser(null);
    setIsTempPassword(false);
    router.push("/login");
  }, [router]);

  const clearTempFlag = useCallback(() => {
    clearTempPasswordFlag();
    setIsTempPassword(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: isAdmin(user?.role),
      isTempPassword,
      login,
      logout,
      clearTempFlag,
    }),
    [user, loading, isTempPassword, login, logout, clearTempFlag],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

export function useRequireAuth(adminOnly = false) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Redireciona para trocar senha temporária antes de acessar o dashboard
    if (auth.isTempPassword) {
      router.replace("/change-password");
      return;
    }

    if (adminOnly && auth.user?.role !== UserRole.ADMIN) {
      router.replace("/dashboard");
    }
  }, [auth, adminOnly, router]);

  return auth;
}
