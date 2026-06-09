"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import Image from "next/image";
import type { Vinho } from "@/types";

export default function VinhosPage() {
  const [vinhos, setVinhos] = useState<Vinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nome: "", produtor: "", uva: "", pais: "", regiao: "", imagem_url: "",
  });

  const fetchVinhos = useCallback(async () => {
    const res = await fetch("/api/admin/vinhos");
    const data = await res.json();
    setVinhos(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchVinhos(); }, [fetchVinhos]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/vinhos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ nome: "", produtor: "", uva: "", pais: "", regiao: "", imagem_url: "" });
    setShowForm(false);
    fetchVinhos();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este vinho?")) return;
    await fetch(`/api/admin/vinhos/${id}`, { method: "DELETE" });
    fetchVinhos();
  }

  const filtered = vinhos.filter(
    (v) =>
      v.nome.toLowerCase().includes(search.toLowerCase()) ||
      v.produtor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">Rótulos / Vinhos</h1>
          <p className="text-stone-500 text-sm mt-1">Banco central de vinhos — usado como referência nas planilhas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-wine flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo rótulo
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold mb-4">Novo rótulo</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nome (igual à planilha)</label>
              <input className="input" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: DV CATENA MALBEC" />
            </div>
            <div>
              <label className="label">Produtor</label>
              <input className="input" value={form.produtor} onChange={(e) => setForm({ ...form, produtor: e.target.value })} placeholder="Catena Zapata" />
            </div>
            <div>
              <label className="label">Uva</label>
              <input className="input" value={form.uva} onChange={(e) => setForm({ ...form, uva: e.target.value })} placeholder="Malbec" />
            </div>
            <div>
              <label className="label">País</label>
              <input className="input" value={form.pais} onChange={(e) => setForm({ ...form, pais: e.target.value })} placeholder="Argentina" />
            </div>
            <div>
              <label className="label">Região</label>
              <input className="input" value={form.regiao} onChange={(e) => setForm({ ...form, regiao: e.target.value })} placeholder="Mendoza" />
            </div>
            <div>
              <label className="label">URL da imagem do rótulo</label>
              <input className="input" value={form.imagem_url} onChange={(e) => setForm({ ...form, imagem_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancelar</button>
              <button type="submit" className="btn-wine">Salvar rótulo</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          className="input pl-9"
          placeholder="Buscar por nome ou produtor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-stone-400 text-sm">Carregando...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((vinho) => (
            <div key={vinho.id} className="card p-4 relative group">
              <button
                onClick={() => handleDelete(vinho.id)}
                className="absolute top-3 right-3 p-1.5 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {vinho.imagem_url ? (
                <div className="relative w-full aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-stone-50">
                  <Image src={vinho.imagem_url} alt={vinho.nome} fill className="object-contain" />
                </div>
              ) : (
                <div className="w-full aspect-[3/4] mb-3 rounded-lg bg-wine-50 flex items-center justify-center">
                  <span className="text-wine-300 text-3xl">🍷</span>
                </div>
              )}
              <p className="text-xs font-semibold text-stone-800 leading-tight">{vinho.nome}</p>
              {vinho.produtor && <p className="text-xs text-stone-400 mt-0.5">{vinho.produtor}</p>}
              {vinho.uva && <p className="text-xs text-wine-700 mt-1">{vinho.uva}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
