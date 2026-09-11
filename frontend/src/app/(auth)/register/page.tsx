"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "investor",
    referral_code: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register({
        ...form,
        role: form.role as "investor" | "agent",
        referral_code: form.referral_code || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const axiosError = err as { response?: { data?: { detail?: string } } };
    setError(axiosError.response?.data?.detail || "Error al registrarse");
  } else {
    setError("Error al registrarse");
  }
}finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl border p-8 text-center max-w-md">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-slate-900">¡Registro exitoso!</h2>
          <p className="text-slate-600 mt-2">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Invest</h1>
          <p className="text-slate-600 mt-2">Crea tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="full_name"
              name="full_name"
              label="Nombre completo"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              id="phone"
              name="phone"
              label="Teléfono"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />

            <div>
             <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tipo de cuenta
           </label>
            <select
              name="role"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
           >
            <option value="investor">Inversor</option>
            <option value="agent">Agente Inmobiliario</option>
            </select>
           </div>

            <Input
              id="referral_code"
              name="referral_code"
              label="Código de referido (opcional)"
              value={form.referral_code}
              onChange={handleChange}
              placeholder="Ej: ABC12345"
            />

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Crear cuenta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}