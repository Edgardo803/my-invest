"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Project } from "@/types";
import { formatCurrency, formatPercent, statusLabels } from "@/lib/utils";
import Link from "next/link";

export default function InvestorProjectsPage() {
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
    <DashboardLayout role="investor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proyectos Disponibles</h1>
          <p className="text-slate-600 mt-1">
            Explora los proyectos abiertos a inversión
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            No hay proyectos disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {project.location || "Sin ubicación"}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {statusLabels[project.status] || project.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Inversión total</p>
                    <p className="font-medium text-slate-900">
                      {project.total_investment
                        ? formatCurrency(project.total_investment)
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">ROI Realista</p>
                    <p className="font-medium text-emerald-600">
                      {project.roi_realistic
                        ? formatPercent(project.roi_realistic)
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-sm">
                 <div className="flex justify-between">
                  <span className="text-slate-500">Disponible</span>
                  <span className="font-medium text-emerald-600">
                    {project.remaining_amount !== null && project.remaining_amount !== undefined
                      ? formatCurrency(project.remaining_amount)
                      : "—"}
                  </span>
                 </div>
                </div>

                <Link
                  href={`/investor/projects/${project.id}`}
                  className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Ver dossier →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}