import Link from 'next/link'

const beneficios = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    texto: 'Apareça para mais clientes na fronteira',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    texto: 'Divulgue ofertas e novidades em tempo real',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="1" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    texto: 'Aumente suas vendas com catálogo digital',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    texto: 'Sua vinoteca em destaque no portal',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    texto: 'Conexão direta com amantes do vinho',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    texto: 'Plataforma regional e especializada 24h',
  },
]

export function CTAVinotecas() {
  return (
    <section
      className="py-20 bg-white"
      aria-label="Cadastre sua vinoteca no COMPRAVINHO"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card glassmorphism lilás */}
        <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 bg-gradient-to-br from-purple-50 via-[#F3EEFF] to-purple-100 border border-purple-100">

          {/* Orbs decorativos */}
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #9333EA, transparent)' }}
          />
          <div
            aria-hidden
            className="absolute -bottom-16 left-10 w-64 h-64 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #6B21A8, transparent)' }}
          />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-4">
                Para vinotecas
              </span>

              <h2
                className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Tem uma vinoteca?{' '}
                <span className="text-purple-800">Junte-se ao COMPRAVINHO.</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Conecte sua vinoteca com milhares de apreciadores de vinho da fronteira e amplie
                sua presença digital com catálogo próprio, ofertas e muito mais.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/para-vinotecas"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-800 text-white font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-900/25 hover:-translate-y-0.5"
                  aria-label="Quero cadastrar minha vinoteca no COMPRAVINHO"
                >
                  Quero cadastrar minha vinoteca
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link
                  href="/para-vinotecas#planos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-purple-200 text-purple-800 font-medium hover:bg-purple-50 transition-colors"
                  aria-label="Conhecer os planos do COMPRAVINHO para vinotecas"
                >
                  Ver planos e benefícios
                </Link>
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {beneficios.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-purple-100/60"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                    {b.icon}
                  </div>
                  <p className="text-sm text-gray-700 leading-snug font-medium mt-1">
                    {b.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
