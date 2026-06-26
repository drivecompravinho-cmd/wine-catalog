"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Grape, RefreshCw, ShoppingCart, Plus, Minus, X, Trash2, MessageCircle, Tag, Instagram, Facebook, Navigation } from "lucide-react";
import type { ItemCatalogo } from "@/types";

interface CatalogData {
  loja: {
    nome: string; logo_url: string | null; banner_url?: string | null; slug: string; cor_realce: string;
    whatsapp: string | null; instagram?: string | null; facebook?: string | null;
    endereco_url?: string | null; descricao?: string | null;
  };
  itens: ItemCatalogo[];
}
interface CartItem extends ItemCatalogo { qty: number; }

function priceNum(p: string) { return parseFloat(p.replace(",", ".").replace(/[^0-9.]/g, "")) || 0; }
function fmt(p: string) {
  const n = priceNum(p);
  return isNaN(n) ? p : n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function effectivePrice(item: ItemCatalogo) {
  return item.preco_oferta && priceNum(item.preco_oferta) > 0 && priceNum(item.preco_oferta) < priceNum(item.preco) ? item.preco_oferta : item.preco;
}
function hasOffer(item: ItemCatalogo) {
  return !!(item.preco_oferta && priceNum(item.preco_oferta) > 0 && priceNum(item.preco_oferta) < priceNum(item.preco));
}
function discount(item: ItemCatalogo) {
  return hasOffer(item) ? Math.round((1 - priceNum(item.preco_oferta!) / priceNum(item.preco)) * 100) : 0;
}

export default function CatalogoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/catalogo/${slug}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError("Catálogo não encontrado."); }
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { fetchCatalog(); }, [fetchCatalog]);

  const cor = data?.loja.cor_realce || "#6B21A8";

  const filtered = (data?.itens ?? []).filter((item) => {
    const q = search.toLowerCase();
    const match = !q || item.nome.toLowerCase().includes(q) || (item.produtor ?? "").toLowerCase().includes(q) || (item.uva ?? "").toLowerCase().includes(q);
    const uva = (item.uva ?? "").toLowerCase(), nome = item.nome.toLowerCase();
    const type = filter === "todos" ||
      (filter === "tinto" && (uva.match(/malbec|cabernet|merlot|syrah|tinto|tempranillo|bonarda/))) ||
      (filter === "branco" && (uva.match(/chardonnay|sauvignon|riesling|branco|torront/))) ||
      (filter === "rose" && nome.match(/ros[eé]/)) ||
      (filter === "espumante" && nome.match(/espumante|prosecco|champagne|cava|crémant/));
    return match && type;
  });

  const ofertas = (data?.itens ?? []).filter(hasOffer);

  function addToCart(nome: string) {
    setCart(prev => {
      const max = data?.itens.find(i => i.nome === nome)?.estoque ?? 99;
      return (prev[nome] ?? 0) >= max ? prev : { ...prev, [nome]: (prev[nome] ?? 0) + 1 };
    });
  }
  function removeFromCart(nome: string) {
    setCart(prev => {
      if ((prev[nome] ?? 0) <= 1) { const { [nome]: _, ...r } = prev; return r; }
      return { ...prev, [nome]: prev[nome] - 1 };
    });
  }
  function clearItem(nome: string) { setCart(prev => { const { [nome]: _, ...r } = prev; return r; }); }

  const cartItems: CartItem[] = useMemo(() =>
    Object.entries(cart).map(([nome, qty]) => {
      const item = data?.itens.find(i => i.nome === nome);
      return item ? { ...item, qty } : null;
    }).filter((i): i is CartItem => i !== null), [cart, data]);

  const cartTotal = cartItems.reduce((s, i) => s + priceNum(effectivePrice(i)) * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  function sendWpp() {
    if (!data?.loja.whatsapp) return;
    const lines = [`Olá! Segue minha lista de compras da *${data.loja.nome}*:`, ""];
    cartItems.forEach(i => lines.push(`• ${i.qty}x ${i.nome} — ${fmt(effectivePrice(i))}`));
    lines.push("", `*Total: ${fmt(cartTotal.toString())}*`);
    window.open(`https://wa.me/${data.loja.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("
"))}`, "_blank");
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f4f4f6" }}>
      <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: "#6B21A8", borderTopColor: "transparent" }} />
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f4f4f6" }}>
      <p style={{ color: "#6b7280" }}>{error}</p>
    </div>
  );

  const filters = [
    { key: "todos", label: "Todos" },
    { key: "tinto", label: "Tinto" },
    { key: "branco", label: "Branco" },
    { key: "rose", label: "Rosé" },
    { key: "espumante", label: "Espumante" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f4f4f6" }}>

      {/* ── HERO ── */}
      <div className="relative w-full" style={{ height: 220 }}>
        {data?.loja.banner_url
          ? <Image src={data.loja.banner_url} alt="" fill className="object-cover" priority />
          : <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${cor}CC, ${cor}55)` }} />}
        {/* bottom fade */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
        {/* accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: cor }} />
        {/* refresh */}
        <button onClick={fetchCatalog} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── PROFILE CARD ── glassmorphism */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative -mt-14 z-10 rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.6) inset",
          }}>
          <div className="px-6 pt-5 pb-5 flex items-center gap-5">
            {/* Avatar */}
            <div className="shrink-0 rounded-full overflow-hidden"
              style={{ width: 72, height: 72, border: "2.5px solid white", boxShadow: `0 0 0 2px ${cor}55, 0 4px 16px rgba(0,0,0,0.18)`, background: cor }}>
              {data?.loja.logo_url
                ? <div className="relative w-full h-full"><Image src={data.loja.logo_url} alt="" fill className="object-cover" /></div>
                : <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold font-display">{data?.loja.nome[0]}</div>}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-lg leading-tight truncate" style={{ color: "#111" }}>{data?.loja.nome}</h1>
              {data?.loja.descricao && <p className="text-xs mt-0.5 truncate" style={{ color: "#9ca3af" }}>{data.loja.descricao}</p>}
            </div>

            {/* Social actions */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {data?.loja.whatsapp && (
                <a href={`https://api.whatsapp.com/send/?phone=${data.loja.whatsapp.replace(/\D/g, "")}&text=${encodeURIComponent("Olá! Vim do CompraVinho e quero mais informações.")}&type=phone_number&app_absent=0`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-85 hover:scale-105"
                  style={{ background: "#25D366", boxShadow: "0 2px 8px #25D36640" }}>
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
              )}
              {data?.loja.instagram && (
                <a href={data.loja.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#374151" }}>
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {data?.loja.facebook && (
                <a href={data.loja.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#374151" }}>
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {data?.loja.endereco_url && (
                <a href={data.loja.endereco_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#374151" }}>
                  <Navigation className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-24">

        {/* Ofertas */}
        {ofertas.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-3.5 h-3.5" style={{ color: cor }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: cor }}>Ofertas</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
              {ofertas.map((item, i) => (
                <div key={i} className="shrink-0 w-40">
                  <WineCard item={item} cor={cor} qty={cart[item.nome] ?? 0} onAdd={() => addToCart(item.nome)} onRemove={() => removeFromCart(item.nome)} compact />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
            <input className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none transition-all"
              placeholder="Buscar vinho, uva ou produtor..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.08)", color: "#111" }}
              onFocus={e => { e.target.style.background = "#fff"; e.target.style.boxShadow = `0 0 0 2px ${cor}30`; }}
              onBlur={e => { e.target.style.background = "rgba(255,255,255,0.8)"; e.target.style.boxShadow = "none"; }} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {filters.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="px-4 py-2.5 rounded-2xl text-xs font-medium transition-all"
                style={filter === f.key
                  ? { background: cor, color: "#fff", boxShadow: `0 2px 8px ${cor}40` }
                  : { background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.08)", color: "#6b7280" }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs mb-4" style={{ color: "#9ca3af" }}>
          {filtered.length} {filtered.length === 1 ? "vinho disponível" : "vinhos disponíveis"}
        </p>

        {filtered.length === 0
          ? <div className="text-center py-20"><span className="text-4xl mb-3 block opacity-30">🍾</span><p className="text-sm" style={{ color: "#9ca3af" }}>Nenhum vinho encontrado.</p></div>
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((item, i) => (
                <WineCard key={i} item={item} cor={cor} qty={cart[item.nome] ?? 0} onAdd={() => addToCart(item.nome)} onRemove={() => removeFromCart(item.nome)} />
              ))}
            </div>
        }

        <p className="text-center text-xs mt-12" style={{ color: "#d1d5db" }}>
          Atualizado em {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* ── CART BUTTON ── */}
      {cartCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95"
          style={{ background: cor, boxShadow: `0 8px 32px ${cor}60` }}>
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-white rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ color: cor, minWidth: 18, height: 18 }}>{cartCount}</span>
          </div>
          {fmt(cartTotal.toString())}
        </button>
      )}

      {/* ── CART PANEL ── */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }} onClick={() => setCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 flex flex-col"
            style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)", borderLeft: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: cor + "18" }}>
                  <ShoppingCart className="w-4 h-4" style={{ color: cor }} />
                </div>
                <span className="font-semibold text-base" style={{ color: "#111" }}>Minha lista</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.05)", color: "#6b7280" }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cartItems.length === 0
                ? <div className="text-center py-16"><span className="text-3xl opacity-20 mb-2 block">🛒</span><p className="text-sm" style={{ color: "#9ca3af" }}>Nenhum item ainda.</p></div>
                : cartItems.map(item => (
                  <div key={item.nome} className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="relative w-12 h-14 shrink-0 rounded-xl overflow-hidden" style={{ background: "#f3f4f6" }}>
                      {item.imagem_url
                        ? <Image src={item.imagem_url} alt={item.nome} fill className="object-contain p-1" />
                        : <div className="absolute inset-0 flex items-center justify-center text-lg opacity-20">🍷</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-2 leading-tight" style={{ color: "#111" }}>{item.nome}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: cor }}>{fmt(effectivePrice(item))}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => removeFromCart(item.nome)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: "rgba(0,0,0,0.06)", color: "#374151" }}><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-semibold w-4 text-center" style={{ color: "#111" }}>{item.qty}</span>
                        <button onClick={() => addToCart(item.nome)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: cor + "18", color: cor }}><Plus className="w-3 h-3" /></button>
                        <button onClick={() => clearItem(item.nome)} className="ml-auto" style={{ color: "#d1d5db" }}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {cartItems.length > 0 && (
              <div className="px-6 py-5 space-y-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: "#6b7280" }}>Total estimado</span>
                  <span className="font-display text-xl font-bold" style={{ color: "#111" }}>{fmt(cartTotal.toString())}</span>
                </div>
                <p className="text-[11px] text-center pb-1" style={{ color: "#9ca3af" }}>
                  Envie sua lista de compras pelo WhatsApp
                </p>
                {data?.loja.whatsapp
                  ? <button onClick={sendWpp} className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style={{ background: "#25D366", boxShadow: "0 4px 16px #25D36640" }}>
                      <MessageCircle className="w-4 h-4" /> Enviar lista pelo WhatsApp
                    </button>
                  : <p className="text-xs text-center" style={{ color: "#9ca3af" }}>WhatsApp não configurado para esta vinoteca.</p>}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WineCard({ item, cor, qty, onAdd, onRemove, compact }: {
  item: ItemCatalogo; cor: string; qty: number; onAdd: () => void; onRemove: () => void; compact?: boolean;
}) {
  const offer = hasOffer(item);
  const disc = discount(item);
  const accent = offer ? "#b91c1c" : cor;

  return (
    <div className="group flex flex-col h-full rounded-xl overflow-hidden transition-all duration-200"
      style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.09), 0 0 0 1px ${cor}25`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)"; }}>

      {/* Image — compact, no excess padding */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "2/3", background: "#f8f8f8" }}>
        {item.imagem_url
          ? <Image src={item.imagem_url} alt={item.nome} fill className="object-contain p-2 transition-transform duration-400 group-hover:scale-[1.05]" />
          : <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl opacity-10">🍷</span></div>}

        {/* Badges */}
        {offer && (
          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white"
            style={{ background: "#b91c1c" }}>-{disc}%</div>
        )}
        {!offer && item.estoque <= 5 && item.estoque > 0 && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
            style={{ background: "rgba(255,255,255,0.92)", color: cor, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {item.estoque} un
          </div>
        )}


      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-2.5 py-2 gap-1.5">
        <p className="text-[11px] font-semibold leading-tight line-clamp-2" style={{ color: "#111" }}>{item.nome}</p>
        {!compact && item.uva && (
          <p className="text-[9px] font-medium truncate" style={{ color: "#bbb" }}>{item.uva}{item.pais ? ` · ${item.pais}` : ""}</p>
        )}

        <div className="mt-auto pt-1.5 flex items-center justify-between" style={{ borderTop: "1px solid #f3f3f3" }}>
          <div>
            {offer ? (
              <>
                <p className="text-[9px] line-through leading-none" style={{ color: "#ddd" }}>{fmt(item.preco)}</p>
                <p className="text-xs font-bold font-display" style={{ color: accent }}>{fmt(item.preco_oferta!)}</p>
              </>
            ) : (
              <p className="text-xs font-bold font-display" style={{ color: accent }}>{fmt(item.preco)}</p>
            )}
          </div>
          {!compact && <p className="text-[9px]" style={{ color: "#e0e0e0" }}>{item.estoque} un</p>}
        </div>

        {/* Cart control */}
        {qty === 0
          ? <button onClick={onAdd}
              className="w-full py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all active:scale-95 flex items-center justify-center gap-1"
              style={{ background: accent }}>
              <Plus className="w-3 h-3" /> Adicionar
            </button>
          : <div className="flex items-center justify-between rounded-lg py-1 px-1.5"
              style={{ background: accent + "10", border: `1px solid ${accent}20` }}>
              <button onClick={onRemove} className="w-5 h-5 rounded-md flex items-center justify-center" style={{ color: accent }}><Minus className="w-2.5 h-2.5" /></button>
              <span className="text-[11px] font-bold" style={{ color: accent }}>{qty}</span>
              <button onClick={onAdd} className="w-5 h-5 rounded-md flex items-center justify-center" style={{ color: accent }}><Plus className="w-2.5 h-2.5" /></button>
            </div>}
      </div>
    </div>
  );
}
