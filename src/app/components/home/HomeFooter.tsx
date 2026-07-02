import Link from 'next/link'

const navegacao = [
  { label: 'Início', href: '/' },
  { label: 'Vinotecas', href: '/vinotecas' },
  { label: 'Ofertas', href: '/ofertas' },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Blog do Vinho', href: '/blog' },
  { label: 'Guia da Fronteira', href: '/guia' },
]

const paraVinotecas = [
  { label: 'Cadastrar vinoteca', href: '/para-vinotecas' },
  { label: 'Anunciar ofertas', href: '/para-vinotecas#ofertas' },
  { label: 'Planos e benefícios', href: '/para-vinotecas#planos' },
  { label: 'Dúvidas frequentes', href: '/para-vinotecas#faq' },
  { label: 'Contato', href: '/contato' },
]

const institucional = [
  { label: 'Sobre nós', href: '/sobre' },
  { label: 'Termos de uso', href: '/termos' },
  { label: 'Política de privacidade', href: '/privacidade' },
  { label: 'Anuncie aqui', href: '/anuncie' },
  { label: 'Trabalhe conosco', href: '/trabalhe-conosco' },
]

const ajuda = [
  { label: 'Central de ajuda', href: '/ajuda' },
  { label: 'Como funciona o COMPRAVINHO', href: '/ajuda/como-funciona' },
  { label: 'Dicas para vinotecas', href: '/ajuda/dicas-vinotecas' },
  { label: 'Contato e atendimento', href: '/contato' },
]

function FooterColumn({ titulo, links }: { titulo: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-4">{titulo}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-500 hover:text-purple-700 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HomeFooter() {
  return (
    <footer className="bg-white border-t border-gray-100" aria-label="Rodapé COMPRAVINHO">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main footer */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — ocupa 1 coluna */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-800 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2C9 2 4 6 4 10.5C4 13.5376 6.23858 16 9 16C11.7614 16 14 13.5376 14 10.5C14 6 9 2 9 2Z" fill="white"/>
                  <path d="M9 6L9 13" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-bold text-base text-gray-900 tracking-tight">
                COMPRA<span className="text-purple-800">VINHO</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Fronteira de bons vinhos, histórias e experiências únicas entre Brasil e Argentina.
            </p>

            {/* Redes sociais */}
            <div className="flex gap-3 mt-5">
              {[
                { label: 'Instagram do COMPRAVINHO', icon: 'instagram', href: 'https://instagram.com/compravinho' },
                { label: 'Facebook do COMPRAVINHO', icon: 'facebook', href: 'https://facebook.com/compravinho' },
                { label: 'WhatsApp COMPRAVINHO', icon: 'whatsapp', href: 'https://wa.me/5549999999999' },
              ].map(({ label, icon, href }) => (
                <a
                  key={icon}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-purple-100 hover:text-purple-700 transition-colors"
                >
                  {icon === 'instagram' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  )}
                  {icon === 'facebook' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  )}
                  {icon === 'whatsapp' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Colunas de links */}
          <FooterColumn titulo="Navegação" links={navegacao} />
          <FooterColumn titulo="Para vinotecas" links={paraVinotecas} />
          <FooterColumn titulo="Institucional" links={institucional} />
          <FooterColumn titulo="Ajuda e suporte" links={ajuda} />
        </div>

        {/* Aviso legal */}
        <div className="border-t border-gray-100 py-6">
          <p className="text-xs text-gray-400 leading-relaxed max-w-3xl mb-4">
            <strong className="text-gray-500">Aviso importante:</strong> Os valores exibidos nos catálogos são informativos e podem sofrer alterações sem aviso prévio.
            O COMPRAVINHO não realiza venda online. Preços, estoque e disponibilidade são de responsabilidade exclusiva das vinotecas parceiras.
            A negociação final acontece diretamente com a vinoteca, geralmente via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} COMPRAVINHO. Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-400">
              Dionísio Cerqueira, SC · Barracão, PR · Bernardo de Irigoyen, AR
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
