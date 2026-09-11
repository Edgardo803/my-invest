"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Project } from "@/types";
import { formatCurrency, formatPercent, statusLabels, phaseLabels } from "@/lib/utils";
import { Building2, Clock, CheckCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function AgentDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pending = projects.filter((p) => p.status === "pending_review").length;
  const active = projects.filter((p) => ["approved", "active"].includes(p.status)).length;
  const completed = projects.filter((p) => p.status === "completed").length;

  if (loading) {
    return (
      <DashboardLayout role="agent">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="agent">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard del Agente</h1>
            <p className="text-slate-600 mt-1">Gestiona tus proyectos enviados a My Invest</p>
          </div>
          <Link href="/agent/new-project">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">En revisión</p>
                <p className="text-2xl font-bold text-slate-900">{pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Activos</p>
                <p className="text-2xl font-bold text-slate-900">{active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completados</p>
                <p className="text-2xl font-bold text-slate-900">{completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de proyectos */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Mis Proyectos</h2>

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Aún no has enviado proyectos</h3>
              <p className="text-slate-500 mt-1 mb-6">
                Envía tu primer proyecto para que My Invest lo valore.
              </p>
              <Link href="/agent/new-project">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Enviar primer proyecto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Proyecto</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ubicación</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Inversión</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">ROI Realista</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link
                          href={`/agent/projects/${project.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{project.location || "—"}</td>
                      <td className="px-5 py-4 text-sm text-slate-900">
                        {project.total_investment ? formatCurrency(project.total_investment) : "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-emerald-600">
                        {project.roi_realistic ? formatPercent(project.roi_realistic) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {statusLabels[project.status] || project.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {phaseLabels[project.current_phase] || project.current_phase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
