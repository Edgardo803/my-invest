"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Project } from "@/types";
import { formatCurrency, formatPercent, statusLabels, phaseLabels } from "@/lib/utils";
import Button from "@/components/ui/Button";

const PHASE_ORDER = [
  "funding",
  "fully_funded",
  "purchase",
  "renovation",
  "sale",
  "completed",
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const fetchData = async () => {
    await loadProjects();
  };
  fetchData();
}, []);

  const changeStatus = async (projectId: number, status: string) => {
    setUpdatingId(projectId);
    try {
      await api.patch(`/projects/${projectId}`, { status });
      await loadProjects();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

 const advancePhase = async (projectId: number, currentPhase: string, fundingProgress: number) => {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex >= PHASE_ORDER.length - 1) return;

  const nextPhase = PHASE_ORDER[currentIndex + 1];

  // No permitir pasar a compra (ni posteriores) si no está 100% financiado
  if (nextPhase !== "funding" && nextPhase !== "fully_funded" && fundingProgress < 1) {
    alert("No se puede avanzar a esta fase hasta que el proyecto esté 100% financiado.");
    return;
  }

  setUpdatingId(projectId);

  try {
    await api.patch(`/projects/${projectId}`, {
      current_phase: nextPhase,
      ...(nextPhase === "completed" ? { status: "completed" } : {}),
    });
    await loadProjects();
  } catch (err) {
    console.error(err);
    alert("Error al avanzar la fase");
  } finally {
    setUpdatingId(null);
  }
};

  const getNextPhaseLabel = (currentPhase: string) => {
    const currentIndex = PHASE_ORDER.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex >= PHASE_ORDER.length - 1) return null;
    return phaseLabels[PHASE_ORDER[currentIndex + 1]] || PHASE_ORDER[currentIndex + 1];
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Proyectos</h1>
          <p className="text-slate-600 mt-1">
            Aprueba proyectos y avanza sus fases de forma clara
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            No hay proyectos todavía.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const progress =
                project.total_investment && project.total_investment > 0
                  ? Math.min(
                      100,
                      Math.round(
                        ((project.total_raised || 0) / project.total_investment) * 100
                      )
                    )
                  : 0;

              const nextPhaseLabel = getNextPhaseLabel(project.current_phase);
              const isFullyFunded = progress >= 100;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {project.location || "Sin ubicación"}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {statusLabels[project.status] || project.status}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {phaseLabels[project.current_phase] || project.current_phase}
                          </span>
                        </div>
                      </div>

                      {/* Datos financieros */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Inversión total</p>
                          <p className="font-medium text-slate-900">
                            {project.total_investment
                              ? formatCurrency(project.total_investment)
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Ya financiado</p>
                          <p className="font-medium text-blue-600">
                            {formatCurrency(project.total_raised || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Disponible</p>
                          <p className="font-medium text-emerald-600">
                            {project.remaining_amount !== null &&
                            project.remaining_amount !== undefined
                              ? formatCurrency(project.remaining_amount)
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">ROI Realista</p>
                          <p className="font-medium text-slate-900">
                            {project.roi_realistic
                              ? formatPercent(project.roi_realistic)
                              : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      {project.total_investment && project.total_investment > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Progreso de financiación</span>
                            <span className={isFullyFunded ? "text-emerald-600 font-medium" : ""}>
                              {progress}% {isFullyFunded && "✓ Completado"}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isFullyFunded ? "bg-emerald-500" : "bg-blue-600"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end min-w-[160px]">
                      {project.status === "pending_review" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => changeStatus(project.id, "approved")}
                            loading={updatingId === project.id}
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => changeStatus(project.id, "rejected")}
                            loading={updatingId === project.id}
                          >
                            Rechazar
                          </Button>
                        </>
                      )}

                      {project.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => changeStatus(project.id, "active")}
                          loading={updatingId === project.id}
                        >
                          Activar (abrir a inversión)
                        </Button>
                      )}

                      {/* Avanzar fase */}
                      {project.status === "active" && nextPhaseLabel && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => advancePhase(project.id, project.current_phase, progress / 100)}
                          loading={updatingId === project.id}
                        >
                          → {nextPhaseLabel}
                        </Button>
                      )}

                      {project.status === "completed" && (
                        <span className="text-xs text-emerald-600 font-medium">
                          ✓ Proyecto finalizado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}