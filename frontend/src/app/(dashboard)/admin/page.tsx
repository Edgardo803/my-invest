"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { Building2, Users, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
          <p className="text-slate-600 mt-1">
            Bienvenido, {user?.full_name || "Administrador"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/admin/projects"
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Proyectos</p>
                <p className="text-lg font-semibold text-slate-900">Gestionar</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-violet-50">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Usuarios</p>
                <p className="text-lg font-semibold text-slate-900">Ver lista</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pendientes</p>
                <p className="text-lg font-semibold text-slate-900">Revisión</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Sistema</p>
                <p className="text-lg font-semibold text-slate-900">Operativo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Acciones rápidas
          </h2>
          <p className="text-slate-600 text-sm mb-4">
            Desde aquí puedes gestionar los proyectos enviados por los agentes y ver los usuarios registrados.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/projects"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Ir a Proyectos
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Ver Usuarios
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}