import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import type { ItemCatalogo } from "@/types";

interface VinhoJoin {
  nome: string;
  produtor: string;
  uva: string;
  pais: string;
  regiao: string;
  imagem_url: string | null;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: loja, error: lojaError } = await supabase
    .from("lojas")
    .select("id, nome, logo_url, cor_realce, slug")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (lojaError || !loja) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  const { data: rows, error: itemsError } = await supabase
    .from("catalogo_itens")
    .select("id, preco, estoque, ativo, vinhos(nome, produtor, uva, pais, regiao, imagem_url)")
    .eq("loja_id", loja.id)
    .eq("ativo", true)
    .gt("estoque", 0)
    .order("created_at", { ascending: true });

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const itens: ItemCatalogo[] = (rows ?? []).map((i) => {
    const v = (Array.isArray(i.vinhos) ? i.vinhos[0] : i.vinhos) as VinhoJoin | null;
    return {
      nome: v?.nome ?? "",
      preco: i.preco,
      estoque: i.estoque,
      ativo: i.ativo,
      produtor: v?.produtor ?? "",
      uva: v?.uva ?? "",
      pais: v?.pais ?? "",
      regiao: v?.regiao ?? "",
      imagem_url: v?.imagem_url ?? null,
    };
  });

  return NextResponse.json({
    loja: {
      nome: loja.nome,
      logo_url: loja.logo_url,
      slug: loja.slug,
      cor_realce: loja.cor_realce || "#8B1A1A",
    },
    itens,
  });
}
