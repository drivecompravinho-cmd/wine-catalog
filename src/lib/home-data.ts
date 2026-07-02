// =============================================
// COMPRAVINHO — Mock Data para a Home
// Substitua por queries ao Supabase
// =============================================

export interface Vinoteca {
  id: string
  nome: string
  slug: string
  cidade: string
  estado: string
  pais: string
  cor: string
  whatsapp: string
  instagram?: string
  facebook?: string
  logoUrl?: string
  totalVinhos: number
}

export interface Oferta {
  id: string
  nome: string
  produtor: string
  uva: string
  regiao: string
  pais: string
  preco: number
  precoAnterior: number
  imagem?: string
  vinoteca: string
  vinotecaSlug: string
  desconto: number
}

export interface Noticia {
  id: string
  titulo: string
  resumo: string
  slug: string
  data: string
  imagem?: string
  categoria: string
  destaque: boolean
}

export interface ArtigoBlog {
  id: string
  titulo: string
  resumo: string
  slug: string
  data: string
  imagem?: string
  tag: string
}

export interface ItemGuia {
  id: string
  titulo: string
  descricao: string
  icon: string
  slug: string
}

// ─── Vinotecas ──────────────────────────────
export const vinotecasMock: Vinoteca[] = [
  {
    id: '1',
    nome: 'Cordeiro Vinhos',
    slug: 'cordeiro-vinhos',
    cidade: 'Dionísio Cerqueira',
    estado: 'SC',
    pais: 'Brasil',
    cor: '#6B21A8',
    whatsapp: '5549999990001',
    instagram: 'cordeiro_vinhos',
    totalVinhos: 84,
  },
  {
    id: '2',
    nome: 'Del Masso Vinhos',
    slug: 'del-masso-vinhos',
    cidade: 'Barracão',
    estado: 'PR',
    pais: 'Brasil',
    cor: '#7C3AED',
    whatsapp: '5549999990002',
    instagram: 'delmasso.vinhos',
    totalVinhos: 67,
  },
  {
    id: '3',
    nome: 'Adega do Sol',
    slug: 'adega-do-sol',
    cidade: 'Dionísio Cerqueira',
    estado: 'SC',
    pais: 'Brasil',
    cor: '#9333EA',
    whatsapp: '5549999990003',
    totalVinhos: 52,
  },
  {
    id: '4',
    nome: 'La Frontera Vinhos',
    slug: 'la-frontera-vinhos',
    cidade: 'Bernardo de Irigoyen',
    estado: 'Misiones',
    pais: 'Argentina',
    cor: '#A855F7',
    whatsapp: '549999990004',
    instagram: 'lafrontera.vinhos',
    totalVinhos: 118,
  },
  {
    id: '5',
    nome: 'Conceito Vinhos',
    slug: 'conceito-vinhos',
    cidade: 'Dionísio Cerqueira',
    estado: 'SC',
    pais: 'Brasil',
    cor: '#8B5CF6',
    whatsapp: '5549999990005',
    instagram: 'conceitovinhos',
    totalVinhos: 93,
  },
  {
    id: '6',
    nome: 'Velho Mundo Vinhos',
    slug: 'velho-mundo-vinhos',
    cidade: 'Barracão',
    estado: 'PR',
    pais: 'Brasil',
    cor: '#6D28D9',
    whatsapp: '5549999990006',
    totalVinhos: 45,
  },
]

// ─── Ofertas ────────────────────────────────
export const ofertasMock: Oferta[] = [
  {
    id: '1',
    nome: 'DV Catena Malbec',
    produtor: 'Catena Zapata',
    uva: 'Malbec',
    regiao: 'Mendoza',
    pais: 'Argentina',
    preco: 189.9,
    precoAnterior: 239.9,
    vinoteca: 'La Frontera Vinhos',
    vinotecaSlug: 'la-frontera-vinhos',
    desconto: 21,
  },
  {
    id: '2',
    nome: 'Clos de los Siete',
    produtor: 'Michel Rolland',
    uva: 'Malbec / Cabernet',
    regiao: 'Valle de Uco',
    pais: 'Argentina',
    preco: 149.9,
    precoAnterior: 199.9,
    vinoteca: 'Cordeiro Vinhos',
    vinotecaSlug: 'cordeiro-vinhos',
    desconto: 25,
  },
  {
    id: '3',
    nome: 'Achaval Ferrer Malbec',
    produtor: 'Achaval Ferrer',
    uva: 'Malbec',
    regiao: 'Luján de Cuyo',
    pais: 'Argentina',
    preco: 129.9,
    precoAnterior: 169.9,
    vinoteca: 'Del Masso Vinhos',
    vinotecaSlug: 'del-masso-vinhos',
    desconto: 24,
  },
  {
    id: '4',
    nome: 'Luigi Bosca Malbec',
    produtor: 'Luigi Bosca',
    uva: 'Malbec',
    regiao: 'Mendoza',
    pais: 'Argentina',
    preco: 89.9,
    precoAnterior: 119.9,
    vinoteca: 'Conceito Vinhos',
    vinotecaSlug: 'conceito-vinhos',
    desconto: 25,
  },
  {
    id: '5',
    nome: 'Nieto Senetiner Bonarda',
    produtor: 'Nieto Senetiner',
    uva: 'Bonarda',
    regiao: 'Mendoza',
    pais: 'Argentina',
    preco: 69.9,
    precoAnterior: 99.9,
    vinoteca: 'Adega do Sol',
    vinotecaSlug: 'adega-do-sol',
    desconto: 30,
  },
  {
    id: '6',
    nome: 'Zuccardi Valle Torrontés',
    produtor: 'Familia Zuccardi',
    uva: 'Torrontés',
    regiao: 'Salta',
    pais: 'Argentina',
    preco: 79.9,
    precoAnterior: 109.9,
    vinoteca: 'La Frontera Vinhos',
    vinotecaSlug: 'la-frontera-vinhos',
    desconto: 27,
  },
  {
    id: '7',
    nome: 'Rutini Cabernet',
    produtor: 'Rutini Wines',
    uva: 'Cabernet Sauvignon',
    regiao: 'Mendoza',
    pais: 'Argentina',
    preco: 159.9,
    precoAnterior: 199.9,
    vinoteca: 'Cordeiro Vinhos',
    vinotecaSlug: 'cordeiro-vinhos',
    desconto: 20,
  },
  {
    id: '8',
    nome: 'Trapiche Medalla Malbec',
    produtor: 'Trapiche',
    uva: 'Malbec',
    regiao: 'Mendoza',
    pais: 'Argentina',
    preco: 99.9,
    precoAnterior: 139.9,
    vinoteca: 'Del Masso Vinhos',
    vinotecaSlug: 'del-masso-vinhos',
    desconto: 29,
  },
]

// ─── Notícias ────────────────────────────────
export const noticiasMock: Noticia[] = [
  {
    id: '1',
    titulo: 'Fim de semana movimenta o comércio na fronteira Brasil-Argentina',
    resumo:
      'O fluxo de turistas e compradores aumentou significativamente nos últimos finais de semana em Dionísio Cerqueira, Barracão e Bernardo de Irigoyen, impulsionando as vendas nas vinotecas locais.',
    slug: 'fim-de-semana-movimenta-comercio-fronteira',
    data: '2 jul. 2026',
    categoria: 'Comércio',
    destaque: true,
  },
  {
    id: '2',
    titulo: 'Nova vinoteca abre as portas em Dionísio Cerqueira com catálogo argentino',
    resumo: 'A novidade chega para ampliar as opções de vinhos importados na cidade.',
    slug: 'nova-vinoteca-abre-dionisio-cerqueira',
    data: '30 jun. 2026',
    categoria: 'Novidades',
    destaque: false,
  },
  {
    id: '3',
    titulo: 'Rota dos vinhos da fronteira atrai visitantes de todo o sul do Brasil',
    resumo: 'Iniciativa conecta vinotecas das três cidades em um roteiro turístico e enogastronômico.',
    slug: 'rota-vinhos-fronteira-atrai-visitantes',
    data: '28 jun. 2026',
    categoria: 'Turismo',
    destaque: false,
  },
  {
    id: '4',
    titulo: 'Eventos e degustações marcam o mês de julho na fronteira',
    resumo: 'Confira a programação completa das vinotecas e espaços culturais da região.',
    slug: 'eventos-degustacoes-julho-fronteira',
    data: '25 jun. 2026',
    categoria: 'Eventos',
    destaque: false,
  },
  {
    id: '5',
    titulo: 'Guia completo para aproveitar melhor sua visita à fronteira',
    resumo: 'Dicas de hospedagem, câmbio, transporte e os melhores pontos para comprar vinhos.',
    slug: 'guia-visita-fronteira',
    data: '22 jun. 2026',
    categoria: 'Guia',
    destaque: false,
  },
]

// ─── Blog ────────────────────────────────────
export const artigosBlogMock: ArtigoBlog[] = [
  {
    id: '1',
    titulo: '6 dicas para escolher o vinho certo na vinoteca',
    resumo: 'Da etiqueta à harmonização, aprenda a tomar melhores decisões na hora da compra.',
    slug: '6-dicas-escolher-vinho',
    data: '1 jul. 2026',
    tag: 'Guia',
  },
  {
    id: '2',
    titulo: 'Vinhos argentinos em alta: o que está surpreendendo o mercado',
    resumo: 'Além do Malbec clássico, outras uvas argentinas estão conquistando paladares ao redor do mundo.',
    slug: 'vinhos-argentinos-em-alta',
    data: '27 jun. 2026',
    tag: 'Tendências',
  },
  {
    id: '3',
    titulo: 'Malbec vs. Cabernet Sauvignon: qual escolher?',
    resumo: 'Entenda as diferenças de aromas, sabor e harmonização entre as duas uvas favoritas do sul.',
    slug: 'malbec-vs-cabernet-sauvignon',
    data: '20 jun. 2026',
    tag: 'Educação',
  },
  {
    id: '4',
    titulo: 'Como montar uma pequena adega em casa sem gastar muito',
    resumo: 'Temperatura, umidade e organização: os fundamentos para guardar vinhos com qualidade.',
    slug: 'como-montar-adega-em-casa',
    data: '15 jun. 2026',
    tag: 'Lifestyle',
  },
]

// ─── Guia ─────────────────────────────────────
export const itensGuiaMock: ItemGuia[] = [
  { id: '1', titulo: 'Onde comprar vinhos', descricao: 'Mapa de vinotecas na fronteira', icon: 'wine', slug: 'onde-comprar-vinhos' },
  { id: '2', titulo: 'Como chegar', descricao: 'Transporte e mobilidade na região', icon: 'map', slug: 'como-chegar' },
  { id: '3', titulo: 'Restaurantes e bares', descricao: 'Os melhores para harmonizar', icon: 'restaurant', slug: 'restaurantes-bares' },
  { id: '4', titulo: 'Hotéis e pousadas', descricao: 'Hospedagem com conforto', icon: 'hotel', slug: 'hoteis-pousadas' },
  { id: '5', titulo: 'Pontos turísticos', descricao: 'O que visitar na fronteira', icon: 'camera', slug: 'pontos-turisticos' },
  { id: '6', titulo: 'Eventos e feiras', descricao: 'Agenda cultural da região', icon: 'calendar', slug: 'eventos-feiras' },
  { id: '7', titulo: 'Serviços e câmbio', descricao: 'Casas de câmbio e serviços', icon: 'exchange', slug: 'servicos-cambio' },
  { id: '8', titulo: 'Gastronomia local', descricao: 'Sabores únicos da fronteira', icon: 'food', slug: 'gastronomia-local' },
]
