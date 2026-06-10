"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash2, Search, Upload, Download, Check, Pencil, X, RefreshCw } from "lucide-react";
import Image from "next/image";
import type { Vinho } from "@/types";

const COLUNAS = ["nome", "produtor", "uva", "pais", "regiao", "imagem_url"] as const;
const LABELS: Record<string, string> = { nome: "Nome", produtor: "Produtor", uva: "Uva", pais: "País", regiao: "Região", imagem_url: "URL Imagem" };
const WIDTHS: Record<string, string> = { nome: "min-w-[200px]", produtor: "min-w-[150px]", uva: "min-w-[120px]", pais: "min-w-[100px]", regiao: "min-w-[120px]", imagem_url: "min-w-[180px]" };
type NovoVinho = Record<typeof COLUNAS[number], string>;
const linhaVazia = (): NovoVinho => ({ nome: "", produtor: "", uva: "", pais: "", regiao: "", imagem_url: "" });

function EditModal({ vinho, onSave, onClose }: { vinho: Vinho; onSave: (data: Partial<Vinho>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ nome: vinho.nome, produtor: vinho.produtor, uva: vinho.uva, pais: vinho.pais, regiao: vinho.regiao, imagem_url: vinho.imagem_url ?? "" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>Editar rótulo</h3>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {COLUNAS.map((col) => (
            <div key={col} className={col === "imagem_url" || col === "nome" ? "col-span-2" : ""}>
              <label className="label">{LABELS[col]}{col === "nome" && <span style={{ color: "#dc2626" }}>*</span>}</label>
              <input className="input" value={form[col]} onChange={(e) => setForm({ ...form, [col]: e.target.value })} placeholder={LABELS[col]} />
            </div>
          ))}
        </div>
        {form.imagem_url && (
          <div className="mt-3 flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--surface-2)" }}>
            <div className="relative w-10 h-12 shrink-0">
              <Image src={form.imagem_url} alt={form.nome} fill className="object-contain" />
            </div>
            <p className="text-xs" style={{ color: "var(--text-2)" }}>Preview do rótulo</p>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={onClose} className="btn-outline">Cancelar</button>
          <button onClick={() => onSave(form)} className="btn-primary">Salvar alterações</button>
        </div>
      </div>
    </div>
  );
}

export default function VinhosPage() {
  const [vinhos, setVinhos] = useState<Vinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [novasLinhas, setNovasLinhas] = useState<NovoVinho[]>([linhaVazia()]);
  const [salvando, setSalvando] = useState(false);
  const [saved, setSaved] = useState(false);
  const [csvError, setCsvError] = useState("");
  const [editingVinho, setEditingVinho] = useState<Vinho | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ updated: number; not_found: string[]; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchVinhos = useCallback(async () => {
    const res = await fetch("/api/admin/vinhos");
    setVinhos(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchVinhos(); }, [fetchVinhos]);

  function updateLinha(idx: number, field: string, value: string) {
    setNovasLinhas((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  }

  async function salvarNovas() {
    const validas = novasLinhas.filter((l) => l.nome.trim());
    if (!validas.length) return;
    setSalvando(true);
    await Promise.all(validas.map((l) => fetch("/api/admin/vinhos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(l) })));
    setNovasLinhas([linhaVazia()]);
    setSalvando(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    fetchVinhos();
  }

  async function handleEdit(id: string, data: Partial<Vinho>) {
    await fetch(`/api/admin/vinhos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setEditingVinho(null);
    fetchVinhos();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este vinho?")) return;
    await fetch(`/api/admin/vinhos/${id}`, { method: "DELETE" });
    fetchVinhos();
  }

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    const res = await fetch("/api/admin/sync-imagens", { method: "POST" });
    setSyncResult(await res.json());
    setSyncing(false);
    fetchVinhos();
  }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    setCsvError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) { setCsvError("CSV vazio."); return; }
      const header = lines[0].split(",").map((h) => h.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_"));
      const mapa: Record<string, number> = {};
      COLUNAS.forEach((col) => { const idx = header.findIndex((h) => h.includes(col.replace("_url", ""))); if (idx >= 0) mapa[col] = idx; });
      if (mapa["nome"] === undefined) { setCsvError("CSV precisa ter coluna 'nome'."); return; }
      const novas: NovoVinho[] = lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        const l = linhaVazia();
        COLUNAS.forEach((col) => { if (mapa[col] !== undefined) l[col] = cols[mapa[col]] ?? ""; });
        return l;
      }).filter((l) => l.nome);
      setNovasLinhas(novas.length ? novas : [linhaVazia()]);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  }

  function downloadTemplate() {
    const blob = new Blob(["nome,produtor,uva,pais,regiao,imagem_url\nDV CATENA MALBEC,Catena Zapata,Malbec,Argentina,Mendoza,"], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "template-vinhos.csv"; a.click();
  }

  const filtered = vinhos.filter((v) => v.nome.toLowerCase().includes(search.toLowerCase()) || v.produtor.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl">
      {editingVinho && <EditModal vinho={editingVinho} onSave={(data) => handleEdit(editingVinho.id, data)} onClose={() => setEditingVinho(null)} />}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <p className="text-sm" style={{ color: "var(--text-2)" }}>{vinhos.length} rótulos cadastrados</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={downloadTemplate} className="btn-outline text-xs py-1.5"><Download className="w-3.5 h-3.5" /> Template CSV</button>
          <label className="btn-outline text-xs py-1.5 cursor-pointer"><Upload className="w-3.5 h-3.5" /> Importar CSV<input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} /></label>
          <button onClick={handleSync} disabled={syncing} className="btn-outline text-xs py-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Sincronizando..." : "Sync imagens Drive"}
          </button>
        </div>
      </div>

      {syncResult && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2" style={{ background: syncResult.updated > 0 ? "#edfaf3" : "var(--surface-3)", color: syncResult.updated > 0 ? "#1a7a4a" : "var(--text-2)" }}>
          <Check className="w-3.5 h-3.5 shrink-0" />
          {syncResult.message}
          {(syncResult.not_found?.length ?? 0) > 0 && <span style={{ color: "#b45309" }}>· Não encontrados: {syncResult.not_found.slice(0, 3).join(", ")}{syncResult.not_found.length > 3 ? ` +${syncResult.not_found.length - 3}` : ""}</span>}
        </div>
      )}

      {/* New rows grid */}
      <div className="card overflow-hidden mb-6">
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Adicionar rótulos</p>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>Enter avança para próxima linha</p>
        </div>
        {csvError && <p className="text-xs px-4 py-2" style={{ color: "#dc2626", background: "#fef2f2" }}>{csvError}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {COLUNAS.map((col) => (
                  <th key={col} className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider ${WIDTHS[col]}`} style={{ color: "var(--text-2)" }}>
                    {LABELS[col]}{col === "nome" && <span style={{ color: "#dc2626" }}>*</span>}
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {novasLinhas.map((linha, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                  {COLUNAS.map((col) => (
                    <td key={col} className="px-2 py-1.5">
                      <input className="input py-1.5 text-xs" value={linha[col]}
                        onChange={(e) => updateLinha(idx, col, e.target.value)}
                        placeholder={LABELS[col]}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (idx === novasLinhas.length - 1) setNovasLinhas(p => [...p, linhaVazia()]); }}} />
                    </td>
                  ))}
                  <td className="px-2 py-1.5">
                    {novasLinhas.length > 1 && (
                      <button onClick={() => setNovasLinhas(p => p.filter((_, i) => i !== idx))} className="btn-ghost p-1.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => setNovasLinhas(p => [...p, linhaVazia()])} className="btn-ghost text-xs py-1.5">
            <Plus className="w-3.5 h-3.5" /> Linha
          </button>
          <button onClick={salvarNovas} disabled={salvando} className="btn-primary text-xs py-1.5">
            {salvando ? "Salvando..." : saved ? <><Check className="w-3.5 h-3.5" /> Salvo!</> : "Salvar rótulos"}
          </button>
        </div>
      </div>

      {/* Search + table */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--text-3)" }} />
        <input className="input pl-9 py-2 text-sm" placeholder="Buscar por nome ou produtor..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="card p-12 text-center" style={{ color: "var(--text-3)" }}>Carregando...</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-10" />
                  <th>Nome</th>
                  <th>Produtor</th>
                  <th>Uva</th>
                  <th>País</th>
                  <th>Região</th>
                  <th className="w-16" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id}>
                    <td>
                      {v.imagem_url ? (
                        <div className="relative w-7 h-9"><Image src={v.imagem_url} alt={v.nome} fill className="object-contain" /></div>
                      ) : (
                        <div className="w-7 h-9 rounded flex items-center justify-center text-lg" style={{ background: "var(--surface-3)" }}>🍷</div>
                      )}
                    </td>
                    <td className="font-medium">{v.nome}</td>
                    <td style={{ color: "var(--text-2)" }}>{v.produtor}</td>
                    <td style={{ color: "var(--text-2)" }}>{v.uva}</td>
                    <td style={{ color: "var(--text-2)" }}>{v.pais}</td>
                    <td style={{ color: "var(--text-2)" }}>{v.regiao}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditingVinho(v)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(v.id)} className="btn-ghost p-1.5" style={{ color: "var(--text-3)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
