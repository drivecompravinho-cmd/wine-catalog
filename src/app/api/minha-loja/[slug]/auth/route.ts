import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { senha } = await request.json();
  const supabase = createServiceClient();

  const { data: loja, error } = await supabase
    .from("lojas")
    .select("id, nome, logo_url, cor_realce, senha_cliente, ativo")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (error || !loja) return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  if (loja.senha_cliente !== senha) return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });

  return NextResponse.json({
    loja: { nome: loja.nome, logo_url: loja.logo_url, cor_realce: loja.cor_realce },
  });
}
