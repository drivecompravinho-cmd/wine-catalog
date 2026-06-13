"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Grape, RefreshCw, ShoppingCart, Plus, Minus, X, Trash2, MessageCircle, Tag } from "lucide-react";
import type { ItemCatalogo } from "@/types";

interface CatalogData {
  loja: { nome: string; logo_url: string | null; slug: string; cor_realce: string; whatsapp: string | null };
  itens: ItemCatalogo[];
}

interface CartItem extends ItemCatalogo {
  qty: number;
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
    } catch {
      setError("Catálogo não encontrado ou indisponível.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchCatalog(); }, [fetchCatalog]);

  const cor = data?.loja.cor_realce || "#6B21A8";

  const filteredItens = (data?.itens ?? []).filter((item) => {
    const matchSearch =
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      (item.produtor ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.uva ?? "").toLowerCase().includes(search.toLowerCase());

    const uva = (item.uva ?? "").toLowerCase();
    const nome = item.nome.toLowerCase();
    const matchFilter =
      filter === "todos" ||
      (filter === "tinto" && (uva.includes("malbec") || uva.includes("cabernet") || uva.includes("merlot") || uva.includes("syrah") || uva.includes("tempranillo") || uva.includes("tinto") || nome.includes("tinto"))) ||
      (filter === "branco" && (uva.includes("chardonnay") || uva.includes("sauvignon") || uva.includes("riesling") || uva.includes("branco") || nome.includes("branco"))) ||
      (filter === "rose" && (nome.includes("rosé") || nome.includes("rose"))) ||
      (filter === "espumante" && (nome.includes("espumante") || nome.includes("prosecco") || nome.includes("champagne") || nome.includes("cava")));

    return matchSearch && matchFilter;
  });

  const ofertas = (data?.itens ?? []).filter((item) => item.preco_oferta && priceNumStatic(item.preco_oferta) > 0 && priceNumStatic(item.preco_oferta) < priceNumStatic(item.preco));

  function priceNumStatic(preco: string) {
    return parseFloat(preco.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
  }

  function formatPrice(preco: string) {
    const num = parseFloat(preco.replace(",", ".").replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return preco;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function priceNum(preco: string) {
    return parseFloat(preco.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
  }

  function discountPercent(preco: string, oferta: string) {
    const p = priceNum(preco);
    const o = priceNum(oferta);
    if (!p || !o) return 0;
    return Math.round((1 - o / p) * 100);
  }

  function effectivePrice(item: ItemCatalogo) {
    return item.preco_oferta && priceNum(item.preco_oferta) > 0 && priceNum(item.preco_oferta) < priceNum(item.preco)
      ? item.preco_oferta
      : item.preco;
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
      if (current <= 1) {
        const { [nome]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [nome]: current - 1 };
    });
  }

  function clearCartItem(nome: string) {
    setCart((prev) => {
      const { [nome]: _, ...rest } = prev;
      return rest;
    });
  }

  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cart)
      .map(([nome, qty]) => {
        const item = data?.itens.find((i) => i.nome === nome);
        if (!item) return null;
        return { ...item, qty };
      })
      .filter((i): i is CartItem => i !== null);
  }, [cart, data]);

  const cartTotal = cartItems.reduce((sum, item) => sum + priceNum(effectivePrice(item)) * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  function buildWhatsappMessage() {
    const lines = [`Olá! Gostaria de fazer um pedido em *${data?.loja.nome}*:`, ""];
    cartItems.forEach((item) => {
      lines.push(`• ${item.qty}x ${item.nome} — ${formatPrice(effectivePrice(item))} cada`);
    });
    lines.push("");
    lines.push(`*Total: ${formatPrice(cartTotal.toString())}*`);
    return lines.join("\n");
  }

  function sendToWhatsapp() {
    if (!data?.loja.whatsapp) return;
    const phone = data.loja.whatsapp.replace(/\D/g, "");
    const msg = encodeURIComponent(buildWhatsappMessage());
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#6B21A8", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--text-3)" }}>Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
        <div className="text-center max-w-sm">
          <span className="text-4xl mb-4 block">🍷</span>
          <p className="font-medium" style={{ color: "var(--text-2)" }}>{error}</p>
        </div>
      </div>
    );
  }

  const filters = ["todos", "tinto", "branco", "rose", "espumante"];

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-2)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          {data?.loja.logo_url ? (
            <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden" style={{ background: "var(--surface-2)" }}>
              <Image src={data.loja.logo_url} alt={data.loja.nome} fill className="object-contain p-1" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold" style={{ background: cor }}>
              {data?.loja.nome[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg font-semibold leading-tight truncate" style={{ color: "var(--text-1)" }}>{data?.loja.nome}</h1>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>Catálogo atualizado em tempo real</p>
          </div>
          <button onClick={fetchCatalog} className="btn-ghost p-2 shrink-0" title="Atualizar">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="h-0.5" style={{ background: cor }} />
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Ofertas em destaque */}
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
                <div key={i} className="shrink-0 w-40">
                  <WineCard item={item} cor={cor} qty={cart[item.nome] ?? 0} onAdd={() => addToCart(item.nome)} onRemove={() => removeFromCart(item.nome)} compact />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

        <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>
          {filteredItens.length} {filteredItens.length === 1 ? "vinho disponível" : "vinhos disponíveis"}
        </p>

        {filteredItens.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--text-3)" }}>
            <span className="text-4xl mb-3 block">🍾</span>
            <p className="text-sm">Nenhum vinho encontrado para essa busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItens.map((item, i) => <WineCard key={i} item={item} cor={cor} qty={cart[item.nome] ?? 0} onAdd={() => addToCart(item.nome)} onRemove={() => removeFromCart(item.nome)} />)}
          </div>
        )}

        <p className="text-center text-xs mt-12 pb-4" style={{ color: "var(--text-3)" }}>
          Preços e disponibilidade atualizados pelo vendedor · {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full text-white font-medium text-sm shadow-lg transition-transform hover:scale-105"
          style={{ background: cor, boxShadow: `0 8px 24px ${cor}50` }}>
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-4.5 h-4.5 rounded-full bg-white text-[10px] font-bold flex items-center justify-center" style={{ color: cor, minWidth: 18, height: 18 }}>
              {cartCount}
            </span>
          </div>
          {formatPrice(cartTotal.toString())}
        </button>
      )}

      {/* Cart side panel */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} onClick={() => setCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col" style={{ background: "var(--surface)", boxShadow: "var(--shadow-lg)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" style={{ color: cor }} />
                <h2 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>Seu carrinho</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-3 block">🛒</span>
                  <p className="text-sm" style={{ color: "var(--text-3)" }}>Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.nome} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--surface-2)" }}>
                      <div className="relative w-12 h-14 shrink-0 rounded-lg overflow-hidden" style={{ background: "var(--surface-3)" }}>
                        {item.imagem_url ? (
                          <Image src={item.imagem_url} alt={item.nome} fill className="object-contain p-1" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-xl opacity-30">🍷</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-tight line-clamp-2" style={{ color: "var(--text-1)" }}>{item.nome}</p>
                        <p className="text-xs font-semibold mt-1" style={{ color: cor }}>{formatPrice(item.preco)}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => removeFromCart(item.nome)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                            <Minus className="w-3 h-3" style={{ color: "var(--text-2)" }} />
                          </button>
                          <span className="text-xs font-medium w-4 text-center" style={{ color: "var(--text-1)" }}>{item.qty}</span>
                          <button onClick={() => addToCart(item.nome)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                            <Plus className="w-3 h-3" style={{ color: "var(--text-2)" }} />
                          </button>
                          <button onClick={() => clearCartItem(item.nome)} className="ml-auto p-1" style={{ color: "var(--text-3)" }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>Total</span>
                  <span className="font-display text-xl font-semibold" style={{ color: cor }}>{formatPrice(cartTotal.toString())}</span>
                </div>
                {data?.loja.whatsapp ? (
                  <button onClick={sendToWhatsapp}
                    className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2"
                    style={{ background: "#25D366" }}>
                    <MessageCircle className="w-4 h-4" /> Finalizar pelo WhatsApp
                  </button>
                ) : (
                  <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>Esta vinoteca ainda não configurou o WhatsApp para pedidos.</p>
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
  function priceNum(preco: string) {
    return parseFloat(preco.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
  }
  function formatPrice(preco: string) {
    const num = priceNum(preco);
    if (isNaN(num)) return preco;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  const hasOffer = item.preco_oferta && priceNum(item.preco_oferta) > 0 && priceNum(item.preco_oferta) < priceNum(item.preco);
  const discount = hasOffer ? Math.round((1 - priceNum(item.preco_oferta!) / priceNum(item.preco)) * 100) : 0;

  return (
    <div className="card overflow-hidden group transition-all duration-200 hover:shadow-md flex flex-col h-full">
      <div className="relative aspect-[3/4]" style={{ background: "linear-gradient(to bottom, var(--surface-2), var(--surface-3))" }}>
        {item.imagem_url ? (
          <Image src={item.imagem_url} alt={item.nome} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl opacity-20">🍷</span></div>
        )}
        {hasOffer && (
          <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: "#dc2626" }}>
            -{discount}%
          </div>
        )}
        {!hasOffer && item.estoque <= 5 && (
          <div className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: cor + "15", color: cor, border: `1px solid ${cor}30` }}>
            Últimas {item.estoque} un.
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <p className="text-xs font-semibold leading-tight line-clamp-2" style={{ color: "var(--text-1)" }}>{item.nome}</p>
        {item.produtor && !compact && <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-3)" }}>{item.produtor}</p>}

        {!compact && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {item.uva && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: cor + "10", color: cor }}>
                <Grape className="w-2.5 h-2.5" /> {item.uva}
              </span>
            )}
            {item.pais && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-3)" }}>
                <MapPin className="w-2.5 h-2.5" /> {item.pais}
              </span>
            )}
          </div>
        )}

        <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <div>
            {hasOffer ? (
              <>
                <p className="text-[10px] line-through leading-none" style={{ color: "var(--text-3)" }}>{formatPrice(item.preco)}</p>
                <p className="font-display text-base font-semibold leading-tight" style={{ color: "#dc2626" }}>{formatPrice(item.preco_oferta!)}</p>
              </>
            ) : (
              <p className="font-display text-base font-semibold" style={{ color: cor }}>{formatPrice(item.preco)}</p>
            )}
          </div>
          {!compact && <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{item.estoque} un.</p>}
        </div>

        <div className="mt-2">
          {qty === 0 ? (
            <button onClick={onAdd}
              className="w-full py-1.5 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              style={{ background: hasOffer ? "#dc2626" : cor }}>
              <Plus className="w-3 h-3" /> Adicionar
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-lg overflow-hidden" style={{ background: (hasOffer ? "#dc2626" : cor) + "10" }}>
              <button onClick={onRemove} className="p-1.5 transition-colors" style={{ color: hasOffer ? "#dc2626" : cor }}><Minus className="w-3.5 h-3.5" /></button>
              <span className="text-xs font-semibold" style={{ color: hasOffer ? "#dc2626" : cor }}>{qty}</span>
              <button onClick={onAdd} className="p-1.5 transition-colors" style={{ color: hasOffer ? "#dc2626" : cor }}><Plus className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
