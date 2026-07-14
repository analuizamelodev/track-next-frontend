"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRequireAuth } from "@/src/context/auth-context";
import { UserRole, getRoleLabel } from "@/src/libs/auth";
import * as usersService from "@/src/services/users-service";
import { User } from "@/src/types/users-types";

const emptyForm = {
  name: "",
  email: "",
  role: String(UserRole.OPERATOR),
};

export default function UsersPage() {
  const { loading: authLoading } = useRequireAuth(true);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await usersService.findAll();
      setUsers(data);
    } catch {
      setError("Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading) {
      loadUsers();
    }
  }, [authLoading]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Informe nome e email.");
      return;
    }

    setSaving(true);
    try {
      const response = await usersService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        role: Number(form.role) as UserRole,
      });
      setForm(emptyForm);
      setSuccess(
        `${response.message} O usuário receberá a senha por e-mail.`,
      );
      await loadUsers();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao criar usuário.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(user: User) {
    try {
      await usersService.update(user.id, { active: !user.active });
      await loadUsers();
    } catch {
      setError("Não foi possível atualizar o usuário.");
    }
  }

  async function handleResetPassword(id: string) {
    if (!confirm("Enviar nova senha por e-mail?")) return;
    try {
      const response = await usersService.resetPassword(id);
      setSuccess(response.message);
    } catch {
      setError("Não foi possível redefinir a senha.");
    }
  }

  if (authLoading) {
    return <p className="text-slate-500">Carregando...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Usuários</h1>
        <p className="mt-2 text-slate-500">
          Apenas admin. O operador recebe acesso por e-mail (sem auto-cadastro).
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nome"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          type="email"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
        >
          <option value={UserRole.OPERATOR}>Operador</option>
          <option value={UserRole.ADMIN}>Admin</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {saving ? "Criando..." : "Criar e enviar acesso"}
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
              <th className="px-4 py-3 font-medium">Perfil</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-500">
                  Carregando...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {getRoleLabel(user.role)}
                  </td>
                  <td className="px-4 py-3">
                    {user.active ? (
                      <span className="text-emerald-700">Ativo</span>
                    ) : (
                      <span className="text-rose-700">Inativo</span>
                    )}
                  </td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() => toggleActive(user)}
                      className="text-slate-700 hover:underline"
                    >
                      {user.active ? "Desativar" : "Ativar"}
                    </button>
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="text-teal-700 hover:underline"
                    >
                      Reset senha
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
