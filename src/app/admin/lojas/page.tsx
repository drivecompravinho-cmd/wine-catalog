"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, ExternalLink, Trash2, Copy, Check } from "lucide-react";
import type { Loja } from "@/types";

const CORES_SUGERIDAS = [
  "#7B2D8B", "#8B1A1A", "#1A3A5C", "#2D5A27", "#8B6914",
  "#C0392B", "#16537e", "#6C3483", "#1E8449", "#784212",
];

export default function LojasPage() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "", slug: "", sheet_id: "", logo_url: "", cor_realce: "#8B1A1A",
  });

  const fetchLojas = useCallback(async () => {
    const res = await fetch("/api/admin/lojas");
    const data = await res.json();
    setLojas(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLojas(); }, [fetchLojas]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/lojas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ativo: true }),
    });
    setForm({ nome: "", slug: "", sheet_id: "", logo_url: "", cor_realce: "#8B1A1A" });
    setShowForm(false);
    fetchLojas();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover esta loja?")) return;
    await fetch(`/api/admin/lojas/${id}`, { method: "DELETE" });
    fetchLojas();
  }

  async function handleToggle(loja: Loja) {
    await fetch(`/api/admin/lojas/${loja.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !loja.ativo }),
    });
    fetchLojas();
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/catalogo/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  function slugify(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">Vinotecas</h1>
          <p className="text-stone-500 text-sm mt-1">Gerencie os catálogos dos seus clientes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-wine flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova vinoteca
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold mb-4">Nova vinoteca</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nome da vinoteca</label>
                <input
                  className="input" required value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value, slug: slugify(e.target.value) })}
                  placeholder="Ex: Vinoteca Paulista"
                />
              </div>
              <div>
                <label className="label">Slug (URL)</label>
                <input
                  className="input" required value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  placeholder="vinoteca-paulista"
                />
                <p className="text-xs text-stone-400 mt-1">/catalogo/{form.slug || "..."}</p>
              </div>
            </div>

            <div>
              <label className="label">ID da planilha Google Sheets</label>
              <input
                className="input" required value={form.sheet_id}
                onChange={(e) => setForm({ ...form, sheet_id: e.target.value })}
                placeholder="Cole o ID da URL da planilha"
              />
              <p className="text-xs text-stone-400 mt-1">
                https://docs.google.com/spreadsheets/d/<strong>ID_AQUI</strong>/edit
              </p>
            </div>

            <div>
              <label className="label">URL do logo</label>
              <input
                className="input" value={form.logo_url}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="label">Cor de realce</label>
              <div className="flex items-center gap-3 flex-wrap">
                {CORES_SUGERIDAS.map((cor) => (
                  <button
                    key={cor} type="button"
                    onClick={() => setForm({ ...form, cor_realce: cor })}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: cor,
                      borderColor: form.cor_realce === cor ? "#000" : "transparent",
                      transform: form.cor_realce === cor ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="color"
                    value={form.cor_realce}
                    onChange={(e) => setForm({ ...form, cor_realce: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-stone-200"
                    title="Cor personalizada"
                  />
                  <span className="text-xs text-stone-500 font-mono">{form.cor_realce}</span>
                </div>
              </div>
              {/* Preview */}
              <div className="mt-3 p-3 rounded-lg border border-stone-100 flex items-center gap-3"
                style={{ borderLeftColor: form.cor_realce, borderLeftWidth: 4 }}>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: form.cor_realce }} />
                <span className="text-sm text-stone-600">Preview da cor no catálogo</span>
                <span className="ml-auto text-sm font-display font-semibold" style={{ color: form.cor_realce }}>
                  R$ 89,90
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancelar</button>
              <button type="submit" className="btn-wine">Salvar vinoteca</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-stone-400 text-sm">Carregando...</p>
      ) : lojas.length === 0 ? (
        <div className="card p-12 text-center text-stone-400">
          <p className="text-sm">Nenhuma vinoteca cadastrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lojas.map((loja) => (
            <div key={loja.id} className="card p-5 flex items-center gap-4"
              style={{ borderLeft: `4px solid ${loja.cor_realce || "#8B1A1A"}` }}>
              {loja.logo_url ? (
                <img src={loja.logo_url} alt={loja.nome} className="w-10 h-10 rounded-lg object-contain bg-stone-50" />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm"
                  style={{ backgroundColor: loja.cor_realce || "#8B1A1A" }}>
                  {loja.nome[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900">{loja.nome}</p>
                <p className="text-xs text-stone-400">/catalogo/{loja.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-stone-200"
                  style={{ backgroundColor: loja.cor_realce || "#8B1A1A" }} title={loja.cor_realce} />
                <button
                  onClick={() => handleToggle(loja)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    loja.ativo ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {loja.ativo ? "Ativo" : "Inativo"}
                </button>
                <button onClick={() => copyLink(loja.slug)} className="p-2 text-stone-400 hover:text-wine-700 transition-colors" title="Copiar link">
                  {copied === loja.slug ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <a href={`/catalogo/${loja.slug}`} target="_blank" className="p-2 text-stone-400 hover:text-wine-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => handleDelete(loja.id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
