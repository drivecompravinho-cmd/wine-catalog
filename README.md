# 🍷 Wine Catalog — Catálogo Online de Vinhos

Sistema de catálogo online para vendedores de vinho, integrado com Google Sheets.

---

## Stack
- **Next.js 15** + TypeScript
- **Supabase** (banco de dados + storage)
- **Google Sheets API** (planilha privada de cada loja)
- **Vercel** (deploy)

---

## Setup passo a passo

### 1. Supabase

1. Acesse [supabase.com](https://supabase.com) → crie um novo projeto
2. Vá em **SQL Editor** → cole e execute o conteúdo de `schema.sql`
3. Copie as chaves em **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

---

### 2. Google Cloud (Sheets API)

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto (ex: `wine-catalog`)
3. Vá em **APIs & Services → Library** → ative **Google Sheets API**
4. Vá em **APIs & Services → Credentials → Create Credentials → Service Account**
   - Dê um nome (ex: `wine-catalog-reader`)
   - Role: **Viewer**
5. Clique na service account criada → aba **Keys → Add Key → JSON**
   - Baixe o arquivo `.json`
   - Copie o campo `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Copie o campo `private_key` → `GOOGLE_PRIVATE_KEY`

---

### 3. Planilha de cada cliente

Para cada cliente, crie uma planilha Google Sheets com este formato:

| A: Nome do vinho | B: Preço | C: Estoque | D: Ativo |
|---|---|---|---|
| DV CATENA MALBEC | 89,90 | 12 | Sim |
| MIOLO SELEÇÃO | 45,00 | 0 | Não |

**Importante:**
- Linha 1 deve ser o cabeçalho (será ignorada)
- Coluna D: `Sim` = aparece no catálogo, `Não` = oculto
- O nome na planilha deve ser **idêntico** ao nome cadastrado no banco de vinhos

**Compartilhar com a service account:**
- Clique em **Compartilhar** na planilha
- Adicione o email da service account (`GOOGLE_SERVICE_ACCOUNT_EMAIL`) com permissão de **Leitura**

**Pegar o ID da planilha:**
- URL: `https://docs.google.com/spreadsheets/d/ID_AQUI/edit`
- Copie o `ID_AQUI` — esse é o `sheet_id` da loja

---

### 4. GitHub + Vercel

1. Crie um repositório no GitHub e faça push do projeto
2. Acesse [vercel.com](https://vercel.com) → importe o repositório
3. Em **Environment Variables**, adicione:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
ADMIN_SECRET=
```

> ⚠️ Para `GOOGLE_PRIVATE_KEY`, cole o valor **com as aspas** e mantenha as quebras de linha `\n`.

4. Deploy!

---

### 5. Desenvolvimento local

```bash
npm install
cp .env.example .env.local
# Preencha as variáveis no .env.local
npm run dev
```

---

## Como usar

### Painel admin (`/admin`)
- Senha definida em `ADMIN_SECRET`
- **Lojas**: cadastre cada cliente com nome, slug, ID da planilha e logo
- **Vinhos**: cadastre cada rótulo com nome (idêntico ao da planilha), uva, país e imagem

### Catálogo público (`/catalogo/[slug]`)
- Link que você envia pro consumidor final
- Lê a planilha em tempo real
- Filtra por tipo de vinho, busca por nome/uva/produtor
- Mostra estoque e avisa quando restam poucas unidades

---

## Fluxo resumido

```
Você cadastra a loja no /admin
  → define slug, planilha, logo

Você cadastra os vinhos no /admin  
  → nome, uva, país, imagem

Cliente vendedor edita a planilha
  → muda preço, estoque, Sim/Não

Consumidor acessa /catalogo/slug
  → vê o catálogo atualizado em tempo real
```
