import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

const FOLDER_ID = process.env.DRIVE_ROTULOS_FOLDER_ID!;
const DRIVE_API_KEY = process.env.GOOGLE_API_KEY!;

export async function POST(_: NextRequest) {
  if (!FOLDER_ID || !DRIVE_API_KEY) {
    return NextResponse.json({ error: "DRIVE_ROTULOS_FOLDER_ID ou GOOGLE_API_KEY não configurados" }, { status: 500 });
  }

  // 1. List all files in the public Drive folder
  const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false&fields=files(id,name,mimeType)&key=${DRIVE_API_KEY}&pageSize=500`;
  
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Drive API error: ${err}` }, { status: 500 });
  }

  const { files } = await res.json() as { files: { id: string; name: string; mimeType: string }[] };

  const imageFiles = files.filter((f) =>
    f.mimeType.startsWith("image/")
  );

  if (!imageFiles.length) {
    return NextResponse.json({ updated: 0, message: "Nenhuma imagem encontrada na pasta." });
  }

  // 2. Match by filename (without extension) = wine name
  const supabase = createServiceClient();
  let updated = 0;
  const notFound: string[] = [];

  for (const file of imageFiles) {
    // Remove extension to get wine name
    const nomeSemExtensao = file.name.replace(/\.[^.]+$/, "").trim().toUpperCase();
    
    // Direct image URL via Drive thumbnail (works with public files)
    const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;

    const { data, error } = await supabase
      .from("vinhos")
      .update({ imagem_url: imageUrl })
      .ilike("nome", nomeSemExtensao)
      .select("id, nome");

    if (error) continue;

    if (data && data.length > 0) {
      updated += data.length;
    } else {
      notFound.push(nomeSemExtensao);
    }
  }

  return NextResponse.json({
    updated,
    total_imagens: imageFiles.length,
    not_found: notFound,
    message: `${updated} vinho(s) atualizado(s) com imagem.`,
  });
}
