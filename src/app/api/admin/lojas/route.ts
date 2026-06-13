import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServiceClient();
  const { data: lojas, error } = await supabase
    .from("lojas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get item counts per loja
  const { data: counts } = await supabase
    .from("catalogo_itens")
    .select("loja_id");

  const countMap: Record<string, number> = {};
  (counts ?? []).forEach((c) => { countMap[c.loja_id] = (countMap[c.loja_id] ?? 0) + 1; });

  const result = (lojas ?? []).map((l) => ({ ...l, total_vinhos: countMap[l.id] ?? 0 }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const supabase = createServiceClient();
  const body = await request.json();
  const { data, error } = await supabase.from("lojas").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
