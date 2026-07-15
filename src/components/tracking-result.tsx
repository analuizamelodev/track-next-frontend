import { PublicTracking } from "@/src/types/shipments-types";
import {
  getStatusLabel,
  isProblem,
  SERVICE_LABELS,
  ShipmentStatus,
} from "@/src/libs/status";
import {
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Weight,
  ClipboardList,
  Home,
  Navigation,
  PackageSearch,
  Ban,
  PackageOpen,
} from "lucide-react";

// ── Status config ──────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  number,
  { color: string; bg: string; border: string; icon: React.ReactNode; dot: string }
> = {
  [ShipmentStatus.ORDER_CREATED]: {
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    icon: <ClipboardList className="h-4 w-4" />,
    dot: "bg-slate-400",
  },
  [ShipmentStatus.IN_PREPARATION]: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <Package className="h-4 w-4" />,
    dot: "bg-blue-500",
  },
  [ShipmentStatus.IN_TRANSIT]: {
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: <Truck className="h-4 w-4" />,
    dot: "bg-orange-500",
  },
  [ShipmentStatus.OUT_FOR_DELIVERY]: {
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: <Navigation className="h-4 w-4" />,
    dot: "bg-purple-500",
  },
  [ShipmentStatus.DELIVERED]: {
    color: "text-[#15803D]",
    bg: "bg-[#DCFCE7]",
    border: "border-green-200",
    icon: <CheckCircle2 className="h-4 w-4" />,
    dot: "bg-[#16A34A]",
  },
  [ShipmentStatus.CANCELLED]: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <XCircle className="h-4 w-4" />,
    dot: "bg-red-500",
  },
  [ShipmentStatus.EXTRAVIADO]: {
    color: "text-red-900",
    bg: "bg-red-100",
    border: "border-red-300",
    icon: <PackageSearch className="h-4 w-4" />,
    dot: "bg-red-700",
  },
  [ShipmentStatus.DANIFICADO]: {
    color: "text-yellow-800",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: <AlertTriangle className="h-4 w-4" />,
    dot: "bg-yellow-500",
  },
  [ShipmentStatus.ENDERECO_INVALIDO]: {
    color: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-300",
    icon: <Home className="h-4 w-4" />,
    dot: "bg-gray-500",
  },
  [ShipmentStatus.DESTINATARIO_AUSENTE]: {
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Ban className="h-4 w-4" />,
    dot: "bg-amber-500",
  },
};

function getConfig(status: number) {
  return (
    STATUS_CONFIG[status] ?? {
      color: "text-slate-600",
      bg: "bg-slate-100",
      border: "border-slate-200",
      icon: <Package className="h-4 w-4" />,
      dot: "bg-slate-400",
    }
  );
}

// ── Progress bar ───────────────────────────────────────────────────

const MAIN_STEPS = [
  ShipmentStatus.ORDER_CREATED,
  ShipmentStatus.IN_PREPARATION,
  ShipmentStatus.IN_TRANSIT,
  ShipmentStatus.OUT_FOR_DELIVERY,
  ShipmentStatus.DELIVERED,
];

const STEP_LABELS = [
  "Criado",
  "Em preparação",
  "Em trânsito",
  "Saiu p/ entrega",
  "Entregue",
];

function ProgressBar({ status }: { status: number }) {
  const isCancelled =
    status === ShipmentStatus.CANCELLED || isProblem(status);

  const currentStep = isCancelled
    ? -1
    : MAIN_STEPS.findIndex((s) => s === status);

  const completed = isCancelled ? 0 : currentStep;

  return (
    <div className="mb-6">
      <div className="relative flex items-center justify-between">
        {/* connector line */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-[#E5E7EB]" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-[#16A34A] transition-all duration-700"
          style={{
            width: isCancelled
              ? "0%"
              : `${(completed / (MAIN_STEPS.length - 1)) * 100}%`,
          }}
        />

        {MAIN_STEPS.map((step, i) => {
          const done = !isCancelled && i <= currentStep;
          const active = !isCancelled && i === currentStep;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all
                  ${done
                    ? "border-[#16A34A] bg-[#16A34A] text-white"
                    : "border-[#E5E7EB] bg-white text-[#6B7280]"
                  }
                  ${active ? "ring-4 ring-[#DCFCE7]" : ""}
                `}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </div>
              <span
                className={`hidden text-center text-xs font-medium sm:block ${
                  done ? "text-[#16A34A]" : "text-[#6B7280]"
                }`}
              >
                {STEP_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <p className="mt-4 text-center text-sm font-medium text-red-600">
          Esta entrega não segue o fluxo normal —{" "}
          {getStatusLabel(status)}
        </p>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatWeight(weight: number) {
  return weight >= 1
    ? `${weight.toFixed(3)} kg`
    : `${(weight * 1000).toFixed(0)} g`;
}

// ── InfoCard ───────────────────────────────────────────────────────

function InfoCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#16A34A]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#6B7280]">{label}</p>
        <p className="mt-0.5 font-semibold text-[#111827] leading-snug">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-[#6B7280] leading-snug">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────

export function TrackingResult({ data }: { data: PublicTracking }) {
  const cfg = getConfig(data.status);

  return (
    <div className="space-y-6">
      {/* ─ Header card ─ */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
              Código de rastreio
            </p>
            <p className="mt-0.5 font-mono text-3xl font-bold text-[#111827]">
              {data.trackingCode}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold ${cfg.bg} ${cfg.color} ${cfg.border}`}
          >
            {cfg.icon}
            {data.statusLabel}
          </span>
        </div>

        <ProgressBar status={data.status} />

        {data.signedByName && (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#F0FDF4] px-4 py-3 text-sm text-[#15803D]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              Entregue e recebido por{" "}
              <strong>{data.signedByName}</strong>
              {data.deliveredAt && ` em ${formatDate(data.deliveredAt)}`}
            </span>
          </div>
        )}
      </div>

      {/* ─ Info cards ─ */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          icon={<User className="h-5 w-5" />}
          label="Remetente"
          value={data.senderName}
          sub={data.origin}
        />
        <InfoCard
          icon={<MapPin className="h-5 w-5" />}
          label="Destinatário"
          value={data.recipientName}
          sub={data.destination}
        />
        <InfoCard
          icon={<Calendar className="h-5 w-5" />}
          label="Previsão de entrega"
          value={data.estimatedDelivery ? formatDate(data.estimatedDelivery) : "—"}
        />
        <InfoCard
          icon={<Truck className="h-5 w-5" />}
          label="Serviço"
          value={SERVICE_LABELS[data.serviceType] ?? data.serviceType}
        />
        <InfoCard
          icon={<Weight className="h-5 w-5" />}
          label="Peso"
          value={formatWeight(data.weight)}
        />
        <InfoCard
          icon={<Clock className="h-5 w-5" />}
          label="Data de postagem"
          value={formatDate(data.createdAt)}
        />
      </div>

      {/* ─ Timeline ─ */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
          <PackageOpen className="h-4 w-4" />
          Histórico de rastreamento
        </h2>

        <ol className="space-y-0">
          {[...data.timeline].reverse().map((event, index, arr) => {
            const eCfg = getConfig(event.status);
            const isLast = index === arr.length - 1;

            return (
              <li key={`${event.status}-${event.date}-${index}`} className="flex gap-4">
                {/* Dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${eCfg.bg} ${eCfg.border} ${eCfg.color}`}
                  >
                    {eCfg.icon}
                  </div>
                  {!isLast && (
                    <div className="my-1 w-px flex-1 bg-[#E5E7EB]" style={{ minHeight: "1.5rem" }} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-6 pt-1 ${isLast ? "pb-0" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${eCfg.bg} ${eCfg.color} ${eCfg.border}`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {formatDate(event.date)}
                    </span>
                  </div>

                  {event.description && (
                    <p className="mt-1.5 text-sm font-medium text-[#111827]">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-1 flex flex-wrap gap-3">
                    {event.location && (
                      <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                    {event.changedByName && (
                      <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <User className="h-3 w-3" />
                        {event.changedByName}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
