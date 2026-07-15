"use client";

import { DashboardSidebar } from "@/src/components/dashboard-sidebar";
import { useRequireAuth } from "@/src/context/auth-context";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isAuthenticated } = useRequireAuth();

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-[#F8FAFC] text-[#6B7280]">
        <Loader2 className="h-5 w-5 animate-spin text-[#16A34A]" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
