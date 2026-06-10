"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wine, Store, Lock, LogOut, ChevronRight } from "lucide-react";

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
      setError("Senha incorreta.");
    }
  }

  if (loading) return null;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f8f7f8 0%, #f0ecf3 100%)" }}>
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--burgundy)" }}>
                <Wine className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-semibold" style={{ color: "var(--text-1)" }}>COMPRAVINHO</span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Painel administrativo</p>
          </div>

          <div className="card p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Senha de acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-3)" }} />
                  <input
                    type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-9" placeholder="••••••••" autoFocus
                  />
                </div>
              </div>
              {error && (
                <div className="text-xs px-3 py-2 rounded-lg" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                  {error}
                </div>
              )}
              <button type="submit" className="btn-primary w-full justify-center py-2.5">
                Entrar
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

  const activeNav = nav.find(n => pathname.startsWith(n.href));

  return (
    <div className="min-h-screen flex" style={{ background: "var(--surface-2)" }}>
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
        {/* Brand */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--burgundy)" }}>
              <Wine className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight" style={{ color: "var(--text-1)" }}>COMPRAVINHO</p>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                style={{
                  background: active ? "var(--burgundy-muted)" : "transparent",
                  color: active ? "var(--burgundy)" : "var(--text-2)",
                }}>
                <Icon className="w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{label}</p>
                  <p className="text-xs truncate" style={{ color: active ? "var(--burgundy)" : "var(--text-3)", opacity: 0.8 }}>{desc}</p>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthenticated(false); }}
            className="btn-ghost w-full justify-start text-xs">
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="px-8 py-4 flex items-center gap-3 shrink-0" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
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
