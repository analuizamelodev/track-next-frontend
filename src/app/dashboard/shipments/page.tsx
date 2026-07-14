"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import * as customersService from "@/src/services/customers-service";
import * as shipmentsService from "@/src/services/shipments-service";
import { Customer } from "@/src/types/customers-types";
import { AddressDto, Shipment } from "@/src/types/shipments-types";
import {
  canCancel,
  canFinish,
  formatCep,
  getForwardStatuses,
  getProblemStatuses,
  getStatusColor,
  getStatusLabel,
  isTerminal,
  SERVICE_LABELS,
  ShipmentStatus,
} from "@/src/libs/status";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function AddressFields({
  prefix,
  values,
  onChange,
  label,
}: {
  prefix: string;
  values: AddressDto;
  onChange: (v: AddressDto) => void;
  label: string;
}) {
  const f = (field: keyof AddressDto) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => onChange({ ...values, [field]: e.target.value });

  return (
    <fieldset className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </legend>
      <div className="grid gap-2 sm:grid-cols-12">
        <input
          value={values.street}
          onChange={f("street")}
          placeholder="Rua / Avenida *"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 sm:col-span-7"
        />
        <input
          value={values.number}
          onChange={f("number")}
          placeholder="Nº *"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 sm:col-span-2"
        />
        <input
          value={values.cep}
          onChange={f("cep")}
          placeholder="CEP *"
          maxLength={9}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono outline-none focus:border-teal-600 sm:col-span-3"
        />
        <input
          value={values.neighborhood}
          onChange={f("neighborhood")}
          placeholder="Bairro *"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 sm:col-span-5"
        />
        <input
          value={values.city}
          onChange={f("city")}
          placeholder="Cidade *"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 sm:col-span-5"
        />
        <input
          value={values.state}
          onChange={f("state")}
          placeholder="UF *"
          maxLength={2}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase outline-none focus:border-teal-600 sm:col-span-2"
        />
      </div>
    </fieldset>
  );
}

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
  const showCancel = canCancel(shipment.status);
  const showFinish = canFinish(shipment.status);
  const terminal = isTerminal(shipment.status);

  if (terminal) {
    return (
      <div className="mt-3 text-sm text-slate-400">
        Esta encomenda está encerrada.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {/* Location input shared for all actions */}
      <div className="flex gap-2">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Local atual (ex: Centro de distribuição SP)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Observação (opcional)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
        />
      </div>

      {/* Normal forward transitions */}
      <div className="flex flex-wrap gap-2">
        {forward.map((status) => (
          <button
            key={status}
            onClick={() => onStatus(shipment.id, status, location, description)}
            className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 hover:bg-teal-100"
          >
            → {getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Problem statuses */}
      {problems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {problems.map((status) => (
            <button
              key={status}
              onClick={() => onStatus(shipment.id, status, location, description)}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100"
            >
              ⚠ {getStatusLabel(status)}
            </button>
          ))}
        </div>
      )}

      {/* Cancel */}
      {showCancel && (
        <button
          onClick={() => onCancel(shipment.id)}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50"
        >
          Cancelar entrega
        </button>
      )}

      {/* Finish delivery */}
      {showFinish && (
        <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Confirmar entrega
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={finishForm.signedName}
              onChange={(e) =>
                setFinishForm({ ...finishForm, signedName: e.target.value })
              }
              placeholder="Nome de quem assinou *"
              className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
            />
            <input
              value={finishForm.deliveryCep}
              onChange={(e) =>
                setFinishForm({ ...finishForm, deliveryCep: e.target.value })
              }
              placeholder="CEP da entrega * (deve ser igual ao destino)"
              className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-teal-600"
            />
            <input
              value={finishForm.phone}
              onChange={(e) =>
                setFinishForm({ ...finishForm, phone: e.target.value })
              }
              placeholder="Telefone (opcional)"
              className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
            />
            <input
              value={finishForm.location}
              onChange={(e) =>
                setFinishForm({ ...finishForm, location: e.target.value })
              }
              placeholder="Local da entrega"
              className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
            />
          </div>
          <button
            onClick={() => onFinish(shipment.id, finishForm)}
            className="w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Confirmar entrega
          </button>
          <p className="text-xs text-emerald-700">
            CEP registrado:{" "}
            <span className="font-mono font-semibold">
              {formatCep(shipment.destinationCep)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    load();
  }, []);

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
      !form.customerId ||
      !form.senderName.trim() ||
      !form.recipientName.trim() ||
      !form.weight ||
      !origin.street ||
      !origin.cep ||
      !origin.city ||
      !origin.state ||
      !origin.number ||
      !origin.neighborhood ||
      !destination.street ||
      !destination.cep ||
      !destination.city ||
      !destination.state ||
      !destination.number ||
      !destination.neighborhood
    ) {
      setError("Preencha todos os campos obrigatórios (marcados com *).");
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
      setSuccess(`Entrega criada: ${created.trackingCode}`);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Entregas</h1>
          <p className="mt-1 text-slate-500">Crie e gerencie encomendas.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800"
        >
          {showForm ? "Fechar" : "+ Nova entrega"}
        </button>
      </div>

      {/* ─ Create form ─ */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          <h2 className="text-lg font-semibold text-slate-800 sm:col-span-2">
            Nova entrega
          </h2>

          {/* Cliente */}
          <select
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 sm:col-span-2"
          >
            <option value="">Selecione o cliente *</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Remetente */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Remetente
            </label>
            <input
              value={form.senderName}
              onChange={(e) => setForm({ ...form, senderName: e.target.value })}
              placeholder="Nome do remetente *"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Origem */}
          <AddressFields
            prefix="origin"
            values={origin}
            onChange={setOrigin}
            label="Endereço de origem"
          />

          {/* Destinatário */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Destinatário
            </label>
            <input
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              placeholder="Nome do destinatário *"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          {/* Destino */}
          <AddressFields
            prefix="destination"
            values={destination}
            onChange={setDestination}
            label="Endereço de destino"
          />

          {/* Peso e Serviço */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Peso (kg) *
            </label>
            <input
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="Ex: 1.5"
              type="number"
              step="0.001"
              min="0.001"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tipo de serviço *
            </label>
            <select
              value={form.serviceType}
              onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
            >
              {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Itens */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Itens da encomenda
              </h3>
              <button
                type="button"
                onClick={() => setItems((c) => [...c, emptyItem()])}
                className="rounded-lg border border-teal-200 bg-white px-3 py-1 text-sm font-medium text-teal-800 hover:bg-teal-50"
              >
                + Item
              </button>
            </div>
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-12"
              >
                <input
                  value={item.name}
                  onChange={(e) => updateItem(idx, "name", e.target.value)}
                  placeholder="Nome do item *"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 sm:col-span-5"
                />
                <input
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  placeholder="Qtd"
                  type="number"
                  min={1}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 sm:col-span-2"
                />
                <input
                  value={item.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  placeholder="Descrição"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 sm:col-span-4"
                />
                <button
                  type="button"
                  onClick={() =>
                    setItems((c) => c.length === 1 ? c : c.filter((_, i) => i !== idx))
                  }
                  disabled={items.length === 1}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-40 sm:col-span-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-teal-700 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60 sm:col-span-2"
          >
            {saving ? "Criando..." : "Criar entrega"}
          </button>
        </form>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* ─ Shipments list ─ */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500">Carregando...</p>
        ) : shipments.length === 0 ? (
          <p className="text-slate-500">Nenhuma entrega cadastrada.</p>
        ) : (
          shipments.map((shipment) => (
            <article
              key={shipment.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-lg font-bold text-slate-900">
                    {shipment.trackingCode}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">De:</span> {shipment.senderName} →{" "}
                    <span className="font-medium">Para:</span> {shipment.recipientName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {shipment.originCity}/{shipment.originState} →{" "}
                    {shipment.destinationCity}/{shipment.destinationState} ·{" "}
                    {shipment.weight} kg · {SERVICE_LABELS[shipment.serviceType] ?? shipment.serviceType}
                  </p>
                  {shipment.estimatedDelivery && (
                    <p className="text-xs text-slate-400">
                      Prazo:{" "}
                      {new Date(shipment.estimatedDelivery).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  {shipment.items && shipment.items.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-xs text-slate-500">
                      {shipment.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity}× {item.name}
                          {item.description ? ` — ${item.description}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(shipment.status)}`}
                  >
                    {getStatusLabel(shipment.status)}
                  </span>
                  <Link
                    href={`/track/${shipment.trackingCode}`}
                    target="_blank"
                    className="text-xs text-teal-700 hover:underline"
                  >
                    Ver rastreio →
                  </Link>
                </div>
              </div>

              <StatusActions
                shipment={shipment}
                onStatus={handleStatus}
                onCancel={handleCancel}
                onFinish={handleFinish}
              />
            </article>
          ))
        )}
      </div>
    </div>
  );
}
