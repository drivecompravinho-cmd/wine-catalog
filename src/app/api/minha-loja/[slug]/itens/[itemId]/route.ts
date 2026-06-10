import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string; itemId: string }> }) {
  const { itemId } = await params;
  const supabase = createServiceClient();
  const body = await request.json();
  const { error } = await supabase.from("catalogo_itens").update(body).eq("id", itemId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string; itemId: string }> }) {
  const { itemId } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("catalogo_itens").delete().eq("id", itemId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
