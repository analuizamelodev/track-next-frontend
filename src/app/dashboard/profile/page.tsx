"use client";

import { useAuth, useRequireAuth } from "@/src/context/auth-context";
import { RoleBadge } from "@/src/components/ui/badges";
import { PasswordForm } from "@/src/components/profile/password-form";
import { EmailForm } from "@/src/components/profile/email-form";

export default function ProfilePage() {
  useRequireAuth();
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Meu perfil</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Gerencie suas informações de acesso.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCFCE7] text-2xl font-bold text-[#15803D]">
            {user.name[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold text-[#111827]">{user.name}</p>
            <p className="text-sm text-[#6B7280]">{user.email}</p>
            <div className="mt-1.5">
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${isAdmin ? "lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        <PasswordForm />
        {isAdmin && (
          <EmailForm currentEmail={user.email} userId={user.id} />
        )}
      </div>
      {!isAdmin && (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-5 py-4 text-sm text-[#6B7280]">
          Para alterar seu email, entre em contato com o administrador do
          sistema.
        </div>
      )}
    </div>
  );
}
