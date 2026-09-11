"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Project } from "@/types";
import { formatCurrency, formatPercent, statusLabels, phaseLabels } from "@/lib/utils";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";

export default function AgentProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mis Proyectos</h1>
            <p className="text-slate-600 mt-1">
              Proyectos que has enviado a My Invest
            </p>
          </div>
          <Link href="/agent/new-project">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500 mb-4">Aún no has enviado ningún proyecto.</p>
            <Link href="/agent/new-project">
              <Button>Enviar primer proyecto</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Proyecto
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Ubicación
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Inversión
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    ROI Realista
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Fase
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
  <Link
    href={`/agent/projects/${project.id}`}
    className="text-blue-600 hover:text-blue-700 hover:underline"
  >
    {project.title}
  </Link>
</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {project.location || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-900">
                      {project.total_investment
                        ? formatCurrency(project.total_investment)
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-emerald-600">
                      {project.roi_realistic
                        ? formatPercent(project.roi_realistic)
                        : "—"}
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
      </div>
    </DashboardLayout>
  );
}