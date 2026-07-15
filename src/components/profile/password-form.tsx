"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/src/schemas/auth.schema";
import { useChangePassword } from "@/src/queries/users.queries";
import { toastSuccess } from "@/src/libs/toast";

export function PasswordForm({
  requireCurrent = true,
  submitLabel = "Alterar senha",
  onSuccess,
}: {
  requireCurrent?: boolean;
  submitLabel?: string;
  onSuccess?: () => void;
}) {
  const changePassword = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPwd = watch("newPassword");
  const confirm = watch("confirmPassword");

  function onSubmit(values: ChangePasswordFormValues) {
    changePassword.mutate(
      {
        currentPassword: values.currentPassword || undefined,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: (res) => {
          toastSuccess(res.message);
          reset();
          onSuccess?.();
        },
      },
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#6B7280]" />
          <h2 className="font-semibold text-[#111827]">Alterar senha</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        {requireCurrent && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">
              Senha atual
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                {...register("currentPassword")}
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-11 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

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
              className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-11 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
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
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#111827]">
            Confirmar nova senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Repita a nova senha"
              className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-11 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
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
          {confirm.length > 0 && newPwd && (
            <p
              className={`mt-1 text-xs ${newPwd === confirm ? "text-[#16A34A]" : "text-red-500"}`}
            >
              {newPwd === confirm
                ? "✓ Senhas coincidem"
                : "✗ Senhas não coincidem"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={changePassword.isPending || !newPwd || !confirm}
          className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
        >
          {changePassword.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>
    </div>
  );
}
