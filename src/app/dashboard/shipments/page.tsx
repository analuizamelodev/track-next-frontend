"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Package, Plus, Truck, X } from "lucide-react";
import { useCustomers } from "@/src/queries/customers.queries";
import { useShipments } from "@/src/queries/shipments.queries";
import { getStatusLabel, ShipmentStatus } from "@/src/libs/status";
import { CreateShipmentForm } from "@/src/components/shipments/create-shipment-form";
import { ShipmentCard } from "@/src/components/shipments/shipment-card";
import { onMutationError } from "@/src/libs/toast";

export default function ShipmentsPage() {
  const { data: shipments = [], isLoading, isError, error } = useShipments();
  const { data: customers = [] } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (isError) onMutationError("Não foi possível carregar as entregas.")(error);
  }, [isError, error]);

  const filtered = useMemo(
    () =>
      shipments.filter((s) => {
        const matchesSearch =
          !search ||
          s.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
          s.senderName.toLowerCase().includes(search.toLowerCase()) ||
          s.recipientName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !filterStatus || String(s.status) === filterStatus;
        return matchesSearch && matchesStatus;
      }),
    [shipments, search, filterStatus],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Entregas</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {shipments.length} entrega{shipments.length !== 1 ? "s" : ""} no
            total
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2.5 font-semibold text-white transition hover:bg-[#15803D] active:scale-95"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" /> Cancelar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Nova entrega
            </>
          )}
        </button>
      </div>

      {showForm && (
        <CreateShipmentForm
          customers={customers}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Truck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, remetente ou destinatário..."
            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#16A34A]"
        >
          <option value="">Todos os status</option>
          {Object.entries(ShipmentStatus)
            .filter(([, v]) => typeof v === "number")
            .map(([key, value]) => (
              <option key={key} value={String(value)}>
                {getStatusLabel(value as ShipmentStatus)}
              </option>
            ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-10 text-[#6B7280]">
          <Loader2 className="h-5 w-5 animate-spin text-[#16A34A]" />
          Carregando entregas...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-[#6B7280] opacity-40" />
          <p className="font-medium text-[#111827]">
            Nenhuma entrega encontrada
          </p>
          <p className="mt-1 text-sm text-[#6B7280]">
            {search || filterStatus
              ? "Tente ajustar os filtros."
              : "Crie a primeira entrega clicando no botão acima."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </div>
      )}
    </div>
  );
}
