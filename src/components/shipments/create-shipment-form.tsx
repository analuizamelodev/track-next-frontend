"use client";

import { useFieldArray, useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package, Plus, X } from "lucide-react";
import { Customer } from "@/src/types/customers-types";
import { SERVICE_LABELS } from "@/src/libs/status";
import {
  createShipmentSchema,
  CreateShipmentFormValues,
} from "@/src/schemas/shipment.schema";
import { useCreateShipment } from "@/src/queries/shipments.queries";
import { toastSuccess } from "@/src/libs/toast";
import { AddressFields } from "@/src/components/shipments/address-fields";

const emptyAddress = {
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  cep: "",
};

export function CreateShipmentForm({
  customers,
  onSuccess,
}: {
  customers: Customer[];
  onSuccess: (trackingCode: string) => void;
}) {
  const createShipment = useCreateShipment();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateShipmentFormValues>({
    resolver: zodResolver(
      createShipmentSchema,
    ) as Resolver<CreateShipmentFormValues>,
    defaultValues: {
      customerId: "",
      senderName: "",
      recipientName: "",
      weight: undefined as unknown as number,
      serviceType: "PADRAO",
      origin: emptyAddress,
      destination: emptyAddress,
      items: [{ name: "", quantity: 1, description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  function onSubmit(values: CreateShipmentFormValues) {
    createShipment.mutate(
      {
        ...values,
        items: values.items.map((i) => ({
          name: i.name.trim(),
          quantity: Number(i.quantity),
          description: i.description?.trim() || undefined,
        })),
      },
      {
        onSuccess: (created) => {
          toastSuccess(`Entrega criada! Código: ${created.trackingCode}`);
          onSuccess(created.trackingCode);
        },
      },
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="border-b border-[#E5E7EB] px-6 py-4">
        <h2 className="font-semibold text-[#111827]">Nova entrega</h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 p-6 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Cliente *
          </label>
          <select
            {...register("customerId")}
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          >
            <option value="">Selecione o cliente</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.customerId.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Remetente *
          </label>
          <input
            {...register("senderName")}
            placeholder="Nome do remetente"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
          {errors.senderName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.senderName.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Destinatário *
          </label>
          <input
            {...register("recipientName")}
            placeholder="Nome do destinatário"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
          {errors.recipientName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.recipientName.message}
            </p>
          )}
        </div>
        <AddressFields
          prefix="origin"
          label="Endereço de origem"
          register={register}
        />
        <AddressFields
          prefix="destination"
          label="Endereço de destino"
          register={register}
        />
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Peso (kg) *
          </label>
          <input
            {...register("weight")}
            placeholder="Ex: 1.5"
            type="number"
            step="0.001"
            min="0.001"
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
          {errors.weight && (
            <p className="mt-1 text-xs text-red-600">{errors.weight.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Tipo de serviço *
          </label>
          <select
            {...register("serviceType")}
            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          >
            {Object.entries(SERVICE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
              Itens
            </h3>
            <button
              type="button"
              onClick={() => append({ name: "", quantity: 1, description: "" })}
              className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1 text-sm font-medium text-[#111827] transition hover:border-[#16A34A] hover:text-[#16A34A]"
            >
              <Plus className="h-3.5 w-3.5" /> Item
            </button>
          </div>
          {errors.items?.message && (
            <p className="text-xs text-red-600">{errors.items.message}</p>
          )}
          {fields.map((field, idx) => (
            <div key={field.id} className="grid gap-2 sm:grid-cols-12">
              <input
                {...register(`items.${idx}.name`)}
                placeholder="Nome do item *"
                className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A] sm:col-span-5"
              />
              <input
                {...register(`items.${idx}.quantity`)}
                placeholder="Qtd"
                type="number"
                min={1}
                className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A] sm:col-span-2"
              />
              <input
                {...register(`items.${idx}.description`)}
                placeholder="Descrição"
                className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A] sm:col-span-4"
              />
              <button
                type="button"
                onClick={() => fields.length > 1 && remove(idx)}
                disabled={fields.length === 1}
                className="flex items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-30 sm:col-span-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={createShipment.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
          >
            {createShipment.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Criando...
              </>
            ) : (
              <>
                <Package className="h-4 w-4" /> Criar entrega
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
