import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getServerBackendUrl } from '@/lib/apiClient';

const OSS_TOKEN_COOKIE = 'switchyard_auth_token';

// Paths that don't require authentication in OSS mode.
const PUBLIC_PATHS = ['/login', '/signup', '/auth/login', '/auth/signup', '/embed'];

let cachedAuthProvider: string | null = null;

async function fetchAuthProvider(): Promise<string> {
  if (cachedAuthProvider) {
    return cachedAuthProvider;
  }

  try {
    const backendUrl = getServerBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/health`);
    if (res.ok) {
      const data = await res.json();
      // Only cache a DEFINITIVE answer from the backend. Never cache a failure:
      // this is a module-scoped cache with no TTL, so a single early request
      // during container startup (before the api service is reachable) would
      // otherwise poison it to 'local' for the life of the worker — redirecting
      // every Stack user to the local /login form even though the backend
      // reports `stack`.
      cachedAuthProvider = (data.auth_provider as string) || 'local';
      return cachedAuthProvider;
    }
  } catch {
    // Backend not reachable — fall through without caching so we retry next request.
  }

  // Provider unknown (backend unreachable). Return a non-'local' sentinel so the
  // middleware does NOT guard/redirect: assuming 'local' here would bounce Stack
  // users to /login. Deliberately not cached — the next request retries.
  return 'unknown';
}

export async function middleware(request: NextRequest) {
  const authProvider = await fetchAuthProvider();

  // Only handle OSS mode
  if (authProvider !== 'local') {
    return NextResponse.next();
  }

  const token = request.cookies.get(OSS_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/auth/login' ||
    pathname === '/auth/signup';

  // If user is already authenticated and visits login/signup, redirect to overview/dashboard
  if (token && isAuthPage) {
    const overviewUrl = new URL('/overview', request.url);
    return NextResponse.redirect(overviewUrl);
  }

  // Coming Soon routes: redirect direct URL visits to /overview
  const COMING_SOON_PATHS = ['/tools', '/api-keys', '/billing'];
  if (COMING_SOON_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const overviewUrl = new URL('/overview', request.url);
    return NextResponse.redirect(overviewUrl);
  }

  // Allow public paths without auth. Match on a path-segment boundary (exact
  // match or a `/`-delimited subpath) rather than a bare prefix, so a public
  // entry like `/embed` exempts `/embed` and `/embed/...` but NOT sibling
  // routes such as `/embed-admin` — a bare startsWith would let those bypass
  // authentication.
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public static assets (anything with a file extension, e.g. /dograh-logo.png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf)).*)',
  ],
};
