export interface Vinho {
  id: string;
  nome: string;
  produtor: string;
  uva: string;
  pais: string;
  regiao: string;
  imagem_url: string | null;
  created_at: string;
}

export interface Loja {
  id: string;
  slug: string;
  nome: string;
  logo_url: string | null;
  banner_url: string | null;
  cor_realce: string;
  sheet_id: string;
  senha_cliente: string;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  endereco_url: string | null;
  descricao: string | null;
  dominio_customizado: string | null;
  ativo: boolean;
  created_at: string;
  total_vinhos?: number;
}

export interface ItemCatalogo {
  nome: string;
  preco: string;
  preco_oferta?: string | null;
  preco_ars?: string | null;
  estoque: number;
  ativo: boolean;
  produtor?: string;
  uva?: string;
  pais?: string;
  regiao?: string;
  imagem_url?: string | null;
}
