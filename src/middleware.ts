import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROOT_DOMAIN = 'compravinho.com.br';

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const host = hostname.split(':')[0]; // strip port

  // Only act on subdomains of our root domain
  if (!host.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  const subdomain = host.slice(0, -(ROOT_DOMAIN.length + 1));

  // Skip www and empty
  if (!subdomain || subdomain === 'www') {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();

  // Rewrite / to /catalogo/[slug]
  if (url.pathname === '/') {
    url.pathname = `/catalogo/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\.ico).*)'],
};
