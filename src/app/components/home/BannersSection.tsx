import Link from 'next/link'

interface BannerProps {
  titulo: string
  subtitulo: string
  cta: string
  href: string
  gradiente: string
  ariaLabel: string
}

function Banner({ titulo, subtitulo, cta, href, gradiente, ariaLabel }: BannerProps) {
  return (
    <div
      className={`relative flex-1 overflow-hidden rounded-3xl min-h-[200px] flex flex-col justify-between p-8 bg-gradient-to-br ${gradiente}`}
    >
      {/* Overlay suave */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Padrão decorativo */}
      <div aria-hidden className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <div className="w-full h-full rounded-full border-[40px] border-white translate-x-16 -translate-y-16" />
      </div>
      <div aria-hidden className="absolute bottom-0 left-4 w-32 h-32 opacity-10">
        <div className="w-full h-full rounded-full border-[20px] border-white translate-y-12" />
      </div>

      {/* Conteúdo */}
      <div className="relative">
        <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm mb-3">
          Anuncie aqui
        </span>
        <h3
          className="text-white font-bold text-xl sm:text-2xl leading-tight mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {titulo}
        </h3>
        <p className="text-white/70 text-sm mb-6 max-w-xs">
          {subtitulo}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-medium text-sm hover:bg-gray-50 transition-colors shadow-lg"
          aria-label={ariaLabel}
        >
          {cta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}

export function BannersSection() {
  return (
    <section className="py-20 bg-[#FAFAFA]" aria-label="Espaços para anúncios">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-5">
          <Banner
            titulo="Seu restaurante em destaque para turistas da fronteira"
            subtitulo="Alcance visitantes e amantes de gastronomia que chegam à região diariamente."
            cta="Quero anunciar"
            href="/anuncie"
            gradiente="from-[#3B0A1E] via-purple-950 to-purple-900"
            ariaLabel="Anunciar restaurante no COMPRAVINHO"
          />
          <Banner
            titulo="Sua pousada ou hotel para mais visitantes"
            subtitulo="Apareça para viajantes que visitam Dionísio Cerqueira e a fronteira argentina."
            cta="Quero anunciar"
            href="/anuncie"
            gradiente="from-purple-900 via-indigo-900 to-[#1a0050]"
            ariaLabel="Anunciar hotel ou pousada no COMPRAVINHO"
          />
        </div>
      </div>
    </section>
  )
}
