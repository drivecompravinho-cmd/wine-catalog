'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Início', href: '/' },
  { label: 'Vinotecas', href: '/vinotecas' },
  { label: 'Ofertas', href: '/ofertas' },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Blog do Vinho', href: '/blog' },
  { label: 'Guia da Fronteira', href: '/guia' },
  { label: 'Anuncie aqui', href: '/anuncie' },
]

export function HomeHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
          : 'bg-white/70 backdrop-blur-lg border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-purple-800 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2C9 2 4 6 4 10.5C4 13.5376 6.23858 16 9 16C11.7614 16 14 13.5376 14 10.5C14 6 9 2 9 2Z" fill="white"/>
                <path d="M9 6L9 13" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">
              COMPRA<span className="text-purple-800">VINHO</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors duration-150 ${
                  item.label === 'Anuncie aqui'
                    ? 'text-purple-700 font-medium hover:bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            {/* Busca */}
            <button
              aria-label="Buscar vinhos e vinotecas"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* CTA */}
            <Link
              href="/para-vinotecas"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-800 text-white text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm"
              aria-label="Cadastrar minha vinoteca no COMPRAVINHO"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Cadastrar vinoteca
            </Link>

            {/* Hamburger mobile */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menu de navegação"
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12"/>
                  <line x1="4" x2="20" y1="6" y2="6"/>
                  <line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-sm rounded-xl transition-colors ${
                  item.label === 'Anuncie aqui'
                    ? 'text-purple-700 font-medium'
                    : 'text-gray-700'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/para-vinotecas"
              className="mt-2 px-4 py-3 rounded-xl bg-purple-800 text-white text-sm font-medium text-center"
              onClick={() => setMenuOpen(false)}
            >
              Cadastrar minha vinoteca
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
