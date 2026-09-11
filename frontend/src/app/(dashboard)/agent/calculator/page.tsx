"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Input from "@/components/ui/Input";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Calculator, TrendingUp, Wallet, PiggyBank } from "lucide-react";

export default function AgentCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [renovationCost, setRenovationCost] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  const [expectedSale, setExpectedSale] = useState("");
  const [months, setMonths] = useState("12");

  const calc = useMemo(() => {
    const purchase = Number(purchasePrice) || 0;
    const renovation = Number(renovationCost) || 0;
    const others = Number(otherCosts) || 0;
    const sale = Number(expectedSale) || 0;
    const duration = Number(months) || 12;

    const totalInvestment = purchase + renovation + others;
    const profit = sale - totalInvestment;
    const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
    const monthlyRoi = duration > 0 ? roi / duration : 0;
    const annualizedRoi = duration > 0 ? (roi / duration) * 12 : 0;

    return {
      totalInvestment,
      profit,
      roi,
      monthlyRoi,
      annualizedRoi,
      isPositive: profit >= 0,
      expectedSale: sale,
    };
  }, [purchasePrice, renovationCost, otherCosts, expectedSale, months]);

  return (
    <DashboardLayout role="agent">
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Calculadora de rentabilidades
          </h1>
          <p className="text-slate-600 mt-1">
            Estima la rentabilidad de un proyecto de compra + reforma + reventa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Datos del proyecto
            </h2>

            <Input
              id="purchase"
              label="Precio de compra (€)"
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="250000"
            />
            <Input
              id="renovation"
              label="Coste de reforma (€)"
              type="number"
              value={renovationCost}
              onChange={(e) => setRenovationCost(e.target.value)}
              placeholder="45000"
            />
            <Input
              id="others"
              label="Otros costes (€)"
              type="number"
              value={otherCosts}
              onChange={(e) => setOtherCosts(e.target.value)}
              placeholder="Impuestos, notaría, etc."
            />
            <Input
              id="sale"
              label="Precio de venta esperado (€)"
              type="number"
              value={expectedSale}
              onChange={(e) => setExpectedSale(e.target.value)}
              placeholder="380000"
            />
            <Input
              id="months"
              label="Plazo estimado (meses)"
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="12"
            />
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Wallet className="h-4 w-4" />
                  Inversión total
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(calc.totalInvestment)}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <PiggyBank className="h-4 w-4" />
                  Beneficio estimado
                </div>
                <p
                  className={`text-2xl font-bold ${
                    calc.isPositive ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(calc.profit)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">Rentabilidad</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-center">
                  <p className="text-sm text-blue-700 mb-1">ROI total</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {formatPercent(calc.roi)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
                  <p className="text-sm text-slate-600 mb-1">ROI mensual</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatPercent(calc.monthlyRoi)}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-center">
                  <p className="text-sm text-emerald-700 mb-1">ROI anualizado</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    {formatPercent(calc.annualizedRoi)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-sm text-slate-500">
                <p>
                  <strong>Fórmula:</strong> ROI = (Venta − Inversión total) / Inversión total × 100
                </p>
                <p className="mt-1">
                  Inversión total = Compra + Reforma + Otros costes
                </p>
              </div>
            </div>

            {/* Resumen rápido */}
            {calc.totalInvestment > 0 && calc.expectedSale !== 0 && (
              <div
                className={`rounded-xl p-4 text-sm ${
                  calc.isPositive
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {calc.isPositive ? (
                  <p>
                    Con una inversión de <strong>{formatCurrency(calc.totalInvestment)}</strong> y
                    una venta de <strong>{formatCurrency(Number(expectedSale) || 0)}</strong>,
                    el beneficio estimado es de <strong>{formatCurrency(calc.profit)}</strong>{" "}
                    ({formatPercent(calc.roi)} de rentabilidad).
                  </p>
                ) : (
                  <p>
                    Con los datos actuales el proyecto generaría pérdidas.
                    Revisa el precio de venta o los costes.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}