"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, ExternalLink, Trash2, Copy, Check, Pencil, X, Wine, Eye, EyeOff, LayoutDashboard, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import type { Loja } from "@/types";

const CORES = ["#6B21A8","#1A3A5C","#2D5A27","#8B6914","#5B2D8E","#1E6B5A","#8B1A1A","#C0392B","#16537e","#784212"];
const formVazio = () => ({ nome: "", slug: "", logo_url: "", banner_url: "", cor_realce: "#6B21A8", senha_cliente: "", whatsapp: "", instagram: "", facebook: "", endereco_url: "", descricao: "", dominio_customizado: "" });

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
        className="w-7 h-7 rounded-full cursor-pointer border-0 p-0" />
      <span className="text-xs font-mono" style={{ color: "var(--text-3)" }}>{value}</span>
    </div>
  );
}

function ImageUploader({ label, bucket, value, onChange, aspect }: {
  label: string; bucket: string; value: string; onChange: (url: string) => void; aspect?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", bucket);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) onChange(data.url);
    else setError("Erro ao fazer upload.");
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ width: aspect === "banner" ? 120 : 64, height: aspect === "banner" ? 48 : 64, background: "var(--surface-3)", border: "1.5px solid var(--border)" }}>
          {value ? (
            <div className="relative w-full h-full">
              <Image src={value} alt={label} fill className="object-cover" />
            </div>
          ) : (
            <ImageIcon className="w-5 h-5" style={{ color: "var(--text-3)" }} />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="btn-outline text-xs py-1.5 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Enviando..." : "Enviar arquivo"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")}
                className="btn-ghost text-xs py-1.5" style={{ color: "var(--text-3)" }}>
                <X className="w-3.5 h-3.5" /> Remover
              </button>
            )}
          </div>
          <input type="text" className="input text-xs" value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ou cole uma URL..." />
          {error && <p className="text-xs" style={{ color: "#dc2626" }}>{error}</p>}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
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
    banner_url: initial?.banner_url ?? "",
    cor_realce: initial?.cor_realce ?? "#6B21A8",
    senha_cliente: initial?.senha_cliente ?? "",
    whatsapp: initial?.whatsapp ?? "",
    instagram: initial?.instagram ?? "",
    facebook: initial?.facebook ?? "",
    endereco_url: initial?.endereco_url ?? "",
    descricao: initial?.descricao ?? "",
    dominio_customizado: initial?.dominio_customizado ?? "",
  });
  const isEdit = !!initial?.id;

  return (
    <div className="card p-6 mb-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>{isEdit ? "Editar vinoteca" : "Nova vinoteca"}</h3>
        <button onClick={onCancel} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <ImageUploader label="Logo" bucket="logos" value={form.logo_url} onChange={(url) => setForm({ ...form, logo_url: url })} aspect="square" />
          <ImageUploader label="Imagem de capa" bucket="banners" value={form.banner_url} onChange={(url) => setForm({ ...form, banner_url: url })} aspect="banner" />
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
            <input className="input" required value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="vinoteca-paulista" />
            <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>/catalogo/{form.slug || "..."}</p>
          </div>
          <div>
            <label className="label">Senha do cliente</label>
            <input className="input" required value={form.senha_cliente} onChange={(e) => setForm({ ...form, senha_cliente: e.target.value })} placeholder="senha123" />
          </div>
          <div>
            <label className="label">WhatsApp</label>
            <input className="input" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="5511999999999" />
          </div>
          <div>
            <label className="label">Instagram</label>
            <input className="input" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="label">Facebook</label>
            <input className="input" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="label">Localização</label>
            <input className="input" value={form.endereco_url} onChange={(e) => setForm({ ...form, endereco_url: e.target.value })} placeholder="https://maps.google.com/..." />
          </div>
          <div>
            <label className="label">Domínio customizado</label>
            <input className="input" value={form.dominio_customizado} onChange={(e) => setForm({ ...form, dominio_customizado: e.target.value })} placeholder="catalogo.vinoteca.com.br" />
          </div>
          <div className="col-span-2">
            <label className="label">Descrição curta</label>
            <input className="input" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Vinhos selecionados para você · Entrega rápida" maxLength={100} />
          </div>
        </div>
        <div>
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
  const [showSenha, setShowSenha] = useState<Record<string, boolean>>({});

  const fetchLojas = useCallback(async () => {
    const res = await fetch("/api/admin/lojas");
    setLojas(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchLojas(); }, [fetchLojas]);

  async function handleCreate(data: Record<string, string | boolean>) {
    await fetch("/api/admin/lojas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowForm(false); fetchLojas();
  }

  async function handleEdit(id: string, data: Record<string, string | boolean>) {
    await fetch(`/api/admin/lojas/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setEditingId(null); fetchLojas();
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

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  function getCatalogoUrl(loja: Loja) {
    if (loja.dominio_customizado) return `https://${loja.dominio_customizado}`;
    return `/catalogo/${loja.slug}`;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: "var(--text-2)" }}>{lojas.length} vinoteca{lojas.length !== 1 ? "s" : ""} cadastrada{lojas.length !== 1 ? "s" : ""}</p>
        <button onClick={() => { setShowForm(true); setEditingId(null); }} className="btn-primary"><Plus className="w-4 h-4" /> Nova vinoteca</button>
      </div>

      {showForm && !editingId && <LojaForm onSave={handleCreate} onCancel={() => setShowForm(false)} />}

      {loading ? (
        <div className="card p-12 text-center" style={{ color: "var(--text-3)" }}>Carregando...</div>
      ) : lojas.length === 0 ? (
        <div className="card p-16 text-center"><p className="text-sm" style={{ color: "var(--text-3)" }}>Nenhuma vinoteca cadastrada ainda.</p></div>
      ) : (
        <div className="space-y-3">
          {lojas.map((loja) => (
            <div key={loja.id}>
              {editingId === loja.id ? (
                <LojaForm initial={loja} onSave={(data) => handleEdit(loja.id, data)} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="card overflow-hidden" style={{ borderLeft: `4px solid ${loja.cor_realce || "#6B21A8"}` }}>
                  {loja.banner_url && (
                    <div className="relative h-16 w-full overflow-hidden">
                      <Image src={loja.banner_url} alt="banner" fill className="object-cover" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${loja.cor_realce}80, transparent)` }} />
                    </div>
                  )}
                  <div className="p-4 flex items-center gap-4">
                    {loja.logo_url ? (
                      <img src={loja.logo_url} alt={loja.nome} className="w-11 h-11 rounded-xl object-contain" style={{ background: "var(--surface-2)" }} />
                    ) : (
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold" style={{ background: loja.cor_realce || "#6B21A8" }}>{loja.nome[0]}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{loja.nome}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-3)" }}>{loja.dominio_customizado || `/catalogo/${loja.slug}`}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleToggle(loja)} className={`badge ${loja.ativo ? "badge-green" : "badge-gray"} cursor-pointer`}>{loja.ativo ? "Ativo" : "Inativo"}</button>
                      <button onClick={() => { setEditingId(loja.id); setShowForm(false); }} className="btn-ghost p-2"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(loja.id)} className="btn-ghost p-2" style={{ color: "var(--text-3)" }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-2)" }}>
                      <Wine className="w-3.5 h-3.5" style={{ color: loja.cor_realce }} />
                      <span className="font-semibold" style={{ color: "var(--text-1)" }}>{loja.total_vinhos ?? 0}</span> vinhos
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-2)" }}>
                      Login: <code className="px-1.5 py-0.5 rounded font-mono text-[11px]" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>{loja.slug}</code>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-2)" }}>
                      Senha: <code className="px-1.5 py-0.5 rounded font-mono text-[11px]" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                        {showSenha[loja.id] ? loja.senha_cliente : "••••••••"}
                      </code>
                      <button onClick={() => setShowSenha((p) => ({ ...p, [loja.id]: !p[loja.id] }))} className="btn-ghost p-1">
                        {showSenha[loja.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button onClick={() => copyText(loja.senha_cliente, `senha-${loja.id}`)} className="btn-ghost p-1">
                        {copied === `senha-${loja.id}` ? <Check className="w-3 h-3" style={{ color: "#1a7a4a" }} /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center gap-2 flex-wrap" style={{ borderTop: "1px solid var(--border)" }}>
                    <a href={getCatalogoUrl(loja)} target="_blank" className="btn-outline text-xs py-1.5"><ExternalLink className="w-3.5 h-3.5" /> Ver catálogo</a>
                    <a href={`/minha-loja/${loja.slug}`} target="_blank" className="btn-outline text-xs py-1.5"><LayoutDashboard className="w-3.5 h-3.5" /> Painel do cliente</a>
                    <button onClick={() => copyText(`${window.location.origin}/catalogo/${loja.slug}`, `link-${loja.id}`)} className="btn-ghost text-xs py-1.5">
                      {copied === `link-${loja.id}` ? <><Check className="w-3.5 h-3.5" style={{ color: "#1a7a4a" }} /> Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar link</>}
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
