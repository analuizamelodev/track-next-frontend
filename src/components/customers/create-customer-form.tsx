"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import {
  createCustomerSchema,
  CreateCustomerFormValues,
} from "@/src/schemas/customer.schema";
import { useCreateCustomer } from "@/src/queries/customers.queries";
import { toastSuccess } from "@/src/libs/toast";

function toPayload(values: CreateCustomerFormValues) {
  return {
    name: values.name.trim(),
    email: values.email?.trim() || undefined,
    document: values.document?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
  };
}

export function CreateCustomerForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const createCustomer = useCreateCustomer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: { name: "", email: "", document: "", phone: "" },
  });

  function onSubmit(values: CreateCustomerFormValues) {
    createCustomer.mutate(toPayload(values), {
      onSuccess: () => {
        toastSuccess("Cliente cadastrado com sucesso.");
        onSuccess();
      },
    });
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="border-b border-[#E5E7EB] px-6 py-4">
        <h2 className="font-semibold text-[#111827]">Cadastrar cliente</h2>
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
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="email@exemplo.com"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Documento
          </label>
          <input
            {...register("document")}
            placeholder="CPF ou CNPJ"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Telefone
          </label>
          <input
            {...register("phone")}
            placeholder="(00) 00000-0000"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={createCustomer.isPending}
            className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
          >
            {createCustomer.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Cadastrar
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
