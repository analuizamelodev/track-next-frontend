"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRequireAuth } from "@/src/context/auth-context";
import { UserRole, getRoleLabel } from "@/src/libs/auth";
import * as usersService from "@/src/services/users-service";
import { User } from "@/src/types/users-types";
import {
  UserPlus,
  UserX,
  UserCheck,
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  UserCircle,
} from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  role: String(UserRole.OPERATOR),
};

function RoleBadge({ role }: { role: number }) {
  const isAdmin = role === UserRole.ADMIN;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isAdmin
          ? "border-purple-200 bg-purple-50 text-purple-700"
          : "border-blue-200 bg-blue-50 text-blue-700"
      }`}
    >
      {isAdmin ? (
        <Shield className="h-3 w-3" />
      ) : (
        <UserCircle className="h-3 w-3" />
      )}
      {getRoleLabel(role)}
    </span>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        active
          ? "border-green-200 bg-green-50 text-[#15803D]"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#16A34A]" : "bg-red-500"}`} />
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

export default function UsersPage() {
  const { loading: authLoading } = useRequireAuth(true);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
    if (!authLoading) loadUsers();
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
      setShowForm(false);
      setSuccess(`${response.message} O usuário receberá a senha por e-mail.`);
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
    if (!confirm("Enviar nova senha por e-mail para este usuário?")) return;
    try {
      const response = await usersService.resetPassword(id);
      setSuccess(response.message);
    } catch {
      setError("Não foi possível redefinir a senha.");
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center gap-3 text-[#6B7280]">
        <Loader2 className="h-4 w-4 animate-spin text-[#16A34A]" />
        Verificando permissões...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Usuários</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Somente administradores podem criar novos usuários.
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
          Novo usuário
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
            <h2 className="font-semibold text-[#111827]">Criar novo usuário</h2>
            <p className="mt-0.5 text-sm text-[#6B7280]">
              Um e-mail com a senha temporária será enviado automaticamente.
            </p>
          </div>
          <form onSubmit={handleCreate} className="grid gap-4 p-6 sm:grid-cols-2">
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
                Email *
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@empresa.com"
                type="email"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Perfil
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[#111827] outline-none transition focus:border-[#16A34A]"
              >
                <option value={UserRole.OPERATOR}>Operador</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>
            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Criando...</>
                ) : (
                  <><UserPlus className="h-4 w-4" /> Criar e enviar acesso</>
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

      {/* ── Table ─ */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  Usuário
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  Perfil
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  Status
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
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-[#F8FAFC]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-sm font-bold text-[#15803D]">
                          {user.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#111827]">{user.name}</p>
                          <p className="text-xs text-[#6B7280]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-4">
                      <ActiveBadge active={user.active} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(user)}
                          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                            user.active
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-green-200 text-[#15803D] hover:bg-green-50"
                          }`}
                        >
                          {user.active ? (
                            <><UserX className="h-3.5 w-3.5" /> Desativar</>
                          ) : (
                            <><UserCheck className="h-3.5 w-3.5" /> Ativar</>
                          )}
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280] transition hover:border-[#16A34A] hover:text-[#16A34A]"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          Reset senha
                        </button>
                      </div>
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
