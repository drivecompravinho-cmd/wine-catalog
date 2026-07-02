import Link from 'next/link'
import { artigosBlogMock, type ArtigoBlog } from '@/lib/home-data'

const tagColor: Record<string, string> = {
  'Guia': 'bg-purple-50 text-purple-700',
  'Tendências': 'bg-rose-50 text-rose-700',
  'Educação': 'bg-blue-50 text-blue-700',
  'Lifestyle': 'bg-amber-50 text-amber-700',
}

const gradientes = [
  'from-purple-800 to-purple-600',
  'from-rose-800 to-rose-600',
  'from-indigo-800 to-indigo-600',
  'from-amber-800 to-amber-600',
]

function BlogCard({ artigo, index }: { artigo: ArtigoBlog; index: number }) {
  return (
    <Link
      href={`/blog/${artigo.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-purple-900/6 hover:-translate-y-0.5 transition-all duration-200"
      aria-label={`Ler artigo: ${artigo.titulo}`}
    >
      {/* Imagem */}
      <div className={`h-40 bg-gradient-to-br ${gradientes[index % gradientes.length]} relative flex items-center justify-center overflow-hidden`}>
        {/* Imagem real: <Image src={artigo.imagem} alt={artigo.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> */}
        <span className="text-white/15 text-6xl font-bold select-none">
          {artigo.titulo.charAt(0)}
        </span>

        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tagColor[artigo.tag] ?? 'bg-white/20 text-white'} backdrop-blur-sm`}>
            {artigo.tag}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs text-gray-400 mb-2">{artigo.data}</p>
        <h3
          className="font-semibold text-gray-900 text-base leading-snug mb-2 group-hover:text-purple-800 transition-colors line-clamp-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {artigo.titulo}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {artigo.resumo}
        </p>
        <div className="flex items-center gap-1 mt-4 text-sm text-purple-700 font-medium">
          Ler artigo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}

export function BlogSection() {
  return (
    <section className="py-20 bg-[#FAFAFA]" aria-label="Blog do Vinho">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">
              Conteúdo
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Blog do Vinho
            </h2>
            <p className="text-gray-500 mt-2">
              Dicas, curiosidades e tendências do universo vinícola.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-purple-700 font-medium hover:text-purple-900 transition-colors"
            aria-label="Ver todos os artigos do blog do vinho"
          >
            Ver todos os artigos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {artigosBlogMock.map((artigo, i) => (
            <BlogCard key={artigo.id} artigo={artigo} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
