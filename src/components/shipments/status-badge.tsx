"use client";

import { getStatusLabel, ShipmentStatus } from "@/src/libs/status";

const STATUS_BADGE: Record<number, string> = {
  [ShipmentStatus.ORDER_CREATED]: "bg-slate-100 text-slate-600 border-slate-200",
  [ShipmentStatus.IN_PREPARATION]: "bg-blue-50 text-blue-700 border-blue-200",
  [ShipmentStatus.IN_TRANSIT]: "bg-orange-50 text-orange-700 border-orange-200",
  [ShipmentStatus.OUT_FOR_DELIVERY]:
    "bg-purple-50 text-purple-700 border-purple-200",
  [ShipmentStatus.DELIVERED]: "bg-green-50 text-[#15803D] border-green-200",
  [ShipmentStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-200",
  [ShipmentStatus.EXTRAVIADO]: "bg-red-100 text-red-800 border-red-300",
  [ShipmentStatus.DANIFICADO]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [ShipmentStatus.ENDERECO_INVALIDO]: "bg-gray-100 text-gray-700 border-gray-300",
  [ShipmentStatus.DESTINATARIO_AUSENTE]:
    "bg-amber-50 text-amber-700 border-amber-200",
};

export function StatusBadge({ status }: { status: number }) {
  const cls =
    STATUS_BADGE[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
