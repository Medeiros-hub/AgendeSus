import {
  type MiddlewareConfig,
  type NextRequest,
  NextResponse,
} from 'next/server';

const publicRoutes = [
  {
    path: '/auth/sign-in',
    whenAuthenticated: 'redirect',
  },
  {
    path: '/auth/sign-up',
    whenAuthenticated: 'redirect',
  },
  {
    path: '/auth/scheduling',
    whenAuthenticated: 'redirect',
  },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_TO = '/auth/sign-in';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === pathname);
  const authToken = request.cookies.get('agendesus_token');

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_TO;

    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    const isTokenExpired = false; // implementar verificação de token expirado

    if (isTokenExpired) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_TO;
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
