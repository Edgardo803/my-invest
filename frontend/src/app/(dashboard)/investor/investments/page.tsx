"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Investment } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function InvestorInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvestments() {
      try {
        const res = await api.get("/investments/me");
        setInvestments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInvestments();
  }, []);

  return (
    <DashboardLayout role="investor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Inversiones</h1>
          <p className="text-slate-600 mt-1">
            Historial completo de tus inversiones realizadas
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : investments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500 mb-4">Aún no has realizado ninguna inversión.</p>
            <Link
              href="/investor"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver proyectos disponibles →
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
                    Importe invertido
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Retorno estimado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {investments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      <Link
                        href={`/investor/projects/${inv.project_id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Proyecto #{inv.project_id}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-900">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-emerald-600 font-medium">
                      {inv.expected_return
                        ? formatCurrency(inv.expected_return)
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {inv.created_at
                        ? new Date(inv.created_at).toLocaleDateString("es-ES")
                        : "—"}
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