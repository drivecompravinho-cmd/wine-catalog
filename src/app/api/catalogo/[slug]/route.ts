import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { readCatalogSheet } from "@/lib/sheets";
import type { ItemCatalogo } from "@/types";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();

  // 1. Find store
  const { data: loja, error: lojaError } = await supabase
    .from("lojas")
    .select("*")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (lojaError || !loja) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  // 2. Read sheet
  let sheetRows;
  try {
    sheetRows = await readCatalogSheet(loja.sheet_id);
  } catch (err) {
    console.error("Sheets error:", err);
    return NextResponse.json({ error: "Erro ao ler planilha" }, { status: 500 });
  }

  // 3. Get all wine names from sheet
  const nomes = sheetRows.filter((r) => r.ativo).map((r) => r.nome);

  // 4. Fetch wine details from DB
  const { data: vinhosDB } = await supabase
    .from("vinhos")
    .select("nome, produtor, uva, pais, regiao, imagem_url")
    .in("nome", nomes);

  const vinhosMap: Record<string, (typeof vinhosDB)[0]> = {};
  (vinhosDB ?? []).forEach((v) => { vinhosMap[v.nome] = v; });

  // 5. Enrich and filter active items
  const itens: ItemCatalogo[] = sheetRows
    .filter((r) => r.ativo && r.estoque > 0)
    .map((r) => ({
      ...r,
      ...(vinhosMap[r.nome] ?? {}),
    }));

  return NextResponse.json({
    loja: {
      nome: loja.nome,
      logo_url: loja.logo_url,
      slug: loja.slug,
    },
    itens,
  });
}
