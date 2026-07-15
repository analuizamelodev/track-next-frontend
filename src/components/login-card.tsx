"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/auth-context";
import { Package, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginCard() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Email ou senha inválidos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Brand */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16A34A] shadow-lg">
          <Package className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Bem-vindo ao TrackLog</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Acesso exclusivo para equipe autorizada
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        {error && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-4 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-11 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Cliente?{" "}
          <Link
            href="/track"
            className="font-semibold text-[#16A34A] hover:text-[#15803D]"
          >
            Rastreie sua entrega →
          </Link>
        </p>
      </div>
    </div>
  );
}
