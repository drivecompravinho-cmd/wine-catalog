"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Lock, LogOut, ChevronRight, Wine, ArrowRight } from "lucide-react";
import Image from "next/image";

const ADMIN_KEY = "wine_admin_auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY);
    if (stored) setAuthenticated(true);
    setLoading(false);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
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
      setSubmitting(false);
    }
  }

  if (loading) return null;

  if (!authenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden" style={{ background: "#0A0612" }}>
        {/* Ambient gradient orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, #6B21A8, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-20 w-[450px] h-[450px] rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #A855F7, transparent 70%)" }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #C084FC, transparent 70%)" }} />

        {/* Glass card */}
        <div className="relative z-10 w-full max-w-[380px] mx-4">
          <div className="rounded-3xl p-8" style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative h-9 w-44 mb-1">
                <Image src="/logo-compravinho.svg" alt="COMPRAVINHO" fill className="object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </div>
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.4)" }}>Painel administrativo</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.35)" }} />
                <input
                  type="password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm outline-none transition-all"
                  placeholder="Senha de acesso"
                  autoFocus
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: error ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  onFocus={(e) => { e.target.style.background = "rgba(255,255,255,0.08)"; e.target.style.borderColor = "rgba(168,85,247,0.5)"; }}
                  onBlur={(e) => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.borderColor = error ? "rgba(220,38,38,0.5)" : "rgba(255,255,255,0.1)"; }}
                />
                <button type="submit" disabled={submitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: "linear-gradient(135deg, #A855F7, #6B21A8)" }}>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
              {error && (
                <p className="text-xs text-center" style={{ color: "#f87171" }}>{error}</p>
              )}
            </form>
          </div>
          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.25)" }}>compravinho.com</p>
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
            <Image src="/logo-compravinho.svg" alt="COMPRAVINHO" fill className="object-contain object-left" />
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
