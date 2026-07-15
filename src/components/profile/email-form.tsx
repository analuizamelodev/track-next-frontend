"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import {
  changeEmailSchema,
  ChangeEmailFormValues,
} from "@/src/schemas/auth.schema";
import { useUpdateUser } from "@/src/queries/users.queries";
import { toastSuccess } from "@/src/libs/toast";

export function EmailForm({
  currentEmail,
  userId,
}: {
  currentEmail: string;
  userId: string;
}) {
  const updateUser = useUpdateUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: currentEmail },
  });

  const email = watch("email");

  function onSubmit(values: ChangeEmailFormValues) {
    if (values.email.trim() === currentEmail) return;
    updateUser.mutate(
      { id: userId, data: { email: values.email.trim() } },
      {
        onSuccess: (res) => toastSuccess(res.message),
      },
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-[#6B7280]" />
          <h2 className="font-semibold text-[#111827]">Alterar email</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#111827]">
            Novo email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <input
              {...register("email")}
              type="email"
              className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-10 pr-4 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={
            updateUser.isPending ||
            !email?.trim() ||
            email.trim() === currentEmail
          }
          className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
        >
          {updateUser.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            "Atualizar email"
          )}
        </button>
      </form>
    </div>
  );
}
