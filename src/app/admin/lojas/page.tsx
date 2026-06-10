"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, ExternalLink, Trash2, Copy, Check, Pencil, X } from "lucide-react";
import type { Loja } from "@/types";

const CORES = ["#6B1F3A","#1A3A5C","#2D5A27","#8B6914","#5B2D8E","#1E6B5A","#8B1A1A","#C0392B","#16537e","#784212"];

const formVazio = () => ({ nome: "", slug: "", logo_url: "", cor_realce: "#6B1F3A", senha_cliente: "", dominio_customizado: "" });

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {CORES.map((c) => (
        <button key={c} type="button" onClick={() => onChange(c)}
          className="w-7 h-7 rounded-full transition-all"
          style={{ background: c, outline: value === c ? `3px solid ${c}` : "none", outlineOffset: "2px", transform: value === c ? "scale(1.15)" : "scale(1)" }} />
      ))}
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded-full cursor-pointer border-0 p-0" style={{ background: "none" }} />
      <span className="text-xs font-mono" style={{ color: "var(--text-3)" }}>{value}</span>
    </div>
  );
}

function LojaForm({ initial, onSave, onCancel }: {
  initial?: Partial<Loja>;
  onSave: (data: Record<string, string | boolean>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    ...formVazio(),
    nome: initial?.nome ?? "",
    slug: initial?.slug ?? "",
    logo_url: initial?.logo_url ?? "",
    cor_realce: initial?.cor_realce ?? "#6B1F3A",
    senha_cliente: initial?.senha_cliente ?? "",
    dominio_customizado: initial?.dominio_customizado ?? "",
  });

  const isEdit = !!initial?.id;

  return (
    <div className="card p-6 mb-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>
          {isEdit ? "Editar vinoteca" : "Nova vinoteca"}
        </h3>
        <button onClick={onCancel} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Nome</label>
          <input className="input" required value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value, slug: isEdit ? form.slug : slugify(e.target.value) })}
            placeholder="Vinoteca Paulista" />
        </div>
        <div>
          <label className="label">Slug</label>
          <input className="input" required value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            placeholder="vinoteca-paulista" />
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>/catalogo/{form.slug || "..."}</p>
        </div>
        <div>
          <label className="label">Senha do cliente</label>
          <input className="input" required value={form.senha_cliente}
            onChange={(e) => setForm({ ...form, senha_cliente: e.target.value })}
            placeholder="senha123" />
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>/minha-loja/{form.slug || "..."}</p>
        </div>
        <div>
          <label className="label">Domínio customizado <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(opcional)</span></label>
          <input className="input" value={form.dominio_customizado}
            onChange={(e) => setForm({ ...form, dominio_customizado: e.target.value })}
            placeholder="catalogo.vinoteca.com.br" />
        </div>
        <div className="col-span-2">
          <label className="label">URL do logo <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(opcional)</span></label>
          <input className="input" value={form.logo_url}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            placeholder="https://..." />
        </div>
        <div className="col-span-2">
          <label className="label">Cor de realce</label>
          <ColorPicker value={form.cor_realce} onChange={(c) => setForm({ ...form, cor_realce: c })} />
          <div className="mt-3 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: form.cor_realce + "12", border: `1.5px solid ${form.cor_realce}30` }}>
            <div className="w-4 h-4 rounded-full" style={{ background: form.cor_realce }} />
            <span className="text-sm" style={{ color: "var(--text-2)" }}>Preview no catálogo</span>
            <span className="ml-auto font-semibold font-display text-base" style={{ color: form.cor_realce }}>R$ 89,90</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
        <button type="button" onClick={onCancel} className="btn-outline">Cancelar</button>
        <button onClick={() => onSave({ ...form, ativo: true, sheet_id: "" })} className="btn-primary">
          {isEdit ? "Salvar alterações" : "Criar vinoteca"}
        </button>
      </div>
    </div>
  );
}

export default function LojasPage() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchLojas = useCallback(async () => {
    const res = await fetch("/api/admin/lojas");
    setLojas(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchLojas(); }, [fetchLojas]);

  async function handleCreate(data: Record<string, string | boolean>) {
    await fetch("/api/admin/lojas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowForm(false);
    fetchLojas();
  }

  async function handleEdit(id: string, data: Record<string, string | boolean>) {
    await fetch(`/api/admin/lojas/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setEditingId(null);
    fetchLojas();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover esta vinoteca?")) return;
    await fetch(`/api/admin/lojas/${id}`, { method: "DELETE" });
    fetchLojas();
  }

  async function handleToggle(loja: Loja) {
    await fetch(`/api/admin/lojas/${loja.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ativo: !loja.ativo }) });
    fetchLojas();
  }

  function copyLink(slug: string) {
    navigator.clipboard.writeText(`${window.location.origin}/catalogo/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  function getCatalogoUrl(loja: Loja) {
    if (loja.dominio_customizado) return `https://${loja.dominio_customizado}`;
    return `/catalogo/${loja.slug}`;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: "var(--text-2)" }}>{lojas.length} vinoteca{lojas.length !== 1 ? "s" : ""} cadastrada{lojas.length !== 1 ? "s" : ""}</p>
        <button onClick={() => { setShowForm(true); setEditingId(null); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Nova vinoteca
        </button>
      </div>

      {showForm && !editingId && (
        <LojaForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="card p-12 text-center" style={{ color: "var(--text-3)" }}>Carregando...</div>
      ) : lojas.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-sm" style={{ color: "var(--text-3)" }}>Nenhuma vinoteca cadastrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lojas.map((loja) => (
            <div key={loja.id}>
              {editingId === loja.id ? (
                <LojaForm initial={loja} onSave={(data) => handleEdit(loja.id, data)} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="card p-4 flex items-center gap-4" style={{ borderLeft: `4px solid ${loja.cor_realce || "#6B1F3A"}` }}>
                  {loja.logo_url ? (
                    <img src={loja.logo_url} alt={loja.nome} className="w-10 h-10 rounded-xl object-contain" style={{ background: "var(--surface-2)" }} />
                  ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
                      style={{ background: loja.cor_realce || "#6B1F3A" }}>
                      {loja.nome[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <a href={getCatalogoUrl(loja)} target="_blank"
                      className="font-semibold text-sm hover:underline"
                      style={{ color: loja.cor_realce || "#6B1F3A" }}>
                      {loja.nome}
                    </a>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-3)" }}>
                      {loja.dominio_customizado || `/catalogo/${loja.slug}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleToggle(loja)}
                      className={`badge ${loja.ativo ? "badge-green" : "badge-gray"} cursor-pointer`}>
                      {loja.ativo ? "Ativo" : "Inativo"}
                    </button>
                    <button onClick={() => copyLink(loja.slug)} className="btn-ghost p-2">
                      {copied === loja.slug ? <Check className="w-4 h-4" style={{ color: "#1a7a4a" }} /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a href={getCatalogoUrl(loja)} target="_blank" className="btn-ghost p-2">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => { setEditingId(loja.id); setShowForm(false); }} className="btn-ghost p-2">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(loja.id)} className="btn-ghost p-2" style={{ color: "var(--text-3)" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
