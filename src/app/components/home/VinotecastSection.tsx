import Link from 'next/link'
import { vinotecasMock, type Vinoteca } from '@/lib/home-data'

function VinotecaCard({ vinoteca }: { vinoteca: Vinoteca }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-purple-900/5 hover:-translate-y-0.5 transition-all duration-200">
      {/* Logo circular */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner"
          style={{ background: `linear-gradient(135deg, ${vinoteca.cor}, ${vinoteca.cor}99)` }}
          aria-hidden
        >
          {vinoteca.nome.charAt(0)}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${vinoteca.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Falar com ${vinoteca.nome} pelo WhatsApp`}
          className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
          {vinoteca.nome}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          {vinoteca.cidade}, {vinoteca.estado}
          {vinoteca.pais === 'Argentina' && (
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">AR</span>
          )}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{vinoteca.totalVinhos} pótulos</span>
          <Link
            href={`/catalogo/${vinoteca.slug}`}
            className="text-xs font-medium text-purple-700 hover:text-purple-900 transition-colors"
            aria-label={`Ver catálogo de ${vinoteca.nome}`}
          >
            Ver catálogo →
          </Link>
        </div>
      </div>
    </div>
  )
}

export function VinotecastSection() {
  return (
    <section className="py-20 bg-white" aria-label="Vinotecas cadastradas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">
              Parceiros
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Vinotecas cadastradas
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Descubra vinotecas de confiança na região da fronteira Brasil-Argentina.
            </p>
          </div>
          <Link
            href="/vinotecas"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-purple-700 font-medium hover:text-purple-900 transition-colors"
            aria-label="Ver todas as vinotecas cadastradas"
          >
            Ver todas as vinotecas
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Grid de vinotecas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vinotecasMock.map((vinoteca) => (
            <VinotecaCard key={vinoteca.id} vinoteca={vinoteca} />
          ))}
        </div>

        {/* Link mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/vinotecas"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-purple-200 text-purple-800 font-medium text-sm hover:bg-purple-50 transition-colors"
          >
            Ver todas as vinotecas
          </Link>
        </div>
      </div>
    </section>
  )
}
