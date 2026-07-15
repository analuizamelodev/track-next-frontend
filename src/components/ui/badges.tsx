"use client";

import { Clock, Shield, UserCircle } from "lucide-react";
import { UserRole, getRoleLabel } from "@/src/libs/auth";

export function RoleBadge({ role }: { role: number }) {
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

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        active
          ? "border-green-200 bg-green-50 text-[#15803D]"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#16A34A]" : "bg-red-500"}`}
      />
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

export function TempBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Clock className="h-3 w-3" />
      Senha temp.
    </span>
  );
}
