"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/auth-context";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Olá, {user?.name}
        </h1>
        <p className="mt-2 text-slate-500">
          Gerencie clientes e entregas pelo painel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/customers"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300"
        >
          <h2 className="font-semibold text-slate-900">Clientes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Cadastrar e consultar clientes.
          </p>
        </Link>

        <Link
          href="/dashboard/shipments"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300"
        >
          <h2 className="font-semibold text-slate-900">Entregas</h2>
          <p className="mt-1 text-sm text-slate-500">
            Criar, acompanhar e atualizar status.
          </p>
        </Link>

        {isAdmin && (
          <Link
            href="/dashboard/users"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300"
          >
            <h2 className="font-semibold text-slate-900">Usuários</h2>
            <p className="mt-1 text-sm text-slate-500">
              Criar operadores e enviar acesso por e-mail.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
