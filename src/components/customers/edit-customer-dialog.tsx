"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Customer } from "@/src/types/customers-types";
import {
  updateCustomerSchema,
  UpdateCustomerFormValues,
} from "@/src/schemas/customer.schema";
import { useUpdateCustomer } from "@/src/queries/customers.queries";
import { Dialog } from "@/src/components/ui/dialog";
import { toastSuccess } from "@/src/libs/toast";

export function EditCustomerDialog({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const updateCustomer = useUpdateCustomer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCustomerFormValues>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      document: customer.document ?? "",
    },
  });

  function onSubmit(values: UpdateCustomerFormValues) {
    updateCustomer.mutate(
      {
        id: customer.id,
        data: {
          name: values.name.trim(),
          email: values.email?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          document: values.document?.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toastSuccess("Cliente atualizado com sucesso.");
          onClose();
        },
      },
    );
  }

  return (
    <Dialog
      title="Editar cliente"
      subtitle="O cliente será notificado por email sobre as alterações."
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Nome *
          </label>
          <input
            {...register("name")}
            autoFocus
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Telefone
          </label>
          <input
            {...register("phone")}
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Documento
          </label>
          <input
            {...register("document")}
            placeholder="CPF ou CNPJ"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={updateCustomer.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-50"
          >
            {updateCustomer.isPending ? (
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
            className="rounded-xl border border-[#E5E7EB] px-5 py-3 font-semibold text-[#6B7280] hover:bg-[#F8FAFC]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Dialog>
  );
}
