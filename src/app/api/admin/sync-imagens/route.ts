import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(_: NextRequest) {
  const FOLDER_ID = process.env.DRIVE_ROTULOS_FOLDER_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!FOLDER_ID) return NextResponse.json({ error: "Variável DRIVE_ROTULOS_FOLDER_ID não configurada no Vercel." }, { status: 500 });
  if (!API_KEY) return NextResponse.json({ error: "Variável GOOGLE_API_KEY não configurada no Vercel." }, { status: 500 });

  // List files in public Drive folder
  const url = `https://www.googleapis.com/drive/v3/files?q=%27${FOLDER_ID}%27+in+parents+and+trashed%3Dfalse&fields=files(id,name,mimeType)&key=${API_KEY}&pageSize=500`;

  let files: { id: string; name: string; mimeType: string }[] = [];
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: `Drive API: ${json?.error?.message ?? res.status}` }, { status: 500 });
    files = json.files ?? [];
  } catch (err) {
    return NextResponse.json({ error: `Falha ao chamar Drive API: ${err}` }, { status: 500 });
  }

  const imageFiles = files.filter((f) => f.mimeType.startsWith("image/"));
  if (!imageFiles.length) return NextResponse.json({ updated: 0, total_imagens: 0, not_found: [], message: "Nenhuma imagem encontrada na pasta." });

  const supabase = createServiceClient();
  let updated = 0;
  const notFound: string[] = [];

  for (const file of imageFiles) {
    const nomeSemExtensao = file.name.replace(/\.[^.]+$/, "").trim();
    const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;

    const { data, error } = await supabase
      .from("vinhos")
      .update({ imagem_url: imageUrl })
      .ilike("nome", nomeSemExtensao)
      .select("id, nome");

    if (error) continue;
    if (data && data.length > 0) updated += data.length;
    else notFound.push(nomeSemExtensao);
  }

  return NextResponse.json({
    updated,
    total_imagens: imageFiles.length,
    not_found: notFound,
    message: `${updated} vinho(s) atualizado(s) com imagem de ${imageFiles.length} arquivo(s) na pasta.`,
  });
}
