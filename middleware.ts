import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

// All routes under /admin/* except /admin/login are protected
const PROTECTED_PATHS = ['/admin/dashboard', '/admin/applicants', '/admin/analytics', '/admin/settings', '/admin/search'];
const LOGIN_PATH = '/admin/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a protected admin route
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      // Redirect to admin login
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate session is parseable
    try {
      const session = JSON.parse(
        Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
      );
      if (!session?.id || !session?.email) {
        throw new Error('Invalid session');
      }
    } catch {
      const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }

  // If already logged in, redirect /admin/login to dashboard
  if (pathname === LOGIN_PATH) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(
          Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
        );
        if (session?.id && session?.email) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      } catch {
        // Invalid session, allow to login page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
