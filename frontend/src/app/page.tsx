import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">My Invest</div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-medium transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 mb-6">
              Plataforma de inversión inmobiliaria
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Invierte en inmobiliario de forma{" "}
              <span className="text-blue-400">segura y transparente</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              My Invest conecta inversores y agentes inmobiliarios para participar
              en proyectos de reforma y reventa con total transparencia,
              seguimiento de fases y rentabilidad clara.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
              >
                Empezar ahora
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-white/15 hover:bg-white/5 px-6 py-3.5 text-sm font-semibold transition-colors"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Para Inversores",
                desc: "Accede a proyectos seleccionados, sigue cada fase y controla tu rentabilidad en tiempo real.",
              },
              {
                title: "Para Agentes",
                desc: "Envía proyectos, recibe valoración profesional y colabora con una red de inversores cualificados.",
              },
              {
                title: "Total Transparencia",
                desc: "Dossiers completos, actualizaciones de fase, documentos y proyecciones financieras claras.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/[0.07] transition-colors"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} My Invest · Plataforma de inversión inmobiliaria
        </div>
      </footer>
    </div>
  );
}