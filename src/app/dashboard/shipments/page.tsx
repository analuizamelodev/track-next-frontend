"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import * as customersService from "@/src/services/customers-service";
import * as shipmentsService from "@/src/services/shipments-service";
import { Customer } from "@/src/types/customers-types";
import { AddressDto, Shipment } from "@/src/types/shipments-types";
import {
  canCancel,
  canFinish,
  canRepeatTransit,
  formatCep,
  getForwardStatuses,
  getProblemStatuses,
  getStatusLabel,
  isTerminal,
  REQUIRED_FOR_STATUS,
  SERVICE_LABELS,
  ShipmentStatus,
} from "@/src/libs/status";
import {
  Plus,
  X,
  ExternalLink,
  Truck,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Package,
  RefreshCw,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────

type ItemForm = { name: string; quantity: string; description: string };
const emptyItem = (): ItemForm => ({ name: "", quantity: "1", description: "" });

const emptyAddress = (): AddressDto => ({
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  cep: "",
});

const emptyForm = {
  customerId: "",
  senderName: "",
  recipientName: "",
  weight: "",
  serviceType: "PADRAO",
};

// ── Status Badge ───────────────────────────────────────────────────

const STATUS_BADGE: Record<number, string> = {
  [ShipmentStatus.ORDER_CREATED]: "bg-slate-100 text-slate-600 border-slate-200",
  [ShipmentStatus.IN_PREPARATION]: "bg-blue-50 text-blue-700 border-blue-200",
  [ShipmentStatus.IN_TRANSIT]: "bg-orange-50 text-orange-700 border-orange-200",
  [ShipmentStatus.OUT_FOR_DELIVERY]: "bg-purple-50 text-purple-700 border-purple-200",
  [ShipmentStatus.DELIVERED]: "bg-green-50 text-[#15803D] border-green-200",
  [ShipmentStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-200",
  [ShipmentStatus.EXTRAVIADO]: "bg-red-100 text-red-800 border-red-300",
  [ShipmentStatus.DANIFICADO]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [ShipmentStatus.ENDERECO_INVALIDO]: "bg-gray-100 text-gray-700 border-gray-300",
  [ShipmentStatus.DESTINATARIO_AUSENTE]: "bg-amber-50 text-amber-700 border-amber-200",
};

function StatusBadge({ status }: { status: number }) {
  const cls = STATUS_BADGE[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {getStatusLabel(status)}
    </span>
  );
}

// ── Address Fields ─────────────────────────────────────────────────

function AddressFields({
  values,
  onChange,
  label,
}: {
  values: AddressDto;
  onChange: (v: AddressDto) => void;
  label: string;
}) {
  const f = (field: keyof AddressDto) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...values, [field]: e.target.value });

  return (
    <fieldset className="space-y-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:col-span-2">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
        {label}
      </legend>
      <div className="grid gap-2 sm:grid-cols-12">
        <input
          value={values.street}
          onChange={f("street")}
          placeholder="Rua / Avenida *"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-7"
        />
        <input
          value={values.number}
          onChange={f("number")}
          placeholder="Nº *"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-2"
        />
        <input
          value={values.cep}
          onChange={f("cep")}
          placeholder="CEP *"
          maxLength={9}
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-mono outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-3"
        />
        <input
          value={values.neighborhood}
          onChange={f("neighborhood")}
          placeholder="Bairro *"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-5"
        />
        <input
          value={values.city}
          onChange={f("city")}
          placeholder="Cidade *"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-5"
        />
        <input
          value={values.state}
          onChange={f("state")}
          placeholder="UF *"
          maxLength={2}
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm uppercase outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] sm:col-span-2"
        />
      </div>
    </fieldset>
  );
}

// ── Status Actions ─────────────────────────────────────────────────

function StatusActions({
  shipment,
  onStatus,
  onCancel,
  onFinish,
}: {
  shipment: Shipment;
  onStatus: (id: string, status: number, location: string, description: string) => void;
  onCancel: (id: string) => void;
  onFinish: (id: string, data: { signedName: string; deliveryCep: string; phone: string; location: string }) => void;
}) {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [finishForm, setFinishForm] = useState({
    signedName: "",
    deliveryCep: formatCep(shipment.destinationCep),
    phone: "",
    location: "",
  });

  const forward = getForwardStatuses(shipment.status);
  const problems = getProblemStatuses(shipment.status);
  const showRepeatTransit = canRepeatTransit(shipment.status);
  const showCancel = canCancel(shipment.status);
  const showFinish = canFinish(shipment.status);
  const terminal = isTerminal(shipment.status);

  function needsField(status: number, field: "location" | "description"): boolean {
    return (REQUIRED_FOR_STATUS[status] ?? []).includes(field);
  }

  const finishMissing = !finishForm.signedName.trim() || !finishForm.deliveryCep.trim();
  const hasActions = showRepeatTransit || forward.length > 0 || problems.length > 0;

  if (terminal) {
    return (
      <p className="mt-3 text-xs text-[#6B7280]">Esta encomenda está encerrada.</p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {/* Shared inputs */}
      {hasActions && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Localização (ex: CD São Paulo)"
              className="w-full rounded-lg border border-[#E5E7EB] py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
            />
          </div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Observação / descrição"
            className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
          />
        </div>
      )}

      {/* Repeat transit */}
      {showRepeatTransit && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-blue-800">
            Registrar movimentação em trânsito
          </p>
          <p className="mb-2 text-xs text-blue-700">
            Adiciona um novo ponto no histórico sem alterar o status.
          </p>
          <button
            onClick={() => onStatus(shipment.id, ShipmentStatus.IN_TRANSIT, location, description)}
            disabled={!location.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Registrar movimentação
          </button>
        </div>
      )}

      {/* Forward statuses */}
      {forward.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {forward.map((status) => {
            const missingLocation = needsField(status, "location") && !location.trim();
            const missingDescription = needsField(status, "description") && !description.trim();
            const disabled = missingLocation || missingDescription;
            return (
              <button
                key={status}
                onClick={() => onStatus(shipment.id, status, location, description)}
                disabled={disabled}
                title={
                  missingLocation
                    ? "Preencha a localização"
                    : missingDescription
                    ? "Preencha a descrição"
                    : undefined
                }
                className="rounded-lg border border-[#16A34A] bg-[#F0FDF4] px-3 py-1.5 text-sm font-medium text-[#15803D] transition hover:bg-[#DCFCE7] disabled:cursor-not-allowed disabled:opacity-40"
              >
                → {getStatusLabel(status)}
                {needsField(status, "location") && (
                  <span className="ml-1 text-xs text-[#6B7280]">(local *)</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Problem statuses */}
      {problems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {problems.map((status) => (
            <button
              key={status}
              onClick={() => onStatus(shipment.id, status, location, description)}
              disabled={!description.trim()}
              title="Descrição obrigatória"
              className="flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {getStatusLabel(status)}
              <span className="text-xs text-amber-600">(desc *)</span>
            </button>
          ))}
        </div>
      )}

      {/* Cancel */}
      {showCancel && (
        <button
          onClick={() => onCancel(shipment.id)}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar entrega
        </button>
      )}

      {/* Finish delivery */}
      {showFinish && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-800">
            Confirmar entrega
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={finishForm.signedName}
              onChange={(e) => setFinishForm({ ...finishForm, signedName: e.target.value })}
              placeholder="Nome de quem assinou *"
              className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
            />
            <input
              value={finishForm.deliveryCep}
              onChange={(e) => setFinishForm({ ...finishForm, deliveryCep: e.target.value })}
              placeholder="CEP da entrega *"
              className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-[#16A34A]"
            />
            <input
              value={finishForm.phone}
              onChange={(e) => setFinishForm({ ...finishForm, phone: e.target.value })}
              placeholder="Telefone (opcional)"
              className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
            />
            <input
              value={finishForm.location}
              onChange={(e) => setFinishForm({ ...finishForm, location: e.target.value })}
              placeholder="Local da entrega (opcional)"
              className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A]"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-green-700">
              CEP destino:{" "}
              <span className="font-mono font-semibold">
                {formatCep(shipment.destinationCep)}
              </span>
            </p>
            <button
              onClick={() => onFinish(shipment.id, finishForm)}
              disabled={finishMissing}
              className="flex items-center gap-1.5 rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirmar entrega
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shipment Card ──────────────────────────────────────────────────

function ShipmentCard({
  shipment,
  onStatus,
  onCancel,
  onFinish,
}: {
  shipment: Shipment;
  onStatus: (id: string, status: number, location: string, description: string) => void;
  onCancel: (id: string) => void;
  onFinish: (id: string, data: { signedName: string; deliveryCep: string; phone: string; location: string }) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition hover:shadow-md">
      <div className="p-5">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <p className="font-mono text-lg font-bold text-[#111827]">
                {shipment.trackingCode}
              </p>
              <StatusBadge status={shipment.status} />
            </div>
            <p className="mt-1 text-sm text-[#6B7280]">
              <span className="font-medium text-[#111827]">{shipment.senderName}</span>
              {" → "}
              <span className="font-medium text-[#111827]">{shipment.recipientName}</span>
            </p>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              {shipment.originCity}/{shipment.originState} →{" "}
              {shipment.destinationCity}/{shipment.destinationState} ·{" "}
              {shipment.weight} kg · {SERVICE_LABELS[shipment.serviceType] ?? shipment.serviceType}
              {shipment.estimatedDelivery && (
                <> · Prazo: {new Date(shipment.estimatedDelivery).toLocaleDateString("pt-BR")}</>
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
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280] transition hover:bg-[#F8FAFC]"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  Recolher
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  Gerenciar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Items */}
        {shipment.items && shipment.items.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {shipment.items.map((item) => (
              <span
                key={item.id}
                className="rounded-md bg-[#F8FAFC] px-2 py-0.5 text-xs text-[#6B7280] border border-[#E5E7EB]"
              >
                {item.quantity}× {item.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded actions */}
      {expanded && (
        <div className="border-t border-[#E5E7EB] px-5 pb-5 pt-4">
          <StatusActions
            shipment={shipment}
            onStatus={onStatus}
            onCancel={onCancel}
            onFinish={onFinish}
          />
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [origin, setOrigin] = useState<AddressDto>(emptyAddress());
  const [destination, setDestination] = useState<AddressDto>(emptyAddress());
  const [items, setItems] = useState<ItemForm[]>([emptyItem()]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  async function load() {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        shipmentsService.findAll(),
        customersService.findAll(),
      ]);
      setShipments(s);
      setCustomers(c);
    } catch {
      setError("Não foi possível carregar as entregas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function updateItem(i: number, f: keyof ItemForm, v: string) {
    setItems((cur) => cur.map((item, idx) => (idx === i ? { ...item, [f]: v } : item)));
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validItems = items
      .map((i) => ({
        name: i.name.trim(),
        quantity: Number(i.quantity) || 0,
        description: i.description.trim() || undefined,
      }))
      .filter((i) => i.name && i.quantity >= 1);

    if (
      !form.customerId || !form.senderName.trim() || !form.recipientName.trim() ||
      !form.weight || !origin.street || !origin.cep || !origin.city || !origin.state ||
      !origin.number || !origin.neighborhood || !destination.street || !destination.cep ||
      !destination.city || !destination.state || !destination.number || !destination.neighborhood
    ) {
      setError("Preencha todos os campos obrigatórios (*).");
      return;
    }

    if (validItems.length === 0) {
      setError("Adicione pelo menos um item com nome e quantidade.");
      return;
    }

    setSaving(true);
    try {
      const created = await shipmentsService.create({
        customerId: form.customerId,
        senderName: form.senderName.trim(),
        origin,
        recipientName: form.recipientName.trim(),
        destination,
        weight: Number(form.weight),
        serviceType: form.serviceType,
        items: validItems,
      });
      setForm(emptyForm);
      setOrigin(emptyAddress());
      setDestination(emptyAddress());
      setItems([emptyItem()]);
      setShowForm(false);
      setSuccess(`Entrega criada com sucesso! Código: ${created.trackingCode}`);
      await load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const raw = e?.response?.data?.message;
      setError(Array.isArray(raw) ? raw.join(", ") : (raw ?? "Erro ao criar entrega."));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(id: string, status: number, location: string, description: string) {
    setError("");
    try {
      await shipmentsService.updateStatus(id, {
        status,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      });
      await load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Erro ao atualizar status.");
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancelar esta entrega?")) return;
    try {
      await shipmentsService.cancel(id);
      await load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Erro ao cancelar.");
    }
  }

  async function handleFinish(
    id: string,
    data: { signedName: string; deliveryCep: string; phone: string; location: string },
  ) {
    setError("");
    try {
      await shipmentsService.finish(id, {
        signedName: data.signedName.trim(),
        deliveryCep: data.deliveryCep.trim(),
        phone: data.phone.trim() || undefined,
        location: data.location.trim() || undefined,
      });
      setSuccess("Entrega confirmada com sucesso.");
      await load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Erro ao finalizar entrega.");
    }
  }

  const filtered = shipments.filter((s) => {
    const matchesSearch =
      !search ||
      s.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      s.senderName.toLowerCase().includes(search.toLowerCase()) ||
      s.recipientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || String(s.status) === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ─ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Entregas</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {shipments.length} entrega{shipments.length !== 1 ? "s" : ""} no total
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm((v) => !v);
            setError("");
            setSuccess("");
          }}
          className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2.5 font-semibold text-white transition hover:bg-[#15803D] active:scale-95"
        >
          {showForm ? (
            <><X className="h-4 w-4" /> Cancelar</>
          ) : (
            <><Plus className="h-4 w-4" /> Nova entrega</>
          )}
        </button>
      </div>

      {/* ── Alerts ─ */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#15803D]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* ── Create form ─ */}
      {showForm && (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#E5E7EB] px-6 py-4">
            <h2 className="font-semibold text-[#111827]">Nova entrega</h2>
          </div>
          <form onSubmit={handleCreate} className="grid gap-4 p-6 sm:grid-cols-2">
            {/* Cliente */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Cliente *
              </label>
              <select
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              >
                <option value="">Selecione o cliente</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Remetente */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Remetente *
              </label>
              <input
                value={form.senderName}
                onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                placeholder="Nome do remetente"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>

            {/* Destinatário */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Destinatário *
              </label>
              <input
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                placeholder="Nome do destinatário"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>

            {/* Origem */}
            <AddressFields values={origin} onChange={setOrigin} label="Endereço de origem" />

            {/* Destino */}
            <AddressFields values={destination} onChange={setDestination} label="Endereço de destino" />

            {/* Peso */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Peso (kg) *
              </label>
              <input
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="Ex: 1.5"
                type="number"
                step="0.001"
                min="0.001"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>

            {/* Serviço */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Tipo de serviço *
              </label>
              <select
                value={form.serviceType}
                onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              >
                {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Itens */}
            <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  Itens da encomenda
                </h3>
                <button
                  type="button"
                  onClick={() => setItems((c) => [...c, emptyItem()])}
                  className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1 text-sm font-medium text-[#111827] transition hover:border-[#16A34A] hover:text-[#16A34A]"
                >
                  <Plus className="h-3.5 w-3.5" /> Item
                </button>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid gap-2 sm:grid-cols-12">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    placeholder="Nome do item *"
                    className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A] sm:col-span-5"
                  />
                  <input
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    placeholder="Qtd"
                    type="number"
                    min={1}
                    className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A] sm:col-span-2"
                  />
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                    placeholder="Descrição"
                    className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#16A34A] sm:col-span-4"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setItems((c) => c.length === 1 ? c : c.filter((_, i) => i !== idx))
                    }
                    disabled={items.length === 1}
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
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Criando...</>
                ) : (
                  <><Package className="h-4 w-4" /> Criar entrega</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filters ─ */}
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

      {/* ── List ─ */}
      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-10 text-[#6B7280]">
          <Loader2 className="h-5 w-5 animate-spin text-[#16A34A]" />
          Carregando entregas...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-[#6B7280] opacity-40" />
          <p className="font-medium text-[#111827]">Nenhuma entrega encontrada</p>
          <p className="mt-1 text-sm text-[#6B7280]">
            {search || filterStatus
              ? "Tente ajustar os filtros de busca."
              : "Crie a primeira entrega clicando no botão acima."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              shipment={shipment}
              onStatus={handleStatus}
              onCancel={handleCancel}
              onFinish={handleFinish}
            />
          ))}
        </div>
      )}
    </div>
  );
}
