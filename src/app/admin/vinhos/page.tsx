"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash2, Search, Upload, Download, Check } from "lucide-react";
import Image from "next/image";
import type { Vinho } from "@/types";

const COLUNAS = ["nome", "produtor", "uva", "pais", "regiao", "imagem_url"] as const;
const LABELS: Record<string, string> = {
  nome: "Nome", produtor: "Produtor", uva: "Uva", pais: "País", regiao: "Região", imagem_url: "URL Imagem"
};
const WIDTHS: Record<string, string> = {
  nome: "min-w-[220px]", produtor: "min-w-[160px]", uva: "min-w-[130px]",
  pais: "min-w-[110px]", regiao: "min-w-[130px]", imagem_url: "min-w-[200px]"
};

type NovoVinho = Record<typeof COLUNAS[number], string>;
const linhaVazia = (): NovoVinho => ({ nome: "", produtor: "", uva: "", pais: "", regiao: "", imagem_url: "" });

export default function VinhosPage() {
  const [vinhos, setVinhos] = useState<Vinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [novasLinhas, setNovasLinhas] = useState<NovoVinho[]>([linhaVazia()]);
  const [salvando, setSalvando] = useState(false);
  const [saved, setSaved] = useState(false);
  const [csvError, setCsvError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [deletando, setDeletando] = useState<string | null>(null);

  const fetchVinhos = useCallback(async () => {
    const res = await fetch("/api/admin/vinhos");
    const data = await res.json();
    setVinhos(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchVinhos(); }, [fetchVinhos]);

  function updateLinha(idx: number, field: string, value: string) {
    setNovasLinhas((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  }

  function addLinha() {
    setNovasLinhas((prev) => [...prev, linhaVazia()]);
  }

  function removeLinha(idx: number) {
    setNovasLinhas((prev) => prev.filter((_, i) => i !== idx));
  }

  async function salvarNovas() {
    const validas = novasLinhas.filter((l) => l.nome.trim());
    if (!validas.length) return;
    setSalvando(true);
    await Promise.all(validas.map((l) =>
      fetch("/api/admin/vinhos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(l),
      })
    ));
    setNovasLinhas([linhaVazia()]);
    setSalvando(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    fetchVinhos();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este vinho?")) return;
    setDeletando(id);
    await fetch(`/api/admin/vinhos/${id}`, { method: "DELETE" });
    setDeletando(null);
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
      if (lines.length < 2) { setCsvError("CSV vazio ou sem dados."); return; }

      // Detect header
      const header = lines[0].split(",").map((h) => h.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_"));

      const mapa: Record<string, number> = {};
      COLUNAS.forEach((col) => {
        const idx = header.findIndex((h) => h.includes(col.replace("_url", "").replace("imagem", "imagem")));
        if (idx >= 0) mapa[col] = idx;
      });

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
    const header = "nome,produtor,uva,pais,regiao,imagem_url";
    const exemplo = "DV CATENA MALBEC,Catena Zapata,Malbec,Argentina,Mendoza,";
    const blob = new Blob([header + "\n" + exemplo], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "template-vinhos.csv"; a.click();
  }

  const filtered = vinhos.filter((v) =>
    v.nome.toLowerCase().includes(search.toLowerCase()) ||
    v.produtor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">Rótulos / Vinhos</h1>
          <p className="text-stone-500 text-sm mt-1">Banco central de rótulos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadTemplate} className="btn-outline flex items-center gap-2 text-xs">
            <Download className="w-3.5 h-3.5" /> Template CSV
          </button>
          <label className="btn-outline flex items-center gap-2 text-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Importar CSV
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
          </label>
        </div>
      </div>

      {/* Grid de entrada */}
      <div className="card overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <p className="text-sm font-medium text-stone-700">Adicionar rótulos</p>
          <p className="text-xs text-stone-400">Preencha e clique em Salvar — pode adicionar várias linhas</p>
        </div>
        {csvError && <p className="text-red-500 text-xs px-4 py-2">{csvError}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {COLUNAS.map((col) => (
                  <th key={col} className={`text-left px-3 py-2 text-xs font-medium text-stone-500 uppercase tracking-wide ${WIDTHS[col]}`}>
                    {LABELS[col]}{col === "nome" && <span className="text-red-400 ml-0.5">*</span>}
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {novasLinhas.map((linha, idx) => (
                <tr key={idx} className="border-b border-stone-50 hover:bg-stone-50/50">
                  {COLUNAS.map((col) => (
                    <td key={col} className="px-2 py-1.5">
                      <input
                        className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-wine-300 focus:border-wine-400 placeholder:text-stone-300"
                        value={linha[col]}
                        onChange={(e) => updateLinha(idx, col, e.target.value)}
                        placeholder={LABELS[col]}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (idx === novasLinhas.length - 1) addLinha(); } }}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1.5">
                    {novasLinhas.length > 1 && (
                      <button onClick={() => removeLinha(idx)} className="p-1 text-stone-300 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between">
          <button onClick={addLinha} className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Adicionar linha
          </button>
          <button onClick={salvarNovas} disabled={salvando}
            className="btn-wine flex items-center gap-2 text-xs py-2">
            {salvando ? "Salvando..." : saved ? <><Check className="w-3.5 h-3.5" /> Salvo!</> : "Salvar rótulos"}
          </button>
        </div>
      </div>

      {/* Lista existente */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-stone-700">{vinhos.length} rótulos cadastrados</p>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input className="input pl-8 py-1.5 text-sm" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <p className="text-stone-400 text-sm">Carregando...</p>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase tracking-wide w-10" />
                  {COLUNAS.filter(c => c !== "imagem_url").map((col) => (
                    <th key={col} className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase tracking-wide">{LABELS[col]}</th>
                  ))}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-2">
                      {v.imagem_url ? (
                        <div className="relative w-7 h-9">
                          <Image src={v.imagem_url} alt={v.nome} fill className="object-contain" />
                        </div>
                      ) : (
                        <div className="w-7 h-9 bg-stone-100 rounded flex items-center justify-center text-stone-300 text-xs">🍷</div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium text-stone-800">{v.nome}</td>
                    <td className="px-4 py-2 text-stone-500">{v.produtor}</td>
                    <td className="px-4 py-2 text-stone-500">{v.uva}</td>
                    <td className="px-4 py-2 text-stone-500">{v.pais}</td>
                    <td className="px-4 py-2 text-stone-500">{v.regiao}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleDelete(v.id)}
                        className="p-1.5 text-stone-300 hover:text-red-500 transition-colors">
                        {deletando === v.id ? "..." : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
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
