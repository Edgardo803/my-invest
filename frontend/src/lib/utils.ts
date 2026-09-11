import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export const statusLabels: Record<string, string> = {
  pending_review: "En revisión",
  approved: "Aprobado",
  active: "Activo",
  rejected: "Rechazado",
  completed: "Completado",
};

export const phaseLabels: Record<string, string> = {
  funding: "Abierto a inversión",
  fully_funded: "Financiación completada",
  purchase: "Compra del inmueble",
  renovation: "Proceso de reforma",
  sale: "Comercialización y venta",
  completed: "Proyecto finalizado",
  // por compatibilidad con datos antiguos
  purchase_old: "Compra del inmueble",
};