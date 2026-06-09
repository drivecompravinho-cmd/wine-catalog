-- =============================================
-- WINE CATALOG - Schema Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- =============================================

-- Tabela de vinhos (banco central de rótulos)
create table public.vinhos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null unique,        -- igual ao nome na planilha
  produtor    text not null default '',
  uva         text not null default '',
  pais        text not null default '',
  regiao      text not null default '',
  imagem_url  text,
  created_at  timestamptz default now()
);

-- Tabela de lojas (clientes vendedores)
create table public.lojas (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,        -- usado na URL /catalogo/[slug]
  nome        text not null,
  logo_url    text,
  sheet_id    text not null,              -- ID da planilha Google Sheets
  ativo       boolean not null default true,
  created_at  timestamptz default now()
);

-- RLS: só service role acessa (chamado pelo backend)
alter table public.vinhos enable row level security;
alter table public.lojas   enable row level security;

-- Políticas: acesso total via service role (seu backend)
create policy "service_role_all_vinhos" on public.vinhos
  for all using (true) with check (true);

create policy "service_role_all_lojas" on public.lojas
  for all using (true) with check (true);

-- Índices para performance
create index idx_lojas_slug on public.lojas(slug);
create index idx_vinhos_nome on public.vinhos(nome);
