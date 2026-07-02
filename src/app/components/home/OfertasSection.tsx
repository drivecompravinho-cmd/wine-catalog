import Link from 'next/link'
import { ofertasMock, type Oferta } from '@/lib/home-data'

const gradientByCountry = (pais: string) =>
  pais === 'Argentina'
    ? 'from-purple-900 via-purple-800 to-purple-950'
    : 'from-rose-900 via-rose-800 to-rose-950'

function OfertaCard({ oferta }: { oferta: Oferta }) {
  const economia = (oferta.precoAnterior - oferta.preco).toFixed(2).replace('.', ',')

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-900/8 hover:-translate-y-1 transition-all duration-200">
      {/* Imagem */}
      <div className={`relative h-44 bg-gradient-to-br ${gradientByCountry(oferta.pais)} flex items-center justify-center overflow-hidden`}>
        {/* Imagem real: <Image src={oferta.imagem} alt={oferta.nome} fill className="object-cover" /> */}
        <span className="text-white/15 text-7xl font-bold select-none">
          {oferta.nome.charAt(0)}
        </span>

        {/* Badge desconto */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow">
            -{oferta.desconto}%
          </span>
        </div>

        {/* País */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm">
            {oferta.pais}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{oferta.uva} · {oferta.regiao}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
          {oferta.nome}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{oferta.produtor}</p>

        {/* Preços */}
        <div className="flex items-end gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            R$ {oferta.preco.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-sm text-gray-400 line-through mb-0.5">
            R$ {oferta.precoAnterior.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <p className="text-xs text-green-600 font-medium mb-3">
          Economia de R$ {economia}
        </p>

        {/* Vinoteca + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400 truncate mr-2">{oferta.vinoteca}</span>
          <Link
            href={`/catalogo/${oferta.vinotecaSlug}`}
            className="flex-shrink-0 text-xs font-medium text-purple-700 hover:text-purple-900 transition-colors"
            aria-label={`Ver ${oferta.nome} no catálogo de ${oferta.vinoteca}`}
          >
            Ver catálogo →
          </Link>
        </div>
      </div>
    </div>
  )
}

export function OfertasSection() {
  return (
    <section className="py-20 bg-[#FAFAFA]" aria-label="Ofertas em destaque">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">
              Promoções
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ofertas em destaque
            </h2>
            <p className="text-gray-500 mt-2">
              Os melhores preços de vinhos na fronteira, direto das vinotecas.
            </p>
          </div>
          <Link
            href="/ofertas"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-purple-700 font-medium hover:text-purple-900 transition-colors"
            aria-label="Ver todas as ofertas de vinhos"
          >
            Ver todas as ofertas
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ofertasMock.map((oferta) => (
            <OfertaCard key={oferta.id} oferta={oferta} />
          ))}
        </div>

        {/* Aviso de preços */}
        <div className="mt-8 flex items-start gap-2 p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <svg className="flex-shrink-0 mt-0.5 text-amber-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Aviso importante:</strong> Os preços exibidos são informativos e podem sofrer alterações sem aviso prévio.
            O COMPRAVINHO não realiza venda online. Consulte sempre a vinoteca antes de finalizar sua compra.
          </p>
        </div>

        {/* Link mobile */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/ofertas"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-purple-200 text-purple-800 font-medium text-sm hover:bg-purple-50 transition-colors"
          >
            Ver todas as ofertas
          </Link>
        </div>
      </div>
    </section>
  )
}
