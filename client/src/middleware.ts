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

const protectedRoutes = [
  {
    path: '/receptionist',
    allowedRoles: ['ADMIN', 'RECEPTIONIST'],
  },
  {
    path: '/attendant/register-doctor',
    allowedRoles: ['ADMIN', 'RECEPTIONIST'],
  },
  {
    path: '/attendant/dashboard',
    allowedRoles: ['ADMIN', 'RECEPTIONIST'],
  },
  {
    path: '/admin/users',
    allowedRoles: ['ADMIN'],
  },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_TO = '/auth/sign-in';
const REDIRECT_WHEN_UNAUTHORIZED_TO = '/';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === pathname);
  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path),
  );
  const authToken = request.cookies.get('agendesus_token');

  // Rota pública sem autenticação
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Rota privada sem autenticação - redireciona para login
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_TO;
    return NextResponse.redirect(redirectUrl);
  }

  // Usuário autenticado tentando acessar rota pública (ex: login)
  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  // Verifica role para rotas protegidas
  if (authToken && protectedRoute) {
    try {
      // Decodifica o token para obter a role do usuário
      const tokenValue = authToken.value;
      const base64Url = tokenValue.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const payload = JSON.parse(jsonPayload);
      const userType = payload.type || payload.role;

      // Verifica se o usuário tem permissão para acessar a rota
      if (!protectedRoute.allowedRoles.includes(userType)) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_UNAUTHORIZED_TO;
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_TO;
      return NextResponse.redirect(redirectUrl);
    }
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
