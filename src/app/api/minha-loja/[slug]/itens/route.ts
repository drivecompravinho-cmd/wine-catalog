import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: loja } = await supabase.from("lojas").select("id").eq("slug", slug).single();
  if (!loja) return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });

  const { data } = await supabase
    .from("catalogo_itens")
    .select("id, vinho_id, preco, estoque, ativo, vinhos(nome, produtor, uva, pais)")
    .eq("loja_id", loja.id)
    .order("created_at", { ascending: true });

  const itens = (data ?? []).map((i) => {
    const v = i.vinhos as { nome: string; produtor: string; uva: string; pais: string } | null;
    return {
      id: i.id,
      vinho_id: i.vinho_id,
      nome: v?.nome ?? "",
      produtor: v?.produtor ?? "",
      uva: v?.uva ?? "",
      pais: v?.pais ?? "",
      preco: i.preco ?? "",
      estoque: i.estoque ?? 0,
      ativo: i.ativo,
    };
  });

  return NextResponse.json(itens);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServiceClient();
  const body = await request.json();

  const { data: loja } = await supabase.from("lojas").select("id").eq("slug", slug).single();
  if (!loja) return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });

  const { data, error } = await supabase
    .from("catalogo_itens")
    .insert({ loja_id: loja.id, ...body })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
