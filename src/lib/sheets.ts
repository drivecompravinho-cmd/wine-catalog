export interface SheetRow {
  nome: string;
  preco: string;
  estoque: number;
  ativo: boolean;
}

/**
 * Reads the catalog sheet via published CSV (no service account needed).
 * To publish: Arquivo → Compartilhar → Publicar na web → Planilha inteira → CSV → Publicar
 * Expected columns: A=Nome, B=Preço, C=Estoque, D=Ativo (Sim/Não)
 * Row 1 is the header (skipped).
 */
export async function readCatalogSheet(sheetId: string): Promise<SheetRow[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);

  const text = await res.text();
  const lines = text.split("\n").slice(1); // skip header

  return lines
    .filter((line) => line.trim())
    .map((line) => {
      // Parse CSV properly handling quoted fields
      const cols = parseCSVLine(line);
      return {
        nome: (cols[0] ?? "").trim(),
        preco: (cols[1] ?? "").trim(),
        estoque: parseInt((cols[2] ?? "0").trim(), 10) || 0,
        ativo: (cols[3] ?? "").trim().toLowerCase() === "sim",
      };
    })
    .filter((r) => r.nome);
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
