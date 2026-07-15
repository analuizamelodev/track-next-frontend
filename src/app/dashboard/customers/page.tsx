"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { useCustomers } from "@/src/queries/customers.queries";
import { Customer } from "@/src/types/customers-types";
import { CreateCustomerForm } from "@/src/components/customers/create-customer-form";
import { EditCustomerDialog } from "@/src/components/customers/edit-customer-dialog";
import { CustomersTable } from "@/src/components/customers/customers-table";
import { onMutationError } from "@/src/libs/toast";

export default function CustomersPage() {
  const { data: customers = [], isLoading, isError, error } = useCustomers();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (isError) onMutationError("Não foi possível carregar os clientes.")(error);
  }, [isError, error]);

  return (
    <div className="space-y-6">
      {editCustomer && (
        <EditCustomerDialog
          customer={editCustomer}
          onClose={() => setEditCustomer(null)}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Clientes</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {customers.length} cliente{customers.length !== 1 ? "s" : ""}{" "}
            cadastrado{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2.5 font-semibold text-white transition hover:bg-[#15803D] active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          Novo cliente
        </button>
      </div>

      {showForm && (
        <CreateCustomerForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
        />
      </div>

      <CustomersTable
        customers={customers}
        loading={isLoading}
        search={search}
        onEdit={setEditCustomer}
      />
    </div>
  );
}
