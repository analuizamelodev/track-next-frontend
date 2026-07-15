"use client";

import { useAuth } from "@/src/context/auth-context";
import { Bell, LogOut } from "lucide-react";

export function DashboardTopbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
      <div>
        {title && (
          <h1 className="text-lg font-semibold text-[#111827]">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-xl p-2 text-[#6B7280] transition hover:bg-[#F8FAFC] hover:text-[#111827]">
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCFCE7] text-sm font-bold text-[#16A34A]">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <span className="text-sm font-medium text-[#111827]">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-3 py-1.5 text-sm font-medium text-[#6B7280] transition hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </header>
  );
}
