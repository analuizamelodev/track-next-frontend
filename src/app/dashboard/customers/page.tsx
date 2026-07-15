"use client";

import { FormEvent, useEffect, useState } from "react";
import * as customersService from "@/src/services/customers-service";
import { Customer } from "@/src/types/customers-types";
import {
  Plus,
  Trash2,
  Users,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

const emptyForm = { name: "", email: "", document: "", phone: "" };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function loadCustomers() {
    setLoading(true);
    try {
      const data = await customersService.findAll();
      setCustomers(data);
    } catch {
      setError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCustomers(); }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    setSaving(true);
    try {
      await customersService.create({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        document: form.document.trim() || undefined,
        phone: form.phone.trim() || undefined,
      });
      setForm(emptyForm);
      setShowForm(false);
      setSuccess("Cliente cadastrado com sucesso.");
      await loadCustomers();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao cadastrar cliente.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este cliente?")) return;
    try {
      await customersService.remove(id);
      await loadCustomers();
    } catch {
      setError("Não foi possível excluir o cliente.");
    }
  }

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* ── Header ─ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Clientes</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {customers.length} cliente{customers.length !== 1 ? "s" : ""} cadastrado{customers.length !== 1 ? "s" : ""}
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
          <UserPlus className="h-4 w-4" />
          Novo cliente
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
            <h2 className="font-semibold text-[#111827]">Cadastrar cliente</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Nome *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome completo"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Email
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
                type="email"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Documento
              </label>
              <input
                value={form.document}
                onChange={(e) => setForm({ ...form, document: e.target.value })}
                placeholder="CPF ou CNPJ"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Telefone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
                ) : (
                  <><Plus className="h-4 w-4" /> Cadastrar</>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-[#E5E7EB] px-6 py-3 font-semibold text-[#6B7280] transition hover:bg-[#F8FAFC]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Search ─ */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
        />
      </div>

      {/* ── Table ─ */}
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
                      {search ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="transition hover:bg-[#F8FAFC]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-sm font-bold text-[#15803D]">
                          {customer.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#111827]">{customer.name}</span>
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
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
