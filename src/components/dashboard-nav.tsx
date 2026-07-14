"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/auth-context";
import { getRoleLabel } from "@/src/libs/auth";

const links = [
  { href: "/dashboard", label: "Início" },
  { href: "/dashboard/customers", label: "Clientes" },
  { href: "/dashboard/shipments", label: "Entregas" },
  { href: "/dashboard/users", label: "Usuários", adminOnly: true },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-slate-900">
            Track System
          </Link>
          <nav className="flex flex-wrap gap-1">
            {links
              .filter((link) => !link.adminOnly || isAdmin)
              .map((link) => {
                const active =
                  link.href === "/dashboard"
                    ? pathname === link.href
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                      active
                        ? "bg-teal-50 text-teal-800"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="text-slate-600">
            <span className="font-medium text-slate-900">{user?.name}</span>
            <span className="mx-2 text-slate-300">·</span>
            {getRoleLabel(user?.role ?? 0)}
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
