"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInvesting(true);

    try {
      await api.post("/investments", {
        project_id: projectId,
        amount: Number(amount),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/investor");
      }, 2000);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        setError(axiosError.response?.data?.detail || "Error al realizar la inversión");
      } else {
        setError("Error al realizar la inversión");
      }
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="investor">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout role="investor">
        <div className="text-center py-20">
          <p className="text-slate-600">Proyecto no encontrado</p>
          <Link href="/investor" className="text-blue-600 mt-4 inline-block">
            ← Volver al dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

    // Fases del proyecto para el timeline
  const phases = [
    { key: "funding", label: "Abierto a inversión", icon: Wallet },
    { key: "fully_funded", label: "Financiación completada", icon: CheckCircle2 },
    { key: "purchase", label: "Compra del inmueble", icon: Building2 },
    { key: "renovation", label: "Proceso de reforma", icon: Clock },
    { key: "sale", label: "Comercialización y venta", icon: TrendingUp },
    { key: "completed", label: "Proyecto finalizado", icon: CheckCircle2 },
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.key === project.current_phase);

  return (
    <DashboardLayout role="investor">
      <div className="max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/investor"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-slate-600">
                <MapPin className="h-4 w-4" />
                <span>{project.location || "Ubicación no especificada"}</span>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {statusLabels[project.status] || project.status}
            </span>
          </div>
        </div>

        {/* Descripción */}
        {project.description && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Descripción del proyecto</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </section>
        )}

        {/* Imágenes del proyecto */}
{project.images && project.images.length > 0 && (
  <section className="bg-white rounded-xl border border-slate-200 p-6">
    <h2 className="text-lg font-semibold text-slate-900 mb-4">
      Imágenes del proyecto
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {project.images.map((url: string, index: number) => (
        <div key={index} className="relative aspect-video overflow-hidden rounded-xl border border-slate-200">
          <img
            src={url}
            alt={`Imagen ${index + 1} del proyecto`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  </section>
)}

        {/* Datos financieros */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Proyección financiera
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <p className="text-sm text-slate-500">Precio de compra</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {project.purchase_price ? formatCurrency(project.purchase_price) : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Coste de reforma</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {project.renovation_cost ? formatCurrency(project.renovation_cost) : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Inversión total</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {project.total_investment ? formatCurrency(project.total_investment) : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Venta esperada</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {project.expected_sale_price ? formatCurrency(project.expected_sale_price) : "—"}
              </p>
            </div>
          </div>

          {/* Estado de financiación */}
{(project.total_investment || project.total_raised !== undefined) && (
  <div className="mt-8 p-5 rounded-xl border border-slate-200 bg-slate-50">
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
        <p className="text-sm text-slate-500">Disponible para invertir</p>
        <p className="text-lg font-semibold text-emerald-600">
          {project.remaining_amount !== null && project.remaining_amount !== undefined
            ? formatCurrency(project.remaining_amount)
            : "—"}
        </p>
      </div>
    </div>

    {/* Barra de progreso */}
    {project.total_investment && project.total_investment > 0 && (
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progreso de financiación</span>
          <span>
            {Math.min(
              100,
              Math.round(((project.total_raised || 0) / project.total_investment) * 100)
            )}
            %
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{
              width: `${Math.min(
                100,
                ((project.total_raised || 0) / project.total_investment) * 100
              )}%`,
            }}
          />
        </div>
      </div>
    )}
  </div>
)}

          {/* Escenarios ROI */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">Escenario Optimista</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {project.roi_optimistic ? formatPercent(project.roi_optimistic) : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">Escenario Realista</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {project.roi_realistic ? formatPercent(project.roi_realistic) : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Escenario Pesimista</p>
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
  const fundingProgress =
    project.total_investment && project.total_investment > 0
      ? (project.total_raised || 0) / project.total_investment
      : 0;

  // Lógica especial para la fase de financiación completada
  let isCompleted = index < currentPhaseIndex;
  let isCurrent = index === currentPhaseIndex;

  if (phase.key === "fully_funded") {
    isCompleted = fundingProgress >= 1;
    isCurrent = fundingProgress >= 1 && currentPhaseIndex <= index;
  }

  // Si aún no está financiado al 100%, no se pueden considerar completadas las fases posteriores
  if (fundingProgress < 1 && index > 1) {
    isCompleted = false;
    if (phase.key !== "funding") {
      isCurrent = phase.key === "funding" ? false : isCurrent && fundingProgress >= 1;
    }
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

        {/* Formulario de inversión */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            Invertir en este proyecto
          </h2>

          {success ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-emerald-800">¡Inversión realizada con éxito!</p>
              <p className="text-sm text-emerald-700 mt-1">Redirigiendo al dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleInvest} className="max-w-md space-y-4">
              <Input
                id="amount"
                label="Importe a invertir (€)"
                type="number"
                min="1000"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 25000"
                required
              />

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" loading={investing} size="lg">
                Confirmar inversión (simulada)
              </Button>

              <p className="text-xs text-slate-500">
                * Esta es una inversión simulada. No se realiza ningún cobro real.
              </p>
            </form>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}