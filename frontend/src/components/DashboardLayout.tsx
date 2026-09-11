"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Users,
  LogOut,
  PlusCircle,
  Calculator,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "investor" | "agent" | "admin";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    if (role === "investor" && currentUser.role !== "investor" && currentUser.role !== "admin") {
      router.push(`/${currentUser.role}`);
    }
    if (role === "agent" && currentUser.role !== "agent" && currentUser.role !== "admin") {
      router.push(`/${currentUser.role}`);
    }
  }, [role, router, setUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const investorLinks = [
    { href: "/investor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/investor/projects", label: "Proyectos", icon: Building2 },
    { href: "/investor/investments", label: "Mis Inversiones", icon: Wallet },
  ];

  const agentLinks = [
    { href: "/agent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agent/projects", label: "Mis Proyectos", icon: Building2 },
    { href: "/agent/new-project", label: "Nuevo Proyecto", icon: PlusCircle },
    { href: "/agent/calculator", label: "Calculadora", icon: Calculator },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Proyectos", icon: Building2 },
    { href: "/admin/users", label: "Usuarios", icon: Users },
  ];

  const links =
    role === "investor" ? investorLinks : role === "agent" ? agentLinks : adminLinks;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="text-lg font-semibold tracking-tight">My Invest</div>
          <p className="text-xs text-slate-400 mt-1 capitalize">{user.role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}