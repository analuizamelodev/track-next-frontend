"use client";

import { FormEvent, useEffect, useState } from "react";
import * as customersService from "@/src/services/customers-service";
import { Customer } from "@/src/types/customers-types";

const emptyForm = {
  name: "",
  email: "",
  document: "",
  phone: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    loadCustomers();
  }, []);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Clientes</h1>
        <p className="mt-2 text-slate-500">
          Cadastre clientes para vincular às entregas.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nome *"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          type="email"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
        />
        <input
          value={form.document}
          onChange={(e) => setForm({ ...form, document: e.target.value })}
          placeholder="Documento"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Telefone"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60 sm:col-span-2"
        >
          {saving ? "Salvando..." : "Cadastrar cliente"}
        </button>
      </form>

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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  Carregando...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  Nenhum cliente cadastrado.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {customer.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {customer.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {customer.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-rose-600 hover:underline"
                    >
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
  );
}
