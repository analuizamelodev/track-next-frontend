"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { User } from "@/src/types/users-types";
import { editUserSchema, EditUserFormValues } from "@/src/schemas/user.schema";
import { useUpdateUser } from "@/src/queries/users.queries";
import { Dialog } from "@/src/components/ui/dialog";
import { toastSuccess } from "@/src/libs/toast";

export function EditUserDialog({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const updateUser = useUpdateUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  const name = watch("name");
  const email = watch("email");
  const hasChanges =
    name.trim() !== user.name || email.trim() !== user.email;

  function onSubmit(values: EditUserFormValues) {
    if (!hasChanges) return;
    updateUser.mutate(
      {
        id: user.id,
        data: {
          ...(values.name.trim() !== user.name && { name: values.name.trim() }),
          ...(values.email.trim() !== user.email && {
            email: values.email.trim(),
          }),
        },
      },
      {
        onSuccess: () => {
          toastSuccess("Usuário atualizado com sucesso.");
          onClose();
        },
      },
    );
  }

  return (
    <Dialog
      title="Editar usuário"
      subtitle="O operador será notificado por email sobre as alterações."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#111827]">
            Nome
          </label>
          <input
            {...register("name")}
            autoFocus
            className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#111827]">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <input
              {...register("email")}
              type="email"
              className="w-full rounded-xl border border-[#E5E7EB] py-2.5 pl-9 pr-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={updateUser.isPending || !hasChanges}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-2.5 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-50"
          >
            {updateUser.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 font-semibold text-[#6B7280] hover:bg-[#F8FAFC]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Dialog>
  );
}
