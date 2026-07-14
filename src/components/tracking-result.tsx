import { PublicTracking } from "@/src/types/shipments-types";
import {
  getStatusColor,
  getStatusLabel,
  isProblem,
  SERVICE_LABELS,
  ShipmentStatus,
} from "@/src/libs/status";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatWeight(weight: number) {
  return weight >= 1 ? `${weight.toFixed(3)} kg` : `${(weight * 1000).toFixed(0)} g`;
}

function dotColor(status: number) {
  if (status === ShipmentStatus.DELIVERED) return "bg-emerald-500";
  if (isProblem(status)) return "bg-rose-500";
  return "bg-teal-500";
}

export function TrackingResult({ data }: { data: PublicTracking }) {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">Código de rastreio</p>
          <p className="font-mono text-2xl font-bold text-slate-900">
            {data.trackingCode}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(data.status)}`}
        >
          {data.statusLabel}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-400">Remetente</p>
          <p className="font-medium text-slate-900">{data.senderName}</p>
          <p className="text-sm text-slate-600">{data.origin}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Destinatário</p>
          <p className="font-medium text-slate-900">{data.recipientName}</p>
          <p className="text-sm text-slate-600">{data.destination}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Tipo de serviço</p>
          <p className="font-medium text-slate-900">
            {SERVICE_LABELS[data.serviceType] ?? data.serviceType}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Peso</p>
          <p className="font-medium text-slate-900">{formatWeight(data.weight)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Prazo estimado</p>
          <p className="font-medium text-slate-900">
            {data.estimatedDelivery ? formatDate(data.estimatedDelivery) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Entregue em</p>
          <p className="font-medium text-slate-900">
            {formatDate(data.deliveredAt)}
          </p>
        </div>
      </div>

      {data.signedByName && (
        <p className="text-sm text-slate-600">
          Recebido por:{" "}
          <span className="font-semibold text-slate-900">{data.signedByName}</span>
        </p>
      )}

      {/* Timeline */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Histórico de rastreamento
        </h2>
        <ol className="space-y-4">
          {[...data.timeline].reverse().map((event, index) => (
            <li key={`${event.status}-${event.date}-${index}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${dotColor(event.status)}`}
                />
                {index < data.timeline.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-slate-200" />
                )}
              </div>
              <div className="pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(event.status)}`}
                  >
                    {event.statusLabel}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(event.date)}
                  </span>
                </div>
                {event.description && (
                  <p className="mt-1 text-sm text-slate-700">{event.description}</p>
                )}
                {event.location && (
                  <p className="text-sm text-slate-500">
                    📍 {event.location}
                  </p>
                )}
                {event.changedByName && (
                  <p className="text-xs text-slate-400">
                    por {event.changedByName}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
