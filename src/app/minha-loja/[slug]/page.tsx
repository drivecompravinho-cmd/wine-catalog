"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Search, Plus, Trash2, Check, Wine, LogOut, Save } from "lucide-react";

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
  const [resultados, setResultados] = useState<VinhoDB[]>([]);
  const [buscando, setBuscando] = useState(false);
  const buscaRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (authed) fetchItens();
  }, [authed, fetchItens]);

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

  const cor = loja?.cor_realce || "#8B1A1A";

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="card p-8 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <Wine className="w-5 h-5" style={{ color: "#8B1A1A" }} />
            <span className="font-display text-xl font-semibold text-stone-900">Minha Loja</span>
          </div>
          <p className="text-stone-400 text-sm mb-6">Acesse para gerenciar seu catálogo</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Senha de acesso</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
                className="input" placeholder="••••••••" autoFocus />
            </div>
            {senhaErro && <p className="text-red-500 text-sm">{senhaErro}</p>}
            <button type="submit" className="w-full py-2.5 rounded-lg text-white font-medium text-sm"
              style={{ backgroundColor: "#8B1A1A" }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          {loja?.logo_url ? (
            <img src={loja.logo_url} alt={loja.nome} className="w-8 h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold font-display"
              style={{ backgroundColor: cor }}>{loja?.nome[0]}</div>
          )}
          <div className="flex-1">
            <p className="font-display font-semibold text-stone-900 text-sm">{loja?.nome}</p>
            <p className="text-xs text-stone-400">Gestão do catálogo</p>
          </div>
          <a href={`/catalogo/${slug}`} target="_blank"
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:border-stone-400 transition-colors">
            Ver catálogo
          </a>
          <button onClick={() => setAuthed(false)} className="p-2 text-stone-400 hover:text-stone-600">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="h-0.5" style={{ backgroundColor: cor }} />
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-stone-500">{itens.length} {itens.length === 1 ? "vinho" : "vinhos"} no catálogo</p>
          <button onClick={() => setShowBusca(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: cor }}>
            <Plus className="w-4 h-4" /> Adicionar vinho
          </button>
        </div>

        {showBusca && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowBusca(false); }}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-4 border-b border-stone-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input ref={buscaRef} className="input pl-9"
                    placeholder="Digite o nome do vinho..." value={busca}
                    onChange={(e) => setBusca(e.target.value)} />
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {buscando && <p className="text-xs text-stone-400 text-center py-4">Buscando...</p>}
                {!buscando && busca && resultados.length === 0 && (
                  <p className="text-xs text-stone-400 text-center py-4">Nenhum rótulo encontrado.</p>
                )}
                {!buscando && !busca && (
                  <p className="text-xs text-stone-400 text-center py-6">Digite para buscar rótulos...</p>
                )}
                {resultados.map((v) => (
                  <button key={v.id} onClick={() => adicionarVinho(v)}
                    className="w-full text-left px-4 py-3 hover:bg-stone-50 border-b border-stone-50 transition-colors">
                    <p className="text-sm font-medium text-stone-800">{v.nome}</p>
                    <p className="text-xs text-stone-400">{[v.produtor, v.uva, v.pais].filter(Boolean).join(" · ")}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-stone-400 text-sm text-center py-12">Carregando...</p>
        ) : itens.length === 0 ? (
          <div className="card p-16 text-center">
            <span className="text-4xl mb-3 block">🍷</span>
            <p className="text-stone-500 text-sm mb-4">Nenhum vinho no catálogo ainda.</p>
            <button onClick={() => setShowBusca(true)}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: cor }}>
              Adicionar primeiro vinho
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Rótulo</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide w-32">Preço</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide w-24">Estoque</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide w-20">Ativo</th>
                  <th className="w-20" />
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-800">{item.nome}</p>
                      <p className="text-xs text-stone-400">{[item.produtor, item.uva, item.pais].filter(Boolean).join(" · ")}</p>
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
                        style={{ backgroundColor: item.ativo ? cor : "#d6d3d1" }}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${item.ativo ? "left-[18px]" : "left-0.5"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {saving === item.id && <span className="text-xs text-stone-400">Salvando...</span>}
                        {saved === item.id && <Check className="w-3.5 h-3.5 text-green-500" />}
                        {item.dirty && saving !== item.id && (
                          <button onClick={() => saveItem(item)} className="p-1.5 text-stone-400 hover:text-stone-700">
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => removeItem(item.id)} className="p-1.5 text-stone-300 hover:text-red-500 transition-colors">
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
