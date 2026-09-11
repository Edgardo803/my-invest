"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Project } from "@/types";
import { formatCurrency, formatPercent, statusLabels, phaseLabels } from "@/lib/utils";
import {
  MapPin,
  TrendingUp,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Wallet,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function AgentProjectDetailPage() {
  const params = useParams();
  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setProject(res.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el proyecto");
      } finally {
        setLoading(false);
      }
    }
    if (projectId) loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <DashboardLayout role="agent">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project || error) {
    return (
      <DashboardLayout role="agent">
        <div className="text-center py-20">
          <p className="text-slate-600">{error || "Proyecto no encontrado"}</p>
          <Link href="/agent/projects" className="text-blue-600 mt-4 inline-block">
            ← Volver a Mis Proyectos
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const phases = [
    { key: "funding", label: "Abierto a inversión", icon: Wallet },
    { key: "fully_funded", label: "Financiación completada", icon: CheckCircle2 },
    { key: "purchase", label: "Compra del inmueble", icon: Building2 },
    { key: "renovation", label: "Proceso de reforma", icon: Clock },
    { key: "sale", label: "Comercialización y venta", icon: TrendingUp },
    { key: "completed", label: "Proyecto finalizado", icon: CheckCircle2 },
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.key === project.current_phase);

  const fundingProgress =
    project.total_investment && project.total_investment > 0
      ? (project.total_raised || 0) / project.total_investment
      : 0;

  return (
    <DashboardLayout role="agent">
      <div className="max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/agent/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Mis Proyectos
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-slate-600">
                <MapPin className="h-4 w-4" />
                <span>{project.location || "Ubicación no especificada"}</span>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {statusLabels[project.status] || project.status}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {phaseLabels[project.current_phase] || project.current_phase}
              </span>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        {project.images && project.images.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Imágenes del proyecto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((url: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-video overflow-hidden rounded-xl border border-slate-200"
                >
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Descripción */}
        {project.description && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Descripción del proyecto
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </section>
        )}

        {/* Datos financieros + financiación */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Proyección financiera
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Precio de compra</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {project.purchase_price ? formatCurrency(project.purchase_price) : "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Coste de reforma</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {project.renovation_cost ? formatCurrency(project.renovation_cost) : "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Inversión total</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {project.total_investment ? formatCurrency(project.total_investment) : "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Venta esperada</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {project.expected_sale_price
                  ? formatCurrency(project.expected_sale_price)
                  : "—"}
              </p>
            </div>
          </div>

          {/* Estado de financiación */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
              Estado de financiación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-slate-500">Inversión total necesaria</p>
                <p className="text-lg font-semibold text-slate-900">
                  {project.total_investment
                    ? formatCurrency(project.total_investment)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Ya financiado</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(project.total_raised || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Disponible</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {project.remaining_amount !== null && project.remaining_amount !== undefined
                    ? formatCurrency(project.remaining_amount)
                    : "—"}
                </p>
              </div>
            </div>

            {project.total_investment && project.total_investment > 0 && (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Progreso de financiación</span>
                  <span>
                    {Math.min(100, Math.round(fundingProgress * 100))}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      fundingProgress >= 1 ? "bg-emerald-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(100, fundingProgress * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ROI */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">Optimista</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {project.roi_optimistic ? formatPercent(project.roi_optimistic) : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">Realista</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {project.roi_realistic ? formatPercent(project.roi_realistic) : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Pesimista</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                {project.roi_pessimistic ? formatPercent(project.roi_pessimistic) : "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Timeline de fases */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Cronograma del proyecto
          </h2>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div className="space-y-6">
              {phases.map((phase, index) => {
                let isCompleted = index < currentPhaseIndex;
                let isCurrent = index === currentPhaseIndex;

                if (phase.key === "fully_funded") {
                  isCompleted = fundingProgress >= 1;
                  isCurrent = fundingProgress >= 1 && currentPhaseIndex <= index;
                }
                if (fundingProgress < 1 && index > 1) {
                  isCompleted = false;
                }

                const Icon = phase.icon;

                return (
                  <div key={phase.key} className="relative flex items-start gap-4 pl-10">
                    <div
                      className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : isCurrent
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          isCurrent
                            ? "text-blue-700"
                            : isCompleted
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }`}
                      >
                        {phase.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Fase actual
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}