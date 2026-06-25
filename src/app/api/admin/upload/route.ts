import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const supabase = createServiceClient();
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const bucket = formData.get("bucket") as string;

  if (!file || !bucket) {
    return NextResponse.json({ error: "Arquivo ou bucket não informado" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
