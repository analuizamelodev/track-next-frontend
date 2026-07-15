"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useRequireAuth } from "@/src/context/auth-context";
import { useUsers } from "@/src/queries/users.queries";
import { User } from "@/src/types/users-types";
import { CreateUserForm } from "@/src/components/users/create-user-form";
import { EditUserDialog } from "@/src/components/users/edit-user-dialog";
import { UsersTable } from "@/src/components/users/users-table";
import { onMutationError } from "@/src/libs/toast";
import { useEffect } from "react";

export default function UsersPage() {
  const { loading: authLoading } = useRequireAuth(true);
  const { data: users = [], isLoading, isError, error } = useUsers(!authLoading);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    if (isError) onMutationError("Não foi possível carregar os usuários.")(error);
  }, [isError, error]);

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
      {editUser && (
        <EditUserDialog user={editUser} onClose={() => setEditUser(null)} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Usuários</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Somente administradores podem criar e gerenciar usuários.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2.5 font-semibold text-white transition hover:bg-[#15803D] active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          Novo usuário
        </button>
      </div>

      {showForm && (
        <CreateUserForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <UsersTable
        users={users}
        loading={isLoading}
        onEdit={setEditUser}
      />
    </div>
  );
}
