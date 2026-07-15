"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail, Package } from "lucide-react";
import { useAuth } from "@/src/context/auth-context";
import { loginSchema, LoginFormValues } from "@/src/schemas/auth.schema";
import { getApiErrorMessage } from "@/src/libs/api-error";

export default function LoginCard() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setLoading(true);
    try {
      await login(values.email, values.password);
    } catch (err) {
      setError("root", {
        message: getApiErrorMessage(err, "Email ou senha inválidos."),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16A34A] shadow-lg">
          <Package className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">
          Bem-vindo ao TrackLog
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Acesso exclusivo para equipe autorizada
        </p>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        {errors.root?.message && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-4 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
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
