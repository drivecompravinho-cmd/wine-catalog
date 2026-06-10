"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Search, Plus, Trash2, Check, Wine, LogOut, Save, X } from "lucide-react";

interface VinhoDB {
  id: string;
  nome: string;
  produtor: string;
  uva: string;
  pais: string;
}

interface ItemLinha {
  id: string;
  vinho_id: string;
  nome: string;
  produtor: string;
  uva: string;
  pais: string;
  preco: string;
  estoque: number;
  ativo: boolean;
  dirty: boolean;
}

interface LojaInfo {
  nome: string;
  logo_url: string | null;
  cor_realce: string;
}

export default function MinhaLojaPage() {
  const { slug } = useParams<{ slug: string }>();
  const [authed, setAuthed] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [loja, setLoja] = useState<LojaInfo | null>(null);
  const [itens, setItens] = useState<ItemLinha[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [showBusca, setShowBusca] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [resultados, setResultados] = useState<VinhoDB[]>([]);
  const [buscando, setBuscando] = useState(false);
  const buscaRef = useRef<HTMLInputElement>(null);
  const filtroRef = useRef<HTMLInputElement>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/minha-loja/${slug}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });
    if (res.ok) {
      const data = await res.json();
      setLoja(data.loja);
      setAuthed(true);
    } else {
      setSenhaErro("Senha incorreta.");
    }
  }

  const fetchItens = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/minha-loja/${slug}/itens`);
    const data = await res.json();
    setItens(data.map((i: Omit<ItemLinha, "dirty">) => ({ ...i, dirty: false })));
    setLoading(false);
  }, [slug]);

  useEffect(() => { if (authed) fetchItens(); }, [authed, fetchItens]);

  // Busca de rótulos no modal com debounce
  useEffect(() => {
    if (!busca.trim()) { setResultados([]); return; }
    const t = setTimeout(async () => {
      setBuscando(true);
      const res = await fetch(`/api/admin/vinhos?q=${encodeURIComponent(busca)}`);
      const data = await res.json();
      const jaAdicionados = new Set(itens.map((i) => i.vinho_id));
      setResultados(data.filter((v: VinhoDB) => !jaAdicionados.has(v.id)));
      setBuscando(false);
    }, 300);
    return () => clearTimeout(t);
  }, [busca, itens]);

  useEffect(() => {
    if (showBusca) setTimeout(() => buscaRef.current?.focus(), 100);
  }, [showBusca]);

  async function adicionarVinho(vinho: VinhoDB) {
    const res = await fetch(`/api/minha-loja/${slug}/itens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vinho_id: vinho.id, preco: "", estoque: 0, ativo: true }),
    });
    const novo = await res.json();
    setItens((prev) => [...prev, { ...vinho, id: novo.id, vinho_id: vinho.id, preco: "", estoque: 0, ativo: true, dirty: false }]);
    setBusca("");
    setResultados([]);
    setShowBusca(false);
  }

  function updateItem(id: string, field: string, value: string | number | boolean) {
    setItens((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value, dirty: true } : item));
  }

  async function saveItem(item: ItemLinha) {
    setSaving(item.id);
    await fetch(`/api/minha-loja/${slug}/itens/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preco: item.preco, estoque: item.estoque, ativo: item.ativo }),
    });
    setItens((prev) => prev.map((i) => i.id === item.id ? { ...i, dirty: false } : i));
    setSaving(null);
    setSaved(item.id);
    setTimeout(() => setSaved(null), 2000);
  }

  async function removeItem(id: string) {
    if (!confirm("Remover este vinho do catálogo?")) return;
    await fetch(`/api/minha-loja/${slug}/itens/${id}`, { method: "DELETE" });
    setItens((prev) => prev.filter((i) => i.id !== id));
  }

  const cor = loja?.cor_realce || "#6B1F3A";

  // Filtra + ordena alfabeticamente
  const itensFiltrados = itens
    .filter((item) =>
      !filtro.trim() ||
      item.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      item.produtor.toLowerCase().includes(filtro.toLowerCase()) ||
      item.uva.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#6B1F3A" }}>
                <Wine className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-semibold" style={{ color: "var(--text-1)" }}>COMPRAVINHO</span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Gestão do catálogo</p>
          </div>
          <div className="card p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Senha de acesso</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
                  className="input" placeholder="••••••••" autoFocus />
              </div>
              {senhaErro && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#fef2f2", color: "#b91c1c" }}>{senhaErro}</p>}
              <button type="submit" className="w-full py-2.5 rounded-xl text-white font-medium text-sm"
                style={{ background: "#6B1F3A" }}>
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-2)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          {loja?.logo_url ? (
            <img src={loja.logo_url} alt={loja.nome} className="w-8 h-8 object-contain rounded-lg" />
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              style={{ background: cor }}>{loja?.nome[0]}</div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-sm leading-tight" style={{ color: "var(--text-1)" }}>{loja?.nome}</p>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>Gestão do catálogo</p>
          </div>
          <a href={`/catalogo/${slug}`} target="_blank"
            className="text-xs px-3 py-1.5 rounded-xl transition-colors"
            style={{ border: "1.5px solid var(--border)", color: "var(--text-2)" }}>
            Ver catálogo
          </a>
          <button onClick={() => setAuthed(false)} className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--text-3)" }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="h-0.5" style={{ background: cor }} />
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {/* Busca na lista */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-3)" }} />
            <input
              ref={filtroRef}
              className="input pl-9"
              placeholder="Buscar no catálogo..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            {filtro && (
              <button onClick={() => setFiltro("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5" style={{ color: "var(--text-3)" }} />
              </button>
            )}
          </div>
          <p className="text-xs shrink-0" style={{ color: "var(--text-3)" }}>
            {itensFiltrados.length} de {itens.length} vinho{itens.length !== 1 ? "s" : ""}
          </p>
          <button onClick={() => setShowBusca(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shrink-0"
            style={{ background: cor }}>
            <Plus className="w-4 h-4" /> Adicionar vinho
          </button>
        </div>

        {/* Modal busca de rótulos */}
        {showBusca && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) { setShowBusca(false); setBusca(""); } }}>
            <div className="w-full max-w-md overflow-hidden rounded-2xl" style={{ background: "var(--surface)", boxShadow: "var(--shadow-lg)" }}>
              <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-3)" }} />
                  <input ref={buscaRef} className="input pl-9"
                    placeholder="Digite o nome do vinho..."
                    value={busca} onChange={(e) => setBusca(e.target.value)} />
                  {busca && (
                    <button onClick={() => setBusca("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-3.5 h-3.5" style={{ color: "var(--text-3)" }} />
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {buscando && <p className="text-xs text-center py-5" style={{ color: "var(--text-3)" }}>Buscando...</p>}
                {!buscando && !busca && <p className="text-xs text-center py-8" style={{ color: "var(--text-3)" }}>Digite para buscar rótulos disponíveis...</p>}
                {!buscando && busca && resultados.length === 0 && <p className="text-xs text-center py-5" style={{ color: "var(--text-3)" }}>Nenhum rótulo encontrado para "{busca}".</p>}
                {resultados.map((v) => (
                  <button key={v.id} onClick={() => adicionarVinho(v)}
                    className="w-full text-left px-4 py-3 transition-colors"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{v.nome}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{[v.produtor, v.uva, v.pais].filter(Boolean).join(" · ")}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabela */}
        {loading ? (
          <div className="card p-12 text-center" style={{ color: "var(--text-3)" }}>Carregando...</div>
        ) : itens.length === 0 ? (
          <div className="card p-16 text-center">
            <span className="text-4xl mb-3 block">🍷</span>
            <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>Nenhum vinho no catálogo ainda.</p>
            <button onClick={() => setShowBusca(true)}
              className="px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ background: cor }}>
              Adicionar primeiro vinho
            </button>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-sm" style={{ color: "var(--text-3)" }}>Nenhum vinho encontrado para "{filtro}".</p>
            <button onClick={() => setFiltro("")} className="text-xs mt-2 underline" style={{ color: "var(--text-2)" }}>Limpar busca</button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>Rótulo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider w-32" style={{ color: "var(--text-2)" }}>Preço</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider w-24" style={{ color: "var(--text-2)" }}>Estoque</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider w-20" style={{ color: "var(--text-2)" }}>Ativo</th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {itensFiltrados.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: "var(--text-1)" }}>{item.nome}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                        {[item.produtor, item.uva, item.pais].filter(Boolean).join(" · ")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <input className="input py-1.5 text-sm w-28" value={item.preco}
                        onChange={(e) => updateItem(item.id, "preco", e.target.value)}
                        onBlur={() => item.dirty && saveItem(item)}
                        placeholder="0,00" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" min={0} className="input py-1.5 text-sm w-20"
                        value={item.estoque}
                        onChange={(e) => updateItem(item.id, "estoque", parseInt(e.target.value) || 0)}
                        onBlur={() => item.dirty && saveItem(item)} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => { const novo = { ...item, ativo: !item.ativo, dirty: true }; updateItem(item.id, "ativo", !item.ativo); setTimeout(() => saveItem(novo), 50); }}
                        className="w-10 h-6 rounded-full transition-colors relative inline-block"
                        style={{ background: item.ativo ? cor : "var(--border)" }}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${item.ativo ? "left-[18px]" : "left-0.5"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {saving === item.id && <span className="text-xs" style={{ color: "var(--text-3)" }}>Salvando...</span>}
                        {saved === item.id && <Check className="w-3.5 h-3.5" style={{ color: "#1a7a4a" }} />}
                        {item.dirty && saving !== item.id && (
                          <button onClick={() => saveItem(item)} className="p-1.5 rounded-lg transition-colors"
                            style={{ color: "var(--text-3)" }}>
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg transition-colors"
                          style={{ color: "var(--text-3)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
