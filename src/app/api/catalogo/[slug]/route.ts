import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { readCatalogSheet } from "@/lib/sheets";
import type { ItemCatalogo } from "@/types";

interface VinhoDB {
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
    .select("*")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (lojaError || !loja) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  let sheetRows;
  try {
    sheetRows = await readCatalogSheet(loja.sheet_id);
  } catch (err) {
    console.error("Sheets error:", err);
    return NextResponse.json({ error: "Erro ao ler planilha" }, { status: 500 });
  }

  const nomes = sheetRows.filter((r) => r.ativo).map((r) => r.nome);

  const { data: vinhosDB } = await supabase
    .from("vinhos")
    .select("nome, produtor, uva, pais, regiao, imagem_url")
    .in("nome", nomes);

  const vinhosMap: Record<string, VinhoDB> = {};
  (vinhosDB ?? []).forEach((v: VinhoDB) => { vinhosMap[v.nome] = v; });

  const itens: ItemCatalogo[] = sheetRows
    .filter((r) => r.ativo && r.estoque > 0)
    .map((r) => ({ ...r, ...(vinhosMap[r.nome] ?? {}) }));

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
