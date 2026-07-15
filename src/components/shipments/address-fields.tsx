"use client";

import { UseFormRegister, FieldErrors, FieldPath } from "react-hook-form";
import { CreateShipmentFormValues } from "@/src/schemas/shipment.schema";

type AddressPrefix = "origin" | "destination";

export function AddressFields({
  prefix,
  label,
  register,
}: {
  prefix: AddressPrefix;
  label: string;
  register: UseFormRegister<CreateShipmentFormValues>;
  errors?: FieldErrors<CreateShipmentFormValues>;
}) {
  const field = (name: string) =>
    register(`${prefix}.${name}` as FieldPath<CreateShipmentFormValues>);

  return (
    <fieldset className="space-y-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:col-span-2">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
        {label}
      </legend>
      <div className="grid gap-2 sm:grid-cols-12">
        <input
          {...field("street")}
          placeholder="Rua / Avenida *"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-7"
        />
        <input
          {...field("number")}
          placeholder="Nº *"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-2"
        />
        <input
          {...field("cep")}
          placeholder="CEP *"
          maxLength={9}
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-mono outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-3"
        />
        <input
          {...field("neighborhood")}
          placeholder="Bairro *"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-5"
        />
        <input
          {...field("city")}
          placeholder="Cidade *"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-5"
        />
        <input
          {...field("state")}
          placeholder="UF *"
          maxLength={2}
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm uppercase outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-2"
        />
      </div>
    </fieldset>
  );
}
