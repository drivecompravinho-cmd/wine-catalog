'use client'

import { useState, type FormEvent } from 'react'

export function NewsletterSection() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', cidade: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // TODO: substituir por chamada real ao Supabase ou webhook WhatsApp
    await new Promise((r) => setTimeout(r, 1000))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <section className="py-20 bg-[#FAFAFA]" aria-label="Newsletter COMPRAVINHO">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Você está na lista!
          </h3>
          <p className="text-gray-500">
            Em breve você vai receber novidades, ofertas e conteúdos do COMPRAVINHO direto no seu WhatsApp.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-[#FAFAFA]" aria-label="Receba novidades do COMPRAVINHO">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 sm:p-14 text-center">
          {/* Ícone */}
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18H6.6a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Receba novidades, ofertas e conteúdos sobre vinhos.
          </h2>

          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Entre na lista do COMPRAVINHO e acompanhe novidades das vinotecas, eventos e notícias da fronteira Brasil-Argentina.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div>
              <label htmlFor="newsletter-nome" className="sr-only">Seu nome</label>
              <input
                id="newsletter-nome"
                name="nome"
                type="text"
                placeholder="Seu nome"
                required
                value={form.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div>
              <label htmlFor="newsletter-whatsapp" className="sr-only">Seu WhatsApp</label>
              <input
                id="newsletter-whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="WhatsApp (com DDD)"
                required
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div>
              <label htmlFor="newsletter-cidade" className="sr-only">Sua cidade</label>
              <input
                id="newsletter-cidade"
                name="cidade"
                type="text"
                placeholder="Sua cidade"
                value={form.cidade}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Quero receber novidades do COMPRAVINHO"
              className="w-full py-3.5 rounded-xl bg-purple-800 text-white font-medium hover:bg-purple-700 disabled:opacity-60 transition-all duration-200 shadow-md shadow-purple-900/20 hover:-translate-y-0.5 hover:shadow-purple-900/30"
            >
              {status === 'loading' ? 'Enviando...' : 'Quero receber novidades'}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4">
            Sem spam. Você pode sair a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  )
}
