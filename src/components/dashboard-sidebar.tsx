"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/auth-context";
import { getRoleLabel } from "@/src/libs/auth";
import {
  Package,
  LayoutDashboard,
  Users,
  Truck,
  LogOut,
  ChevronRight,
  UserCircle,
  Settings,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/shipments", label: "Entregas", icon: Truck },
  { href: "/dashboard/customers", label: "Clientes", icon: Users },
  { href: "/dashboard/users", label: "Usuários", icon: UserCircle, adminOnly: true },
  { href: "/dashboard/profile", label: "Meu perfil", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-[#E5E7EB] px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#16A34A]">
          <Package className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-[#111827]">TrackLog</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
          Menu
        </p>
        {links
          .filter((l) => !l.adminOnly || isAdmin)
          .map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-[#DCFCE7] text-[#15803D]"
                      : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
                {active && (
                  <ChevronRight className="ml-auto h-4 w-4 text-[#15803D]" />
                )}
              </Link>
            );
          })}
      </nav>

      {/* User */}
      <div className="border-t border-[#E5E7EB] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0FDF4] text-[#16A34A]">
            <UserCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#111827]">
              {user?.name}
            </p>
            <p className="text-xs text-[#6B7280]">{getRoleLabel(user?.role ?? 0)}</p>
          </div>
          <button
            onClick={logout}
            title="Sair"
            className="rounded-lg p-1.5 text-[#6B7280] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
