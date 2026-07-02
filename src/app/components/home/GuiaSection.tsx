import Link from 'next/link'
import { itensGuiaMock, type ItemGuia } from '@/lib/home-data'

// Ícones SVG inline (lineares, roxos)
const Icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  wine: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 22h8M12 11v11M6 3h12l-2 8a4 4 0 0 1-8 0Z"/>
    </svg>
  ),
  map: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" x2="9" y1="3" y2="18"/>
      <line x1="15" x2="15" y1="6" y2="21"/>
    </svg>
  ),
  restaurant: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
      <line x1="6" x2="6" y1="2" y2="4"/>
      <line x1="10" x2="10" y1="2" y2="4"/>
      <line x1="14" x2="14" y1="2" y2="4"/>
    </svg>
  ),
  hotel: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 22V7l9-5 9 5v15"/>
      <path d="M6 22V12h12v10"/>
      <path d="M6 12v-2h12v2"/>
    </svg>
  ),
  camera: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  ),
  calendar: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
      <path d="m9 16 2 2 4-4"/>
    </svg>
  ),
  exchange: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 3 4 7l4 4"/>
      <path d="M4 7h16"/>
      <path d="m16 21 4-4-4-4"/>
      <path d="M20 17H4"/>
    </svg>
  ),
  food: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0v20"/>
      <path d="M2 12h20"/>
    </svg>
  ),
}

function GuiaCard({ item }: { item: ItemGuia }) {
  const Icon = Icons[item.icon] ?? Icons.wine

  return (
    <Link
      href={`/guia/${item.slug}`}
      className="group flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-purple-900/6 hover:-translate-y-1 hover:border-purple-100 transition-all duration-200"
      aria-label={`Guia: ${item.titulo}`}
    >
      {/* Ícone */}
      <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-100 group-hover:border-purple-200 transition-colors">
        <Icon className="w-7 h-7 text-purple-700" />
      </div>

      {/* Texto */}
      <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-purple-800 transition-colors">
        {item.titulo}
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed">
        {item.descricao}
      </p>

      {/* Arrow */}
      <div className="mt-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  )
}

export function GuiaSection() {
  return (
    <section className="py-20 bg-white" aria-label="Guia da Fronteira">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">
              Explore
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Guia da Fronteira
            </h2>
            <p className="text-gray-500 mt-2">
              Tudo que você precisa saber para aproveitar a fronteira com turismo em Dionísio Cerqueira e Bernardo de Irigoyen.
            </p>
          </div>
          <Link
            href="/guia"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-purple-700 font-medium hover:text-purple-900 transition-colors"
            aria-label="Ver guia completo da fronteira"
          >
            Ver guia completo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Grid 4 colunas desktop / 2 mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {itensGuiaMock.map((item) => (
            <GuiaCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
