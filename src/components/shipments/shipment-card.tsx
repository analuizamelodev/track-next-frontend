"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Shipment } from "@/src/types/shipments-types";
import { SERVICE_LABELS } from "@/src/libs/status";
import { StatusBadge } from "@/src/components/shipments/status-badge";
import { StatusActions } from "@/src/components/shipments/status-actions";

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition hover:shadow-md">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <p className="font-mono text-lg font-bold text-[#111827]">
                {shipment.trackingCode}
              </p>
              <StatusBadge status={shipment.status} />
            </div>
            <p className="mt-1 text-sm text-[#6B7280]">
              <span className="font-medium text-[#111827]">
                {shipment.senderName}
              </span>
              {" → "}
              <span className="font-medium text-[#111827]">
                {shipment.recipientName}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              {shipment.originCity}/{shipment.originState} →{" "}
              {shipment.destinationCity}/{shipment.destinationState} ·{" "}
              {shipment.weight} kg ·{" "}
              {SERVICE_LABELS[shipment.serviceType] ?? shipment.serviceType}
              {shipment.estimatedDelivery && (
                <>
                  {" "}
                  · Prazo:{" "}
                  {new Date(shipment.estimatedDelivery).toLocaleDateString(
                    "pt-BR",
                  )}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/track/${shipment.trackingCode}`}
              target="_blank"
              className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280] transition hover:border-[#16A34A] hover:text-[#16A34A]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Rastreio
            </Link>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280] transition hover:bg-[#F8FAFC]"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> Recolher
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> Gerenciar
                </>
              )}
            </button>
          </div>
        </div>

        {shipment.items && shipment.items.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {shipment.items.map((item) => (
              <span
                key={item.id}
                className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-0.5 text-xs text-[#6B7280]"
              >
                {item.quantity}× {item.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <div className="border-t border-[#E5E7EB] px-5 pb-5 pt-4">
          <StatusActions shipment={shipment} />
        </div>
      )}
    </div>
  );
}
