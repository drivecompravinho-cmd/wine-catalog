import type { Metadata } from 'next'
import { HomeHeader } from './components/home/HomeHeader'
import { HeroSection } from './components/home/HeroSection'
import { VinotecastSection } from './components/home/VinotecastSection'
import { OfertasSection } from './components/home/OfertasSection'
import { NoticiasSection } from './components/home/NoticiasSection'
import { BlogSection } from './components/home/BlogSection'
import { GuiaSection } from './components/home/GuiaSection'
import { BannersSection } from './components/home/BannersSection'
import { CTAVinotecas } from './components/home/CTAVinotecas'
import { NewsletterSection } from './components/home/NewsletterSection'
import { HomeFooter } from './components/home/HomeFooter'

// ─── SEO ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'COMPRAVINHO | Vinotecas, vinhos e notícias da fronteira Brasil-Argentina',
  description:
    'Encontre vinotecas, ofertas de vinhos, notícias e conteúdos sobre Dionísio Cerqueira, Barracão e Bernardo de Irigoyen no COMPRAVINHO.',
  keywords: [
    'vinotecas na fronteira',
    'vinhos na fronteira',
    'vinhos em Dionísio Cerqueira',
    'vinhos em Barracão',
    'vinhos em Bernardo de Irigoyen',
    'comprar vinho na fronteira',
    'catálogo digital de vinhos',
    'ofertas de vinhos',
    'fronteira Brasil Argentina',
    'turismo em Dionísio Cerqueira',
    'turismo em Barracão',
    'turismo em Bernardo de Irigoyen',
  ],
  authors: [{ name: 'COMPRAVINHO' }],
  creator: 'COMPRAVINHO',
  metadataBase: new URL('https://compravinho.com.br'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'COMPRAVINHO | Vinotecas, vinhos e notícias da fronteira',
    description:
      'Descubra vinotecas, ofertas de vinhos e notícias da fronteira Brasil-Argentina. Portal de vinhos de Dionísio Cerqueira, Barracão e Bernardo de Irigoyen.',
    url: 'https://compravinho.com.br',
    siteName: 'COMPRAVINHO',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COMPRAVINHO | Vinotecas e vinhos da fronteira Brasil-Argentina',
    description: 'Portal de vinhos, vinotecas, ofertas e notícias da fronteira Brasil-Argentina.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

// ─── JSON-LD Estruturado ─────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://compravinho.com.br/#organization',
      name: 'COMPRAVINHO',
      url: 'https://compravinho.com.br',
      logo: 'https://compravinho.com.br/logo.png',
      description:
        'Portal de vinhos, vinotecas e notícias da fronteira Brasil-Argentina. Conectamos consumidores a vinotecas de Dionísio Cerqueira, Barracão e Bernardo de Irigoyen.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dionísio Cerqueira',
        addressRegion: 'SC',
        addressCountry: 'BR',
      },
      sameAs: [
        'https://instagram.com/compravinho',
        'https://facebook.com/compravinho',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://compravinho.com.br/#website',
      url: 'https://compravinho.com.br',
      name: 'COMPRAVINHO',
      publisher: { '@id': 'https://compravinho.com.br/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://compravinho.com.br/busca?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://compravinho.com.br/#localbusiness',
      name: 'COMPRAVINHO',
      url: 'https://compravinho.com.br',
      description: 'Portal de vinhos e vinotecas da fronteira Brasil-Argentina',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dionísio Cerqueira',
        addressRegion: 'SC',
        postalCode: '89900-000',
        addressCountry: 'BR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -26.259,
        longitude: -53.635,
      },
      areaServed: [
        { '@type': 'City', name: 'Dionísio Cerqueira' },
        { '@type': 'City', name: 'Barracão' },
        { '@type': 'City', name: 'Bernardo de Irigoyen' },
      ],
    },
    {
      '@type': 'Blog',
      '@id': 'https://compravinho.com.br/blog#blog',
      name: 'Blog do Vinho - COMPRAVINHO',
      url: 'https://compravinho.com.br/blog',
      description: 'Dicas, curiosidades e tendências do universo vinícola',
      publisher: { '@id': 'https://compravinho.com.br/#organization' },
    },
  ],
}

// ─── Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Layout */}
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Header fixo */}
        <HomeHeader />

        {/* Conteúdo principal */}
        <main>
          {/* 1. Hero */}
          <HeroSection />

          {/* 2. Vinotecas cadastradas */}
          <VinotecastSection />

          {/* 3. Ofertas em destaque */}
          <OfertasSection />

          {/* 4. Notícias da fronteira */}
          <NoticiasSection />

          {/* 5. Blog do Vinho */|
          <BlogSection />

          {/* 6. Guia da Fronteira */}
          <GuiaSection />

          {/* 7. Banners comerciais */}
          <BannersSection />

          {/* 8. CTA Vinotecas */}
          <CTAVinotecas />

          {/* 9. Newsletter / WhatsApp */}
          <NewsletterSection />
        </main>

        {/* Footer */}
        <HomeFooter />
      </div>
    </>
  )
}
