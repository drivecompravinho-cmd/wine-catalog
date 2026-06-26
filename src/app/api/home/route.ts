import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServiceClient();

  // Get active stores
  const { data: lojas } = await supabase
    .from("lojas")
    .select("id, nome, slug, logo_url, cor_realce, descricao")
    .eq("ativo", true)
    .order("created_at", { ascending: false });

  // Get wines on offer
  const { data: ofertas } = await supabase
    .from("catalogo_itens")
    .select("preco, preco_oferta, loja_id, vinhos(nome, uva, pais, imagem_url), lojas(slug, nome, cor_realce)")
    .not("preco_oferta", "is", null)
    .gt("estoque", 0)
    .eq("ativo", true)
    .limit(8);

  return NextResponse.json({
    lojas: lojas ?? [],
    ofertas: (ofertas ?? []).filter((o) => {
      const p = parseFloat(String(o.preco).replace(",", ".")) || 0;
      const op = parseFloat(String(o.preco_oferta).replace(",", ".")) || 0;
      return op > 0 && op < p;
    }),
  });
}
