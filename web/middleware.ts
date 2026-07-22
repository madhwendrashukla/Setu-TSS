import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge Middleware — Admin Route Protection
 *
 * All /admin/* paths except the login page itself (/admin) and the SSO handoff
 * (/admin/handoff-exchange) require an adminToken cookie to be present.
 *
 * Why a cookie?  JWT is stored in localStorage (client-only) which is invisible
 * to the Edge runtime. On login we now also set a same-site cookie so this
 * middleware can read it at request time and redirect unauthenticated users
 * before the page HTML is ever served (fixes the "200 OK + full SPA shell"
 * issue reported in QA).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedAdminPath =
    pathname.startsWith('/admin') &&
    pathname !== '/admin' &&
    !pathname.startsWith('/admin/handoff-exchange');

  if (isProtectedAdminPath) {
    const token = req.cookies.get('adminToken')?.value;
    if (!token) {
      const loginUrl = new URL('/admin', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run on /admin/* — skip API routes, _next static, favicon etc.
  matcher: ['/admin/:path+'],
};
