import Link from 'next/link'
import { noticiasMock, type Noticia } from '@/lib/home-data'

const categoriaColor: Record<string, string> = {
  Comércio: 'bg-blue-50 text-blue-700',
  Novidades: 'bg-green-50 text-green-700',
  Turismo: 'bg-amber-50 text-amber-700',
  Eventos: 'bg-purple-50 text-purple-700',
  Guia: 'bg-rose-50 text-rose-700',
}

const gradientes = [
  'from-purple-900 to-purple-700',
  'from-gray-800 to-gray-600',
  'from-blue-900 to-blue-700',
  'from-emerald-900 to-emerald-700',
  'from-amber-800 to-amber-600',
]

function NoticiaDestaque({ noticia, index }: { noticia: Noticia; index: number }) {
  return (
    <Link
      href={`/noticias/${noticia.slug}`}
      className="group block relative overflow-hidden rounded-3xl h-full min-h-[420px]"
      aria-label={`Ler notícia: ${noticia.titulo}`}
    >
      {/* Imagem / Gradiente */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientes[index % gradientes.length]}`}>
        {/* Imagem real: <Image src={noticia.imagem} alt={noticia.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Conteúdo */}
      <div className="relative h-full flex flex-col justify-end p-7">
        {/* Categoria */}
        <span className={`self-start px-2.5 py-1 rounded-full text-xs font-semibold mb-3 bg-white/20 text-white backdrop-blur-sm`}>
          {noticia.categoria}
        </span>

        <h3
          className="text-2xl font-bold text-white leading-tight mb-2 group-hover:text-purple-200 transition-colors"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {noticia.titulo}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
          {noticia.resumo}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">{noticia.data}</span>
          <span className="text-white text-xs font-medium group-hover:underline">
            Ler mais →
          </span>
        </div>
      </div>
    </Link>
  )
}

function NoticiaMenor({ noticia, index }: { noticia: Noticia; index: number }) {
  return (
    <Link
      href={`/noticias/${noticia.slug}`}
      className="group flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
      aria-label={`Ler notícia: ${noticia.titulo}`}
    >
      {/* Miniatura */}
      <div
        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br ${gradientes[(index + 1) % gradientes.length]}`}
      />

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoriaColor[noticia.categoria] ?? 'bg-gray-100 text-gray-600'}`}>
          {noticia.categoria}
        </span>
        <h4 className="text-sm font-semibold text-gray-900 leading-tight mt-1 line-clamp-2 group-hover:text-purple-800 transition-colors">
          {noticia.titulo}
        </h4>
        <p className="text-xs text-gray-400 mt-1">{noticia.data}</p>
      </div>
    </Link>
  )
}

export function NoticiasSection() {
  const destaque = noticiasMock.find((n) => n.destaque) ?? noticiasMock[0]
  const demais = noticiasMock.filter((n) => n.id !== destaque.id).slice(0, 4)

  return (
    <section className="py-20 bg-white" aria-label="Notícias da fronteira">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">
              Atualidades
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Notícias da fronteira
            </h2>
            <p className="text-gray-500 mt-2">
              Tudo que acontece em Dionísio Cerqueira, Barracão e Bernardo de Irigoyen.
            </p>
          </div>
          <Link
            href="/noticias"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-purple-700 font-medium hover:text-purple-900 transition-colors"
            aria-label="Ver todas as notícias da fronteira"
          >
            Ver todas as notícias
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Layout editorial */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Destaque grande — ocupa 3 colunas */}
          <div className="lg:col-span-3">
            <NoticiaDestaque noticia={destaque} index={0} />
          </div>

          {/* Lista lateral — 2 colunas */}
          <div className="lg:col-span-2 flex flex-col justify-between gap-2">
            {demais.map((noticia, i) => (
              <NoticiaMenor key={noticia.id} noticia={noticia} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
