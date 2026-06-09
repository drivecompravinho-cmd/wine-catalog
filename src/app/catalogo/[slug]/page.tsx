"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Grape, RefreshCw } from "lucide-react";
import type { ItemCatalogo } from "@/types";

interface CatalogData {
  loja: { nome: string; logo_url: string | null; slug: string };
  itens: ItemCatalogo[];
}

export default function CatalogoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "tinto" | "branco" | "rose" | "espumante">("todos");

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/catalogo/${slug}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      setError("Catálogo não encontrado ou indisponível.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchCatalog(); }, [fetchCatalog]);

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

  function formatPrice(preco: string) {
    const num = parseFloat(preco.replace(",", ".").replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return preco;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-wine-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-sm">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center max-w-sm">
          <span className="text-4xl mb-4 block">🍷</span>
          <p className="text-stone-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          {data?.loja.logo_url ? (
            <div className="relative w-10 h-10 shrink-0">
              <Image src={data.loja.logo_url} alt={data.loja.nome} fill className="object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-wine-800 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-display font-bold">{data?.loja.nome[0]}</span>
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-display text-lg font-semibold text-stone-900 leading-tight">
              {data?.loja.nome}
            </h1>
            <p className="text-xs text-stone-400">Catálogo atualizado em tempo real</p>
          </div>
          <button
            onClick={fetchCatalog}
            className="p-2 text-stone-400 hover:text-wine-700 transition-colors"
            title="Atualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              className="input pl-9"
              placeholder="Buscar vinho, uva ou produtor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["todos", "tinto", "branco", "rose", "espumante"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                  filter === f
                    ? "bg-wine-800 text-white"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-wine-300"
                }`}
              >
                {f === "rose" ? "Rosé" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-stone-400 mb-4">
          {filteredItens.length} {filteredItens.length === 1 ? "vinho disponível" : "vinhos disponíveis"}
        </p>

        {/* Grid */}
        {filteredItens.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <span className="text-4xl mb-3 block">🍾</span>
            <p className="text-sm">Nenhum vinho encontrado para essa busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItens.map((item, i) => (
              <div key={i} className="card group hover:shadow-md transition-shadow duration-200">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-gradient-to-b from-stone-50 to-stone-100 overflow-hidden">
                  {item.imagem_url ? (
                    <Image
                      src={item.imagem_url}
                      alt={item.nome}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl opacity-30">🍷</span>
                    </div>
                  )}
                  {/* Stock badge */}
                  {item.estoque <= 5 && (
                    <div className="absolute top-2 left-2 bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded-full border border-amber-200">
                      Últimas {item.estoque} un.
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-stone-800 leading-tight line-clamp-2">{item.nome}</p>
                  {item.produtor && (
                    <p className="text-[11px] text-stone-400 mt-0.5 truncate">{item.produtor}</p>
                  )}

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.uva && (
                      <span className="flex items-center gap-1 text-[10px] text-wine-700 bg-wine-50 px-1.5 py-0.5 rounded-full">
                        <Grape className="w-2.5 h-2.5" /> {item.uva}
                      </span>
                    )}
                    {item.pais && (
                      <span className="flex items-center gap-1 text-[10px] text-stone-500">
                        <MapPin className="w-2.5 h-2.5" /> {item.pais}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <p className="font-display text-base font-semibold text-wine-800">
                      {formatPrice(item.preco)}
                    </p>
                    <p className="text-[10px] text-stone-400">{item.estoque} un.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-stone-300 mt-12 pb-4">
          Preços e disponibilidade atualizados pelo vendedor · {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>
    </div>
  );
}
