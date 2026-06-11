"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Lock, LogOut, ChevronRight, Wine } from "lucide-react";
import Image from "next/image";

const ADMIN_KEY = "wine_admin_auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY);
    if (stored) setAuthenticated(true);
    setLoading(false);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem(ADMIN_KEY, "1");
      setAuthenticated(true);
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  }

  if (loading) return null;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex" style={{ background: "var(--surface-2)" }}>
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
          style={{ background: "linear-gradient(135deg, #1A0A2E 0%, #3B0764 60%, #6B21A8 100%)" }}>
          <div className="relative h-12 w-64">
            <Image src="/logo-compravinho.png" alt="COMPRAVINHO" fill className="object-contain object-left" />
          </div>
          <div>
            <p className="text-white/90 text-2xl font-display font-semibold leading-snug mb-3">
              Gerencie seus catálogos<br />de vinho com facilidade.
            </p>
            <p className="text-white/50 text-sm">Plataforma exclusiva para vinotecas parceiras.</p>
          </div>
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} compravinho.com</p>
        </div>

        {/* Right panel - login */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 flex justify-center">
              <div className="relative h-10 w-48">
                <Image src="/logo-compravinho.png" alt="COMPRAVINHO" fill className="object-contain" />
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text-1)" }}>Painel Admin</h1>
              <p className="text-sm" style={{ color: "var(--text-2)" }}>Entre com sua senha de administrador</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-3)" }} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="input pl-9" placeholder="••••••••" autoFocus />
                </div>
              </div>
              {error && (
                <div className="text-xs px-3 py-2.5 rounded-xl flex items-center gap-2"
                  style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
                  <span>⚠</span> {error}
                </div>
              )}
              <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
                Entrar no painel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const nav = [
    { href: "/admin/lojas", label: "Vinotecas", icon: Store, desc: "Clientes e catálogos" },
    { href: "/admin/vinhos", label: "Rótulos", icon: Wine, desc: "Banco de vinhos" },
  ];

  const activeNav = nav.find((n) => pathname.startsWith(n.href));

  return (
    <div className="min-h-screen flex" style={{ background: "var(--surface-2)" }}>
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="relative h-8 w-40">
            <Image src="/logo-compravinho.png" alt="COMPRAVINHO" fill className="object-contain object-left" />
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                style={{ background: active ? "var(--brand-muted)" : "transparent", color: active ? "var(--brand)" : "var(--text-2)" }}>
                <Icon className="w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{label}</p>
                  <p className="text-xs truncate" style={{ color: active ? "var(--brand)" : "var(--text-3)", opacity: 0.8 }}>{desc}</p>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthenticated(false); }}
            className="btn-ghost w-full justify-start text-xs">
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-4 shrink-0 flex items-center"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
          <div>
            <h1 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{activeNav?.label ?? "Admin"}</h1>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>{activeNav?.desc}</p>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
