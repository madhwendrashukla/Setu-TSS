import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge Middleware — Admin Route Protection & Global CSP
 *
 * All /admin/* paths except the login page itself (/admin) and the SSO handoff
 * (/admin/handoff-exchange) require an adminToken cookie to be present.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // The Strict Admin CSP uses the nonce to allow Next.js hydration scripts
  // without needing 'unsafe-inline' or 'unsafe-eval', fully mitigating XSS risks.
  //
  // YouTube is allowed in frame-src/img-src because /admin/bottom-videos previews
  // each entry with a <iframe src="https://www.youtube.com/embed/...">; under a bare
  // frame-src 'self' those previews render as a blocked frame.
  const adminCsp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https://img.youtube.com https://ui-avatars.com https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com https://setu-tss-uploads.s3.ap-south-1.amazonaws.com https://*.ufs.sh https://utfs.io; frame-src 'self' https://www.youtube.com https://player.vimeo.com; connect-src 'self' http://localhost:5000 https://*.razorpay.com; media-src 'self' blob: https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com https://setu-tss-uploads.s3.ap-south-1.amazonaws.com https://*.ufs.sh https://utfs.io; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`;

  const isProtectedAdminPath =
    pathname.startsWith('/admin') &&
    pathname !== '/admin' &&
    !pathname.startsWith('/admin/handoff');

  // A `next` value worth echoing back: /admin, optionally followed by path
  // segments of ordinary URL characters. Permits the real routes including the
  // UUID in /admin/events/<id>/builder, and nothing else.
  const PLAUSIBLE_ADMIN_PATH = /^\/admin(?:\/[A-Za-z0-9_-]+)*\/?$/;

  if (isProtectedAdminPath) {
    const token = req.cookies.get('adminToken')?.value;
    if (!token) {
      const loginUrl = new URL('/admin', req.url);

      // ⚠️ ONLY ECHO `next` BACK IF IT LOOKS LIKE A REAL ADMIN ROUTE.
      //
      // This is defence in depth, not a fix for an exploitable bug: the value is
      // URL-encoded on the way out, and app/admin/handoff/page.tsx already
      // refuses to navigate anywhere that fails startsWith('/admin'), so it was
      // never an open redirect or an XSS vector.
      //
      // 🔴 IT IS HERE BECAUSE ARBITRARY ATTACKER-CONTROLLED TEXT WAS BEING
      // REFLECTED INTO THE LOGIN PAGE'S RSC PAYLOAD. Fuzzing /admin/ with
      // punctuation produced a 307 whose target echoed the junk straight back,
      // and a payload containing attacker input *looks* like a disclosure to
      // anyone reading it — which is why the same finding was raised three
      // times. A garbage path now simply loses its `next`, and the user lands
      // on the login page with no query string at all.
      if (PLAUSIBLE_ADMIN_PATH.test(pathname)) {
        loginUrl.searchParams.set('next', pathname);
      }
      
      const redirectResponse = NextResponse.redirect(loginUrl);
      // For the 307 redirect, a completely restrictive CSP is perfectly safe since there is no body to render
      const strictRedirectCsp = "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';";
      redirectResponse.headers.set('Content-Security-Policy', strictRedirectCsp);
      redirectResponse.headers.set('X-Content-Type-Options', 'nosniff');
      
      return redirectResponse;
    }
  }

  // Pass the nonce to Next.js App Router for automatic <script> tagging.
  //
  // ⚠️ BOTH headers are required. Next.js only auto-nonces its own bootstrap and
  // hydration scripts when it can read the CSP from the REQUEST headers; setting
  // it on the response alone is not enough. Because the admin CSP uses
  // 'strict-dynamic' — which makes 'self' and every host allowlist be IGNORED for
  // script-src — an un-nonced page means NO script executes on /admin/*, so the
  // admin panel renders HTML and then silently fails to hydrate (no login, no
  // navigation). Do not remove the Content-Security-Policy request header.
  const requestHeaders = new Headers(req.headers);

  // The current path, exposed to SERVER components. Next.js gives server
  // components no way to read the pathname, so anything that needs to decide
  // "should this route load this data at all?" has to be told from here.
  //
  // 🔴 WITHOUT THIS, THE ONLY PLACE TO MAKE THAT DECISION IS A CLIENT COMPONENT
  // — AND BY THEN IT IS TOO LATE. A client component that returns null still
  // received its props, and props crossing the server/client boundary are
  // serialized into the RSC flight payload and shipped to the browser. That is
  // exactly how siteSettings was reaching unauthenticated /admin viewers: the
  // footer was fetched on the server for every route and merely *hidden* on
  // /admin in the browser. See components/layout/FooterLoader.tsx.
  requestHeaders.set('x-pathname', pathname);

  if (pathname.startsWith('/admin')) {
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', adminCsp);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
  
  // Analytics hosts: GTM loads from googletagmanager, but GA4 / Google Ads / counter.dev then
  // beacon out to a WIDER set of hosts than the tag itself. Until 2026-08-06 those beacons were
  // all CSP-blocked, so GTM ran and silently collected nothing. Removing any of these hosts
  // switches analytics back off without any visible symptom — check the console for
  // "violates the following Content Security Policy" before assuming a tracking problem is
  // upstream. Vimeo is in frame-src because lib/video.ts normalises Vimeo URLs to
  // player.vimeo.com embeds.
  const frontendCsp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.razorpay.com https://www.googletagmanager.com https://cdn.counter.dev https://cdnjs.cloudflare.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https://img.youtube.com https://ui-avatars.com https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com https://setu-tss-uploads.s3.ap-south-1.amazonaws.com https://*.ufs.sh https://utfs.io https://*.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.google.co.in https://googleads.g.doubleclick.net https://stats.g.doubleclick.net; frame-src 'self' https://www.youtube.com https://player.vimeo.com https://*.razorpay.com; connect-src 'self' https://*.razorpay.com https://lumberjack.razorpay.com https://lumberjack-cx.razorpay.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://stats.g.doubleclick.net https://ad.doubleclick.net https://t.counter.dev; media-src 'self' blob: https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com https://setu-tss-uploads.s3.ap-south-1.amazonaws.com https://*.ufs.sh https://utfs.io; object-src 'none'; base-uri 'self'; form-action 'self' https://*.razorpay.com; upgrade-insecure-requests";
  const apiCsp = "default-src 'none'; base-uri 'self'; font-src 'none'; form-action 'self'; frame-ancestors 'none'; img-src 'none'; object-src 'none'; script-src 'none'; script-src-attr 'none'; style-src 'none'; upgrade-insecure-requests; connect-src 'self'";
  
  if (pathname.startsWith('/api/')) {
    response.headers.set('Content-Security-Policy', apiCsp);
  } else if (pathname.startsWith('/admin')) {
    response.headers.set('Content-Security-Policy', adminCsp);
  } else {
    response.headers.set('Content-Security-Policy', frontendCsp);
  }
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  // Broad matcher ensures all paths are intercepted (preventing path-to-regexp bypass via special characters)
  // while excluding Next.js core static asset namespaces.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
};

