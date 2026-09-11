"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { User } from "@/types";
import Button from "@/components/ui/Button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.get("/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="text-slate-600 mt-1">
            Lista de todos los usuarios registrados en la plataforma
          </p>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            No hay usuarios registrados todavía.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Teléfono
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Rol
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Verificado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      {user.full_name}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {user.phone || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "agent"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {user.is_verified ? "✅ Sí" : "❌ No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}