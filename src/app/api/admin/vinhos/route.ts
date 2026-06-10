import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = createServiceClient();
  const q = request.nextUrl.searchParams.get("q");

  let query = supabase.from("vinhos").select("*").order("nome", { ascending: true });

  if (q) {
    query = query.or(`nome.ilike.%${q}%,produtor.ilike.%${q}%,uva.ilike.%${q}%`);
  }

  const { data, error } = await query.limit(30);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createServiceClient();
  const body = await request.json();
  const { data, error } = await supabase.from("vinhos").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
