"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/src/context/auth-context";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/src/schemas/auth.schema";
import { useChangePassword } from "@/src/queries/users.queries";

export default function ChangePasswordPage() {
  const { isAuthenticated, loading, isTempPassword, clearTempFlag, logout } =
    useAuth();
  const router = useRouter();
  const changePassword = useChangePassword();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!isTempPassword) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, isTempPassword, router]);

  async function onSubmit(values: ChangePasswordFormValues) {
    changePassword.mutate(
      {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          clearTempFlag();
          router.push("/dashboard");
        },
      },
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-[#F8FAFC] text-[#6B7280]">
        <Loader2 className="h-5 w-5 animate-spin text-[#16A34A]" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16A34A] shadow-lg">
            <Package className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Defina sua senha</h1>
          <p className="mt-1 text-center text-sm text-[#6B7280]">
            Você está usando uma senha temporária. Crie uma senha definitiva
            para continuar.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Senha temporária detectada
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                Por segurança, você deve criar uma nova senha antes de acessar o
                sistema.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Nova senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                <input
                  {...register("newPassword")}
                  type={showNew ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-11 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
              {newPassword.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${newPassword.length >= 6 ? "bg-[#16A34A]" : "bg-red-400"}`}
                  />
                  <span
                    className={`text-xs ${newPassword.length >= 6 ? "text-[#16A34A]" : "text-red-500"}`}
                  >
                    {newPassword.length >= 6 ? "Senha válida" : "Muito curta"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repita a senha"
                  className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-11 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
              {confirmPassword.length > 0 && newPassword && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                      <span className="text-[#16A34A]">Senhas coincidem</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-red-500">Senhas não coincidem</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={
                changePassword.isPending || !newPassword || !confirmPassword
              }
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60 active:scale-[0.98]"
            >
              {changePassword.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Definir senha e entrar
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={logout}
            className="mt-4 w-full text-center text-sm text-[#6B7280] hover:text-[#111827]"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
}
