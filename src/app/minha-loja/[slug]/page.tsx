"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Search, Plus, Trash2, Check, LogOut, Save, X, Lock, Tag, ArrowRight, Eye, EyeOff, ExternalLink } from "lucide-react";
import Image from "next/image";

interface VinhoDB { id: string; nome: string; produtor: string; uva: string; pais: string; }
interface ItemLinha {
  id: string; vinho_id: string; nome: string; produtor: string; uva: string; pais: string;
  preco: string; preco_oferta: string; estoque: number; ativo: boolean; dirty: boolean;
}
interface LojaInfo { nome: string; logo_url: string | null; cor_realce: string; }

export default function MinhaLojaPage() {
  const { slug } = useParams<{ slug: string }>();
  const [authed, setAuthed] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [loja, setLoja] = useState<LojaInfo | null>(null);
  const [itens, setItens] = useState<ItemLinha[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [ofertaAtiva, setOfertaAtiva] = useState<Record<string, boolean>>({});
  const [showBusca, setShowBusca] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [resultados, setResultados] = useState<VinhoDB[]>([]);
  const [buscando, setBuscando] = useState(false);
  const buscaRef = useRef<HTMLInputElement>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setSenhaErro("");
    const res = await fetch(`/api/minha-loja/${slug}/auth`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });
    if (res.ok) { const data = await res.json(); setLoja(data.loja); setAuthed(true); }
    else { setSenhaErro("Senha incorreta."); setSubmitting(false); }
  }

  const fetchItens = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/minha-loja/${slug}/itens`);
    const data = await res.json();
    setItens(data.map((i: Omit<ItemLinha, "dirty">) => ({ ...i, dirty: false })));
    setLoading(false);
  }, [slug]);

  useEffect(() => { if (authed) fetchItens(); }, [authed, fetchItens]);

  useEffect(() => {
    if (!busca.trim()) { setResultados([]); return; }
    const t = setTimeout(async () => {
      setBuscando(true);
      const res = await fetch(`/api/admin/vinhos?q=${encodeURIComponent(busca)}`);
      const data = await res.json();
      const jaAdicionados = new Set(itens.map(i => i.vinho_id));
      setResultados(data.filter((v: VinhoDB) => !jaAdicionados.has(v.id)));
      setBuscando(false);
    }, 300);
    return () => clearTimeout(t);
  }, [busca, itens]);

  useEffect(() => { if (showBusca) setTimeout(() => buscaRef.current?.focus(), 100); }, [showBusca]);

  async function adicionarVinho(vinho: VinhoDB) {
    const res = await fetch(`/api/minha-loja/${slug}/itens`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vinho_id: vinho.id, preco: "", preco_oferta: "", estoque: 0, ativo: true }),
    });
    const novo = await res.json();
    setItens(prev => [...prev, { ...vinho, id: novo.id, vinho_id: vinho.id, preco: "", preco_oferta: "", estoque: 0, ativo: true, dirty: false }]);
    setBusca(""); setResultados([]); setShowBusca(false);
  }

  function updateItem(id: string, field: string, value: string | number | boolean) {
    setItens(prev => prev.map(item => item.id === id ? { ...item, [field]: value, dirty: true } : item));
  }

  async function saveItem(item: ItemLinha) {
    setSaving(item.id);
    await fetch(`/api/minha-loja/${slug}/itens/${item.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preco: item.preco, preco_oferta: item.preco_oferta || null, estoque: item.estoque, ativo: item.ativo }),
    });
    setItens(prev => prev.map(i => i.id === item.id ? { ...i, dirty: false } : i));
    setSaving(null); setSaved(item.id); setTimeout(() => setSaved(null), 2000);
  }

  async function removeItem(id: string) {
    if (!confirm("Remover este vinho do catálogo?")) return;
    await fetch(`/api/minha-loja/${slug}/itens/${id}`, { method: "DELETE" });
    setItens(prev => prev.filter(i => i.id !== id));
  }

  const cor = loja?.cor_realce || "#6B21A8";

  const itensFiltrados = itens
    .filter(item => !filtro.trim() ||
      item.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      item.produtor.toLowerCase().includes(filtro.toLowerCase()) ||
      item.uva.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  // ── LOGIN ──
  if (!authed) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden" style={{ background: "#0A0612" }}>
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, #6B21A8, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-20 w-[450px] h-[450px] rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #A855F7, transparent 70%)" }} />
        <div className="relative z-10 w-full max-w-[380px] mx-4">
          <div className="rounded-3xl p-8" style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)", boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            <div className="flex flex-col items-center mb-8">
              <div className="relative h-9 w-44 mb-1">
                <Image src="/logo-compravinho.svg" alt="COMPRAVINHO" fill className="object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </div>
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.4)" }}>Gestão do catálogo</p>
              <p className="text-[10px] mt-1 font-mono tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>/{slug}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.35)" }} />
                <input type={showSenha ? "text" : "password"} value={senha}
                  onChange={(e) => { setSenha(e.target.value); setSenhaErro(""); }}
                  className="w-full pl-11 pr-20 py-3.5 rounded-2xl text-sm outline-none transition-all"
                  placeholder="Senha de acesso" autoFocus
                  style={{ background: "rgba(255,255,255,0.05)", border: senhaErro ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  onFocus={e => { e.target.style.background = "rgba(255,255,255,0.08)"; e.target.style.borderColor = "rgba(168,85,247,0.5)"; }}
                  onBlur={e => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.borderColor = senhaErro ? "rgba(220,38,38,0.5)" : "rgba(255,255,255,0.1)"; }} />
                <button type="button" onClick={() => setShowSenha(p => !p)}
                  className="absolute right-11 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button type="submit" disabled={submitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #A855F7, #6B21A8)" }}>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
              {senhaErro && <p className="text-xs text-center" style={{ color: "#f87171" }}>{senhaErro}</p>}
            </form>
          </div>
          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>compravinho.com</p>
        </div>
      </div>
    );
  }

  // ── PAINEL ──
  return (
    <div className="min-h-screen" style={{ background: "#f4f4f6" }}>

      {/* Header — mesmo estilo do catálogo */}
      <div className="sticky top-0 z-20" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          {loja?.logo_url ? (
            <div className="relative w-8 h-8 shrink-0">
              <Image src={loja.logo_url} alt={loja.nome} fill className="object-contain rounded-full" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: cor }}>{loja?.nome[0]}</div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate" style={{ color: "#111" }}>{loja?.nome}</p>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>Gestão do catálogo</p>
          </div>
          <a href={`/catalogo/${slug}`} target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
            style={{ background: cor + "15", color: cor, border: `1px solid ${cor}30` }}>
            <ExternalLink className="w-3 h-3" /> Ver catálogo
          </a>
          <button onClick={() => setAuthed(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.05)", color: "#9ca3af" }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="h-[2px]" style={{ background: cor }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none transition-all"
              placeholder="Buscar no catálogo..."
              value={filtro} onChange={e => setFiltro(e.target.value)}
              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,0,0,0.08)", color: "#111" }}
              onFocus={e => { e.target.style.boxShadow = `0 0 0 2px ${cor}30`; e.target.style.borderColor = cor + "50"; }}
              onBlur={e => { e.target.style.boxShadow = "none"; e.target.style.borderColor = "rgba(0,0,0,0.08)"; }}
            />
            {filtro && (
              <button onClick={() => setFiltro("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs shrink-0" style={{ color: "#9ca3af" }}>
            {itensFiltrados.length} de {itens.length} vinhos
          </p>
          <button onClick={() => setShowBusca(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-semibold shrink-0 transition-all hover:opacity-90"
            style={{ background: cor, boxShadow: `0 2px 8px ${cor}40` }}>
            <Plus className="w-4 h-4" /> Adicionar vinho
          </button>
        </div>

        {/* Modal busca */}
        {showBusca && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={e => { if (e.target === e.currentTarget) { setShowBusca(false); setBusca(""); } }}>
            <div className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
              <div className="p-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
                  <input ref={buscaRef} className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm outline-none"
                    placeholder="Digite o nome do vinho..."
                    value={busca} onChange={e => setBusca(e.target.value)}
                    style={{ background: "#f4f4f6", border: "none", color: "#111" }} />
                  {busca && (
                    <button onClick={() => setBusca("")} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {buscando && <p className="text-xs text-center py-5" style={{ color: "#9ca3af" }}>Buscando...</p>}
                {!buscando && !busca && <p className="text-xs text-center py-8" style={{ color: "#9ca3af" }}>Digite para buscar rótulos...</p>}
                {!buscando && busca && resultados.length === 0 && <p className="text-xs text-center py-5" style={{ color: "#9ca3af" }}>Nenhum rótulo encontrado.</p>}
                {resultados.map(v => (
                  <button key={v.id} onClick={() => adicionarVinho(v)}
                    className="w-full text-left px-4 py-3 transition-colors hover:bg-gray-50"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <p className="text-sm font-medium" style={{ color: "#111" }}>{v.nome}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{[v.produtor, v.uva, v.pais].filter(Boolean).join(" · ")}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: cor, borderTopColor: "transparent" }} />
          </div>
        ) : itens.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block opacity-20">🍷</span>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>Nenhum vinho no catálogo ainda.</p>
            <button onClick={() => setShowBusca(true)}
              className="px-5 py-2.5 rounded-2xl text-white text-sm font-semibold"
              style={{ background: cor }}>
              Adicionar primeiro vinho
            </button>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "#9ca3af" }}>Nenhum vinho encontrado para &quot;{filtro}&quot;.</p>
            <button onClick={() => setFiltro("")} className="text-xs mt-2 underline" style={{ color: "#6b7280" }}>Limpar busca</button>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
            {/* Table header */}
            <div className="grid px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(0,0,0,0.06)",
                gridTemplateColumns: "1fr 110px 110px 80px 60px 80px" }}>
              <span style={{ color: "#9ca3af" }}>Rótulo</span>
              <span style={{ color: "#9ca3af" }}>Preço</span>
              <span className="flex items-center gap-1" style={{ color: "#9ca3af" }}><Tag className="w-3 h-3" /> Oferta</span>
              <span style={{ color: "#9ca3af" }}>Estoque</span>
              <span className="text-center" style={{ color: "#9ca3af" }}>Ativo</span>
              <span />
            </div>

            {/* Rows */}
            {itensFiltrados.map((item, idx) => (
              <div key={item.id}
                className="grid items-center px-4 py-3 transition-colors hover:bg-white"
                style={{
                  gridTemplateColumns: "1fr 110px 110px 80px 60px 80px",
                  background: idx % 2 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}>
                {/* Nome */}
                <div className="pr-4 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#111" }}>{item.nome}</p>
                  <p className="text-[10px] truncate mt-0.5" style={{ color: "#9ca3af" }}>{[item.produtor, item.uva, item.pais].filter(Boolean).join(" · ")}</p>
                </div>

                {/* Preço */}
                <div>
                  <input className="w-full px-2.5 py-1.5 rounded-xl text-xs outline-none transition-all"
                    value={item.preco}
                    onChange={e => updateItem(item.id, "preco", e.target.value)}
                    onBlur={() => item.dirty && saveItem(item)}
                    placeholder="0,00"
                    style={{ background: "rgba(0,0,0,0.04)", border: "1px solid transparent", color: "#111" }}
                    onFocus={e => { e.target.style.background = "#fff"; e.target.style.borderColor = cor + "50"; e.target.style.boxShadow = `0 0 0 2px ${cor}15`; }}
                    />
                </div>

                {/* Oferta */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const ativo = ofertaAtiva[item.id] ?? !!item.preco_oferta;
                      if (ativo) {
                        setOfertaAtiva(p => ({ ...p, [item.id]: false }));
                        updateItem(item.id, "preco_oferta", "");
                        const novo = { ...item, preco_oferta: "", dirty: true };
                        setTimeout(() => saveItem(novo), 50);
                      } else {
                        setOfertaAtiva(p => ({ ...p, [item.id]: true }));
                      }
                    }}
                    className="w-8 h-4 rounded-full transition-all relative shrink-0"
                    style={{ background: (ofertaAtiva[item.id] ?? !!item.preco_oferta) ? "#dc2626" : "rgba(0,0,0,0.12)" }}>
                    <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${(ofertaAtiva[item.id] ?? !!item.preco_oferta) ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                  {(ofertaAtiva[item.id] ?? !!item.preco_oferta) ? (
                    <input className="w-full px-2 py-1.5 rounded-xl text-xs outline-none transition-all"
                      value={item.preco_oferta || ""}
                      onChange={e => updateItem(item.id, "preco_oferta", e.target.value)}
                      onBlur={() => item.dirty && saveItem(item)}
                      placeholder="0,00" autoFocus
                      style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c" }} />
                  ) : (
                    <span className="text-[10px]" style={{ color: "#d1d5db" }}>—</span>
                  )}
                </div>

                {/* Estoque */}
                <div>
                  <input type="number" min={0}
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs outline-none transition-all"
                    value={item.estoque}
                    onChange={e => updateItem(item.id, "estoque", parseInt(e.target.value) || 0)}
                    onBlur={() => item.dirty && saveItem(item)}
                    style={{ background: "rgba(0,0,0,0.04)", border: "1px solid transparent", color: "#111" }}
                    onFocus={e => { e.target.style.background = "#fff"; e.target.style.borderColor = cor + "50"; e.target.style.boxShadow = `0 0 0 2px ${cor}15`; }} />
                </div>

                {/* Ativo */}
                <div className="flex justify-center">
                  <button
                    onClick={() => { const novo = { ...item, ativo: !item.ativo, dirty: true }; updateItem(item.id, "ativo", !item.ativo); setTimeout(() => saveItem(novo), 50); }}
                    className="w-9 h-5 rounded-full transition-all relative"
                    style={{ background: item.ativo ? cor : "rgba(0,0,0,0.12)" }}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.ativo ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  {saving === item.id && <span className="text-[10px]" style={{ color: "#9ca3af" }}>Salvando...</span>}
                  {saved === item.id && <Check className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />}
                  {item.dirty && saving !== item.id && (
                    <button onClick={() => saveItem(item)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: cor + "15", color: cor }}>
                      <Save className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={() => removeItem(item.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                    style={{ color: "#d1d5db" }}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
