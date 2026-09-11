"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";


export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    purchase_price: "",
    renovation_cost: "",
    total_investment: "",
    expected_sale_price: "",
    roi_optimistic: "",
    roi_realistic: "",
    roi_pessimistic: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "purchase_price" || name === "renovation_cost") {
        const purchase = Number(name === "purchase_price" ? value : updated.purchase_price) || 0;
        const renovation = Number(name === "renovation_cost" ? value : updated.renovation_cost) || 0;
        updated.total_investment = String(purchase + renovation);
      }

      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/uploads/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // La URL completa para el frontend
        const imageUrl = `http://localhost:8000${res.data.url}`;
        uploadedUrls.push(imageUrl);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      setError("Error al subir una o más imágenes");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

  try {
  const payload = {
    title: form.title,
    description: form.description || undefined,
    location: form.location || undefined,
    address: form.address || undefined,
    purchase_price: form.purchase_price ? Number(form.purchase_price) : undefined,
    renovation_cost: form.renovation_cost ? Number(form.renovation_cost) : undefined,
    total_investment: form.total_investment ? Number(form.total_investment) : undefined,
    expected_sale_price: form.expected_sale_price ? Number(form.expected_sale_price) : undefined,
    roi_optimistic: form.roi_optimistic ? Number(form.roi_optimistic) : undefined,
    roi_realistic: form.roi_realistic ? Number(form.roi_realistic) : undefined,
    roi_pessimistic: form.roi_pessimistic ? Number(form.roi_pessimistic) : undefined,
    images: images.length > 0 ? images : [],
  };

  console.log("Enviando proyecto:", payload); // para depurar

  const res = await api.post("/projects", payload);
  console.log("Respuesta:", res.data);

  router.push("/agent/projects");
} catch (err: unknown) {
  console.error("Error completo:", err);
  if (err && typeof err === "object" && "response" in err) {
    const axiosError = err as { response?: { data?: { detail?: string }; status?: number } };
    console.error("Status:", axiosError.response?.status);
    console.error("Detail:", axiosError.response?.data);
    setError(
      axiosError.response?.data?.detail ||
        `Error ${axiosError.response?.status || ""} al crear el proyecto`
    );
  } else {
    setError("Error al crear el proyecto");
  }
} finally {
  setLoading(false);
}
  };

  return (
    <DashboardLayout role="agent">
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Enviar nuevo proyecto</h1>
          <p className="text-slate-600 mt-1">
            Completa los datos del proyecto para que My Invest lo valore.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          {/* Información general */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Información general
            </h2>

            <Input
              id="title"
              name="title"
              label="Título del proyecto *"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Ej: Reforma piso en Chamberí"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Descripción del inmueble / proyecto
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Describe el piso o propiedad: metros, estado actual, tipo de reforma prevista, zona, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="location"
                name="location"
                label="Ubicación / Ciudad"
                value={form.location}
                onChange={handleChange}
                placeholder="Madrid"
              />
              <Input
                id="address"
                name="address"
                label="Dirección"
                value={form.address}
                onChange={handleChange}
                placeholder="Calle Ejemplo 12"
              />
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Imágenes del proyecto
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Subir imágenes (JPG, PNG, WEBP)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && (
                <p className="text-sm text-blue-600 mt-2">Subiendo imágenes...</p>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((url) => (
                  <div key={url} className="relative group">
                    <img  
                      src={url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Datos financieros */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Datos financieros
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="purchase_price"
                name="purchase_price"
                label="Precio de compra (€)"
                type="number"
                value={form.purchase_price}
                onChange={handleChange}
                placeholder="250000"
              />
              <Input
                id="renovation_cost"
                name="renovation_cost"
                label="Coste de reforma (€)"
                type="number"
                value={form.renovation_cost}
                onChange={handleChange}
                placeholder="45000"
              />
              <Input
                id="total_investment"
                name="total_investment"
                label="Inversión total (€) — calculada automáticamente"
                type="number"
                value={form.total_investment}
                readOnly
                className="bg-slate-50 cursor-not-allowed"
              />
              <Input
                id="expected_sale_price"
                name="expected_sale_price"
                label="Precio de venta esperado (€)"
                type="number"
                value={form.expected_sale_price}
                onChange={handleChange}
                placeholder="380000"
              />
            </div>
          </div>

          {/* ROI */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Escenarios de rentabilidad (ROI %)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                id="roi_optimistic"
                name="roi_optimistic"
                label="Optimista (%)"
                type="number"
                step="0.1"
                value={form.roi_optimistic}
                onChange={handleChange}
                placeholder="25"
              />
              <Input
                id="roi_realistic"
                name="roi_realistic"
                label="Realista (%)"
                type="number"
                step="0.1"
                value={form.roi_realistic}
                onChange={handleChange}
                placeholder="18"
              />
              <Input
                id="roi_pessimistic"
                name="roi_pessimistic"
                label="Pesimista (%)"
                type="number"
                step="0.1"
                value={form.roi_pessimistic}
                onChange={handleChange}
                placeholder="8"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}>
              Enviar proyecto a valoración
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}