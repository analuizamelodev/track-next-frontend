"use client";

import { FileText, Loader2, Mail, Pencil, Phone, Trash2, Users } from "lucide-react";
import { Customer } from "@/src/types/customers-types";
import { useDeleteCustomer } from "@/src/queries/customers.queries";
import { toastSuccess } from "@/src/libs/toast";

export function CustomersTable({
  customers,
  loading,
  search,
  onEdit,
}: {
  customers: Customer[];
  loading: boolean;
  search: string;
  onEdit: (customer: Customer) => void;
}) {
  const deleteCustomer = useDeleteCustomer();

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  function handleDelete(id: string) {
    if (!confirm("Excluir este cliente?")) return;
    deleteCustomer.mutate(id, {
      onSuccess: () => toastSuccess("Cliente excluído."),
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <tr>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Cliente
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Contato
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Documento
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-[#6B7280]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#16A34A]" />
                    Carregando...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-[#6B7280] opacity-30" />
                  <p className="text-sm text-[#6B7280]">
                    {search
                      ? "Nenhum cliente encontrado."
                      : "Nenhum cliente cadastrado."}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-[#F8FAFC]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-sm font-bold text-[#15803D]">
                        {customer.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-[#111827]">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      {customer.email && (
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Mail className="h-3.5 w-3.5" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Phone className="h-3.5 w-3.5" />
                          {customer.phone}
                        </div>
                      )}
                      {!customer.email && !customer.phone && (
                        <span className="text-[#6B7280]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {customer.document ? (
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <FileText className="h-3.5 w-3.5" />
                        {customer.document}
                      </div>
                    ) : (
                      <span className="text-[#6B7280]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280] transition hover:border-[#16A34A] hover:text-[#16A34A]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(customer.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
