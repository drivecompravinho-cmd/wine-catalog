"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Grape, RefreshCw, ShoppingCart, Plus, Minus, X, Trash2, MessageCircle, Tag, Instagram, Facebook, Navigation } from "lucide-react";
import type { ItemCatalogo } from "@/types";

interface CatalogData {
  loja: {
    nome: string; logo_url: string | null; banner_url?: string | null; slug: string; cor_realce: string; whatsapp: string | null;
    instagram?: string | null; facebook?: string | null; endereco_url?: string | null; descricao?: string | null;
  };
  itens: ItemCatalogo[];
}

interface CartItem extends ItemCatalogo { qty: number; }

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
    } catch { setError("Catálogo não encontrado ou indisponível."); }
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { fetchCatalog(); }, [fetchCatalog]);

  const cor = data?.loja.cor_realce || "#6B21A8";

  const filteredItens = (data?.itens ?? []).filter((item) => {
    const matchSearch = item.nome.toLowerCase().includes(search.toLowerCase()) ||
      (item.produtor ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.uva ?? "").toLowerCase().includes(search.toLowerCase());
    const uva = (item.uva ?? "").toLowerCase();
    const nome = item.nome.toLowerCase();
    const matchFilter = filter === "todos" ||
      (filter === "tinto" && (uva.includes("malbec") || uva.includes("cabernet") || uva.includes("merlot") || uva.includes("syrah") || uva.includes("tinto") || nome.includes("tinto"))) ||
      (filter === "branco" && (uva.includes("chardonnay") || uva.includes("sauvignon") || uva.includes("riesling") || uva.includes("branco") || nome.includes("branco"))) ||
      (filter === "rose" && (nome.includes("rosé") || nome.includes("rose"))) ||
      (filter === "espumante" && (nome.includes("espumante") || nome.includes("prosecco") || nome.includes("champagne") || nome.includes("cava")));
    return matchSearch && matchFilter;
  });

  const ofertas = (data?.itens ?? []).filter((item) => {
    const pn = (p: string) => parseFloat(p.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
    return item.preco_oferta && pn(item.preco_oferta) > 0 && pn(item.preco_oferta) < pn(item.preco);
  });

  function priceNum(preco: string) { return parseFloat(preco.replace(",", ".").replace(/[^0-9.]/g, "")) || 0; }
  function formatPrice(preco: string) {
    const num = priceNum(preco);
    return isNaN(num) ? preco : num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function effectivePrice(item: ItemCatalogo) {
    return item.preco_oferta && priceNum(item.preco_oferta) > 0 && priceNum(item.preco_oferta) < priceNum(item.preco) ? item.preco_oferta : item.preco;
  }

  function addToCart(nome: string) {
    setCart((prev) => {
      const item = data?.itens.find((i) => i.nome === nome);
      const max = item?.estoque ?? 99;
      const current = prev[nome] ?? 0;
      if (current >= max) return prev;
      return { ...prev, [nome]: current + 1 };
    });
  }
  function removeFromCart(nome: string) {
    setCart((prev) => {
      const current = prev[nome] ?? 0;
      if (current <= 1) { const { [nome]: _, ...rest } = prev; return rest; }
      return { ...prev, [nome]: current - 1 };
    });
  }
  function clearCartItem(nome: string) {
    setCart((prev) => { const { [nome]: _, ...rest } = prev; return rest; });
  }

  const cartItems: CartItem[] = useMemo(() => Object.entries(cart).map(([nome, qty]) => {
    const item = data?.itens.find((i) => i.nome === nome);
    if (!item) return null;
    return { ...item, qty };
  }).filter((i): i is CartItem => i !== null), [cart, data]);

  const cartTotal = cartItems.reduce((sum, item) => sum + priceNum(effectivePrice(item)) * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  function sendToWhatsapp() {
    if (!data?.loja.whatsapp) return;
    const phone = data.loja.whatsapp.replace(/\D/g, "");
    const lines = [`Olá! Gostaria de fazer um pedido em *${data.loja.nome}*:`, ""];
    cartItems.forEach((item) => lines.push(`• ${item.qty}x ${item.nome} — ${formatPrice(effectivePrice(item))} cada`));
    lines.push("", `*Total: ${formatPrice(cartTotal.toString())}*`);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#6B21A8", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "var(--text-3)" }}>Carregando catálogo...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
      <div className="text-center"><span className="text-4xl mb-4 block">🍷</span><p style={{ color: "var(--text-2)" }}>{error}</p></div>
    </div>
  );

  const filters = ["todos", "tinto", "branco", "rose", "espumante"];

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-2)" }}>
      {/* Hero — banner + identity sobreposta */}
      <div className="relative w-full overflow-hidden" style={{ height: "280px" }}>
        {/* Background */}
        {data?.loja.banner_url ? (
          <Image src={data.loja.banner_url} alt="capa" fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${cor}EE 0%, ${cor}99 100%)` }} />
        )}

        {/* Gradiente para legibilidade */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)" }} />

        {/* Refresh */}
        <button onClick={fetchCatalog}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}>
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Social buttons — top right (below refresh) */}
        <div className="absolute top-4 right-16 flex items-center gap-2">
          {data?.loja.instagram && (
            <a href={data.loja.instagram} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}>
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {data?.loja.facebook && (
            <a href={data.loja.facebook} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}>
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {data?.loja.endereco_url && (
            <a href={data.loja.endereco_url} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}>
              <Navigation className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Identity — avatar + nome sobrepostos na imagem */}
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-6 flex items-end gap-5">
          {/* Avatar circular com borda branca */}
          <div className="shrink-0 rounded-full overflow-hidden"
            style={{
              width: 96, height: 96,
              border: "3px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              background: cor,
              flexShrink: 0,
            }}>
            {data?.loja.logo_url ? (
              <div className="relative w-full h-full">
                <Image src={data.loja.logo_url} alt={data?.loja.nome ?? ""} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold font-display">
                {data?.loja.nome[0]}
              </div>
            )}
          </div>

          {/* Nome + descrição sobre a imagem */}
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="font-display font-bold leading-tight text-white"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
              {data?.loja.nome}
            </h1>
            {data?.loja.descricao && (
              <p className="mt-1 text-sm leading-tight" style={{ color: "rgba(255,255,255,0.8)", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                {data.loja.descricao}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Spacer after hero */}
        <div className="h-5" />

        {/* Ofertas */}
        {ofertas.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: cor }}>
                <Tag className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-semibold text-white uppercase tracking-wide">Ofertas</span>
              </div>
              <span className="text-xs" style={{ color: "var(--text-3)" }}>{ofertas.length} vinho{ofertas.length !== 1 ? "s" : ""} com desconto</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "thin" }}>
              {ofertas.map((item, i) => (
                <div key={i} className="shrink-0 w-44">
                  <WineCard item={item} cor={cor} qty={cart[item.nome] ?? 0} onAdd={() => addToCart(item.nome)} onRemove={() => removeFromCart(item.nome)} compact />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-3)" }} />
            <input className="input pl-9" placeholder="Buscar vinho, uva ou produtor..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize"
                style={filter === f ? { background: cor, color: "#fff" } : { background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text-2)" }}>
                {f === "rose" ? "Rosé" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>{filteredItens.length} {filteredItens.length === 1 ? "vinho disponível" : "vinhos disponíveis"}</p>

        {filteredItens.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--text-3)" }}>
            <span className="text-4xl mb-3 block">🍾</span>
            <p className="text-sm">Nenhum vinho encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItens.map((item, i) => (
              <WineCard key={i} item={item} cor={cor} qty={cart[item.nome] ?? 0} onAdd={() => addToCart(item.nome)} onRemove={() => removeFromCart(item.nome)} />
            ))}
          </div>
        )}

        <p className="text-center text-xs mt-12 pb-6" style={{ color: "var(--text-3)" }}>
          Preços e disponibilidade atualizados pelo vendedor · {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* Floating cart */}
      {cartCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full text-white font-medium text-sm shadow-lg transition-transform hover:scale-105"
          style={{ background: cor, boxShadow: `0 8px 24px ${cor}50` }}>
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-white text-[10px] font-bold flex items-center justify-center rounded-full"
              style={{ color: cor, minWidth: 18, height: 18 }}>{cartCount}</span>
          </div>
          {formatPrice(cartTotal.toString())}
        </button>
      )}

      {/* Cart panel */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} onClick={() => setCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col" style={{ background: "var(--surface)", boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" style={{ color: cor }} />
                <h2 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>Seu carrinho</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12"><span className="text-4xl mb-3 block">🛒</span><p className="text-sm" style={{ color: "var(--text-3)" }}>Carrinho vazio.</p></div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.nome} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--surface-2)" }}>
                      <div className="relative w-12 h-14 shrink-0 rounded-lg overflow-hidden" style={{ background: "var(--surface-3)" }}>
                        {item.imagem_url ? <Image src={item.imagem_url} alt={item.nome} fill className="object-contain p-1" /> : <div className="absolute inset-0 flex items-center justify-center text-xl opacity-30">🍷</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2" style={{ color: "var(--text-1)" }}>{item.nome}</p>
                        <p className="text-xs font-semibold mt-1" style={{ color: cor }}>{formatPrice(effectivePrice(item))}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => removeFromCart(item.nome)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-medium w-4 text-center">{item.qty}</span>
                          <button onClick={() => addToCart(item.nome)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}><Plus className="w-3 h-3" /></button>
                          <button onClick={() => clearCartItem(item.nome)} className="ml-auto p-1" style={{ color: "var(--text-3)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-5 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>Total</span>
                  <span className="font-display text-xl font-semibold" style={{ color: cor }}>{formatPrice(cartTotal.toString())}</span>
                </div>
                {data?.loja.whatsapp ? (
                  <button onClick={sendToWhatsapp} className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2" style={{ background: "#25D366" }}>
                    <MessageCircle className="w-4 h-4" /> Finalizar pelo WhatsApp
                  </button>
                ) : (
                  <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>WhatsApp não configurado para esta vinoteca.</p>
                )}
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
  function priceNum(preco: string) { return parseFloat(preco.replace(",", ".").replace(/[^0-9.]/g, "")) || 0; }
  function formatPrice(preco: string) {
    const num = priceNum(preco);
    return isNaN(num) ? preco : num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  const hasOffer = item.preco_oferta && priceNum(item.preco_oferta) > 0 && priceNum(item.preco_oferta) < priceNum(item.preco);
  const discount = hasOffer ? Math.round((1 - priceNum(item.preco_oferta!) / priceNum(item.preco)) * 100) : 0;
  const accent = hasOffer ? "#dc2626" : cor;

  return (
    <div className="group rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 24px ${cor}1a`; e.currentTarget.style.borderColor = cor + "40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div className="relative aspect-[3/4]" style={{ background: `radial-gradient(circle at 50% 30%, ${cor}08, var(--surface-2))` }}>
        {item.imagem_url ? (
          <Image src={item.imagem_url} alt={item.nome} fill className="object-contain p-4 group-hover:scale-[1.06] transition-transform duration-500 ease-out" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl opacity-15">🍷</span></div>
        )}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
          {!hasOffer && item.estoque <= 5 ? (
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.85)", color: cor, border: `1px solid ${cor}30` }}>Últimas {item.estoque}</span>
          ) : <span />}
          {hasOffer && <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: "#dc2626" }}>-{discount}%</span>}
        </div>
        {!compact && (item.uva) && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.85)", color: cor }}>
              <Grape className="w-2.5 h-2.5" /> {item.uva}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-xs font-semibold leading-snug line-clamp-2" style={{ color: "var(--text-1)" }}>{item.nome}</p>
        {item.produtor && !compact && <p className="text-[11px] mt-1 truncate" style={{ color: "var(--text-3)" }}>{item.produtor}{item.pais ? ` · ${item.pais}` : ""}</p>}
        <div className="mt-auto">
          <div className="mt-3 pt-3 flex items-end justify-between gap-2" style={{ borderTop: "1px dashed var(--border)" }}>
            <div>
              {hasOffer ? (
                <>
                  <p className="text-[10px] line-through" style={{ color: "var(--text-3)" }}>{formatPrice(item.preco)}</p>
                  <p className="font-display text-base font-bold" style={{ color: accent }}>{formatPrice(item.preco_oferta!)}</p>
                </>
              ) : (
                <p className="font-display text-base font-bold" style={{ color: accent }}>{formatPrice(item.preco)}</p>
              )}
            </div>
            {!compact && <p className="text-[10px] pb-0.5" style={{ color: "var(--text-3)" }}>{item.estoque} un.</p>}
          </div>
          <div className="mt-2.5">
            {qty === 0 ? (
              <button onClick={onAdd} className="w-full py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all" style={{ background: accent }}>
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-xl overflow-hidden" style={{ background: accent + "12", border: `1px solid ${accent}25` }}>
                <button onClick={onRemove} className="p-2" style={{ color: accent }}><Minus className="w-3.5 h-3.5" /></button>
                <span className="text-xs font-bold" style={{ color: accent }}>{qty} no carrinho</span>
                <button onClick={onAdd} className="p-2" style={{ color: accent }}><Plus className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
