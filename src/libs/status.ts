export enum ShipmentStatus {
  ORDER_CREATED = 1,
  IN_PREPARATION = 2,
  IN_TRANSIT = 3,
  OUT_FOR_DELIVERY = 4,
  DELIVERED = 5,
  CANCELLED = 6,
  EXTRAVIADO = 7,
  DANIFICADO = 8,
  ENDERECO_INVALIDO = 9,
  DESTINATARIO_AUSENTE = 10,
}

type RequiredField = "location" | "description";

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.ORDER_CREATED]: "Pedido criado",
  [ShipmentStatus.IN_PREPARATION]: "Em preparação",
  [ShipmentStatus.IN_TRANSIT]: "Em trânsito",
  [ShipmentStatus.OUT_FOR_DELIVERY]: "Saiu para entrega",
  [ShipmentStatus.DELIVERED]: "Entregue",
  [ShipmentStatus.CANCELLED]: "Cancelada",
  [ShipmentStatus.EXTRAVIADO]: "Extraviado",
  [ShipmentStatus.DANIFICADO]: "Danificado",
  [ShipmentStatus.ENDERECO_INVALIDO]: "Endereço inválido",
  [ShipmentStatus.DESTINATARIO_AUSENTE]: "Destinatário ausente",
};

export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.ORDER_CREATED]: "bg-slate-100 text-slate-700",
  [ShipmentStatus.IN_PREPARATION]: "bg-yellow-50 text-yellow-800",
  [ShipmentStatus.IN_TRANSIT]: "bg-blue-50 text-blue-800",
  [ShipmentStatus.OUT_FOR_DELIVERY]: "bg-teal-50 text-teal-800",
  [ShipmentStatus.DELIVERED]: "bg-emerald-50 text-emerald-800",
  [ShipmentStatus.CANCELLED]: "bg-slate-100 text-slate-500",
  [ShipmentStatus.EXTRAVIADO]: "bg-rose-50 text-rose-800",
  [ShipmentStatus.DANIFICADO]: "bg-orange-50 text-orange-800",
  [ShipmentStatus.ENDERECO_INVALIDO]: "bg-amber-50 text-amber-800",
  [ShipmentStatus.DESTINATARIO_AUSENTE]: "bg-purple-50 text-purple-800",
};

/**
 * Espelho exato de STATUS_TRANSITIONS do backend.
 * IN_TRANSIT inclui ele mesmo para permitir múltiplas movimentações.
 */
const STATUS_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  [ShipmentStatus.ORDER_CREATED]: [ShipmentStatus.IN_PREPARATION],

  [ShipmentStatus.IN_PREPARATION]: [ShipmentStatus.IN_TRANSIT],

  [ShipmentStatus.IN_TRANSIT]: [
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.OUT_FOR_DELIVERY,
    ShipmentStatus.EXTRAVIADO,
    ShipmentStatus.DANIFICADO,
    ShipmentStatus.ENDERECO_INVALIDO,
  ],

  [ShipmentStatus.OUT_FOR_DELIVERY]: [
    ShipmentStatus.DESTINATARIO_AUSENTE,
    ShipmentStatus.DANIFICADO,
  ],

  [ShipmentStatus.DELIVERED]: [],

  [ShipmentStatus.CANCELLED]: [],

  [ShipmentStatus.EXTRAVIADO]: [],

  [ShipmentStatus.DANIFICADO]: [],

  [ShipmentStatus.ENDERECO_INVALIDO]: [],

  [ShipmentStatus.DESTINATARIO_AUSENTE]: [
    ShipmentStatus.OUT_FOR_DELIVERY,
  ],
};

const CANCELLABLE_FROM = new Set<ShipmentStatus>([
  ShipmentStatus.ORDER_CREATED,
  ShipmentStatus.IN_PREPARATION,
  ShipmentStatus.EXTRAVIADO,
  ShipmentStatus.DANIFICADO,
  ShipmentStatus.ENDERECO_INVALIDO,
  ShipmentStatus.DESTINATARIO_AUSENTE,
]);

const FINISHABLE_FROM = new Set<ShipmentStatus>([
  ShipmentStatus.OUT_FOR_DELIVERY,
]);

const PROBLEM_STATUSES = new Set<ShipmentStatus>([
  ShipmentStatus.EXTRAVIADO,
  ShipmentStatus.DANIFICADO,
  ShipmentStatus.ENDERECO_INVALIDO,
  ShipmentStatus.DESTINATARIO_AUSENTE,
]);

// Record<number, ...> para permitir indexação por number (shipment.status vem do Prisma como number)
export const REQUIRED_FOR_STATUS: Record<number, RequiredField[] | undefined> = {
  [ShipmentStatus.IN_TRANSIT]:           ["location"],
  [ShipmentStatus.OUT_FOR_DELIVERY]:     ["location"],
  [ShipmentStatus.DESTINATARIO_AUSENTE]: ["description"],
  [ShipmentStatus.ENDERECO_INVALIDO]:    ["description"],
  [ShipmentStatus.DANIFICADO]:           ["description"],
  [ShipmentStatus.EXTRAVIADO]:           ["description"],
};

export function getStatusLabel(status: ShipmentStatus): string {
  return STATUS_LABELS[status] ?? "Desconhecido";
}

export function getStatusColor(status: ShipmentStatus): string {
  return STATUS_COLORS[status] ?? "bg-slate-100 text-slate-700";
}

export function getAllowedNextStatuses(
  current: ShipmentStatus,
): ShipmentStatus[] {
  return STATUS_TRANSITIONS[current] ?? [];
}

export function getForwardStatuses(
  current: ShipmentStatus,
): ShipmentStatus[] {
  return getAllowedNextStatuses(current).filter(
    (status) => status !== current && !PROBLEM_STATUSES.has(status),
  );
}

export function getProblemStatuses(
  current: ShipmentStatus,
): ShipmentStatus[] {
  return getAllowedNextStatuses(current).filter((status) =>
    PROBLEM_STATUSES.has(status),
  );
}

export function canRepeatTransit(current: ShipmentStatus): boolean {
  return current === ShipmentStatus.IN_TRANSIT;
}

export function canCancel(status: ShipmentStatus): boolean {
  return CANCELLABLE_FROM.has(status);
}

export function canFinish(status: ShipmentStatus): boolean {
  return FINISHABLE_FROM.has(status);
}

export function isTerminal(status: ShipmentStatus): boolean {
  return (
    status === ShipmentStatus.DELIVERED ||
    status === ShipmentStatus.CANCELLED
  );
}

export function isProblem(status: ShipmentStatus): boolean {
  return PROBLEM_STATUSES.has(status);
}

export function formatCep(cep: string): string {
  const digits = cep.replace(/\D/g, "");

  return digits.length === 8
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : cep;
}

export const SERVICE_LABELS: Record<string, string> = {
  EXPRESSO: "Expresso (3 dias úteis)",
  PADRAO: "Padrão (7 dias úteis)",
  ECONOMICO: "Econômico (14 dias úteis)",
};