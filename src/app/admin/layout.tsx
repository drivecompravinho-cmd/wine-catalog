"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wine, Store, Lock } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="card p-8 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <Wine className="w-6 h-6 text-wine-800" />
            <span className="font-display text-xl font-semibold text-stone-900">Painel Admin</span>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Senha de acesso</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-9"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" className="btn-wine w-full">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  const nav = [
    { href: "/admin/lojas", label: "Lojas", icon: Store },
    { href: "/admin/vinhos", label: "Vinhos / Rótulos", icon: Wine },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-stone-900 text-stone-100 flex flex-col py-6 px-4 gap-1 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Wine className="w-5 h-5 text-wine-400" />
          <span className="font-display text-lg font-semibold">Adega Pro</span>
        </div>
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${pathname.startsWith(href) ? "bg-wine-800 text-white" : "text-stone-400 hover:bg-stone-800 hover:text-white"}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
        <div className="mt-auto">
          <button
            onClick={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthenticated(false); }}
            className="text-stone-500 hover:text-stone-300 text-xs px-3 py-2 w-full text-left transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
