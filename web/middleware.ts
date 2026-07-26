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
      
      const redirectResponse = NextResponse.redirect(loginUrl);
      const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://cdn.counter.dev https://cdnjs.cloudflare.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https://img.youtube.com https://ui-avatars.com https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com; frame-src 'self' https://www.youtube.com https://checkout.razorpay.com; connect-src 'self' https://api.razorpay.com https://www.google-analytics.com https://region1.google-analytics.com; media-src 'self' blob: https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com; object-src 'none'; base-uri 'self'; form-action 'self'";
      redirectResponse.headers.set('Content-Security-Policy', csp);
      redirectResponse.headers.set('X-Content-Type-Options', 'nosniff');
      
      return redirectResponse;
    }
  }

  // We intercept the response to guarantee CSP headers are injected at the Edge level
  // because next.config.ts static headers are sometimes dropped during middleware evaluation.
  const response = NextResponse.next();
  
  const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://cdn.counter.dev https://cdnjs.cloudflare.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https://img.youtube.com https://ui-avatars.com https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com; frame-src 'self' https://www.youtube.com https://checkout.razorpay.com; connect-src 'self' https://api.razorpay.com https://www.google-analytics.com https://region1.google-analytics.com; media-src 'self' blob: https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com; object-src 'none'; base-uri 'self'; form-action 'self'";
  
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  // Broad matcher ensures all paths are intercepted (preventing path-to-regexp bypass via special characters)
  // while excluding Next.js core static asset namespaces.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
};

