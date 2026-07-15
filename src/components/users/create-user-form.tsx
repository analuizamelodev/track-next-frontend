"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { UserRole } from "@/src/libs/auth";
import {
  createUserSchema,
  CreateUserFormValues,
} from "@/src/schemas/user.schema";
import { useCreateUser } from "@/src/queries/users.queries";
import { toastSuccess } from "@/src/libs/toast";

export function CreateUserForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: (message: string) => void;
}) {
  const createUser = useCreateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema) as Resolver<CreateUserFormValues>,
    defaultValues: {
      name: "",
      email: "",
      role: UserRole.OPERATOR,
    },
  });

  function onSubmit(values: CreateUserFormValues) {
    createUser.mutate(values, {
      onSuccess: (res) => {
        const message = `${res.message} O usuário receberá a senha por e-mail.`;
        toastSuccess(message);
        onSuccess(message);
      },
    });
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="border-b border-[#E5E7EB] px-6 py-4">
        <h2 className="font-semibold text-[#111827]">Criar novo usuário</h2>
        <p className="mt-0.5 text-sm text-[#6B7280]">
          Um e-mail com a senha temporária será enviado automaticamente.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 p-6 sm:grid-cols-2"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Nome *
          </label>
          <input
            {...register("name")}
            placeholder="Nome completo"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Email *
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="email@empresa.com"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Perfil
          </label>
          <select
            {...register("role")}
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[#111827] outline-none transition focus:border-[#16A34A]"
          >
            <option value={UserRole.OPERATOR}>Operador</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </div>
        <div className="flex items-end gap-3">
          <button
            type="submit"
            disabled={createUser.isPending}
            className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
          >
            {createUser.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Criando...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Criar
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#E5E7EB] px-6 py-3 font-semibold text-[#6B7280] transition hover:bg-[#F8FAFC]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
