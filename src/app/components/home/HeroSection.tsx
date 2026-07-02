'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ofertasMock } from '@/lib/home-data'

const heroOfertas = ofertasMock.slice(0, 4)

// Gradientes de placeholder por país (substituir por next/image com imagem real)
const gradientByCountry = (pais: string) =>
  pais === 'Argentina'
    ? 'from-purple-900 via-purple-800 to-purple-950'
    : 'from-rose-900 via-rose-800 to-rose-950'

export function HeroSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Fundo gradiente suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FBFAFF] via-[#F3EEFF] to-[#FAFAFA]" />

      {/* Orb decorativo */}
      <div
        aria-hidden
        className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #9333EA 0%, #6B21A8 50%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A855F7 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Lado esquerdo ── */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-semibold text-purple-700 tracking-widest uppercase">
                Fronteira que inspira
              </span>
            </div>

            {/* H1 */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Encontre vinhos, vinotecas e novidades da fronteira{' '}
              <span className="text-purple-800">em um só lugar.</span>
            </h1>

            {/* Subtexto */}
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              O COMPRAVINHO conecta consumidores e amantes do vinho com vinotecas, ofertas e
              histórias de{' '}
              <span className="text-gray-700 font-medium">
                Dionísio Cerqueira, Barracão e Bernardo de Irigoyen.
              </span>
            </p>

            {/* Stats rápidos */}
            <div className="flex items-center gap-8 pt-2">
              {[
                { valor: '6+', label: 'Vinotecas' },
                { valor: '500+', label: 'Rótulos' },
                { valor: '3', label: 'Cidades' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.valor}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Botões */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/vinotecas"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-800 text-white font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 hover:-translate-y-0.5"
                aria-label="Ver vinotecas cadastradas no COMPRAVINHO"
              >
                Ver vinotecas cadastradas
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href="/para-vinotecas"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-purple-200 text-purple-800 font-medium hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-sm hover:-translate-y-0.5"
                aria-label="Anunciar meu negócio no COMPRAVINHO"
              >
                Anunciar meu negócio
              </Link>
            </div>
          </div>

          {/* ── Lado direito: card de ofertas ── */}
          <div className="relative">
            {/* Card glassmorphism */}
            <div className="relative bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl shadow-purple-900/10 p-6 overflow-hidden">
              {/* Header do card */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                    Destaque
                  </p>
                  <h2 className="text-base font-semibold text-gray-900">
                    Ofertas em destaque
                  </h2>
                </div>
                <Link
                  href="/ofertas"
                  className="text-xs text-purple-700 font-medium hover:text-purple-900 transition-colors"
                >
                  Ver todas →
                </Link>
              </div>

              {/* Wine card ativo */}
              <div className="relative overflow-hidden rounded-2xl mb-4">
                {/* Imagem placeholder */}
                <div
                  className={`h-56 bg-gradient-to-br ${gradientByCountry(heroOfertas[active].pais)} flex items-end`}
                >
                  {/* Imagem real: <Image src={heroOfertas[active].imagem} alt={heroOfertas[active].nome} fill className="object-cover" /> */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/20 text-8xl font-bold select-none">
                      {heroOfertas[active].nome.charAt(0)}
                    </div>
                  </div>

                  {/* Badge desconto */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg">
                      -{heroOfertas[active].desconto}%
                    </span>
                  </div>

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-semibold text-base leading-tight">
                      {heroOfertas[active].nome}
                    </p>
                    <p className="text-white/70 text-sm mt-0.5">
                      {heroOfertas[active].uva} · {heroOfertas[active].regiao}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-white font-bold text-lg">
                        R$ {heroOfertas[active].preco.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-white/50 text-sm line-through">
                        R$ {heroOfertas[active].precoAnterior.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {heroOfertas.map((oferta, i) => (
                  <button
                    key={oferta.id}
                    onClick={() => setActive(i)}
                    aria-label={`Ver ${oferta.nome}`}
                    className={`relative overflow-hidden rounded-xl h-14 transition-all duration-200 ${
                      i === active
                        ? 'ring-2 ring-purple-600 ring-offset-1'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-full h-full bg-gradient-to-br ${gradientByCountry(oferta.pais)} flex items-center justify-center`}
                    >
                      <span className="text-white/40 text-xl font-bold">
                        {oferta.nome.charAt(0)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Paginação bolinhas */}
              <div className="flex justify-center gap-1.5">
                {heroOfertas.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Ir para oferta ${i + 1}`}
                    className={`rounded-full transition-all duration-200 ${
                      i === active
                        ? 'w-5 h-1.5 bg-purple-700'
                        : 'w-1.5 h-1.5 bg-gray-300 hover:bg-purple-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card flutuante decorativo */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-purple-100 border border-purple-200/50 -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-purple-50 border border-purple-100/50 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
