import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Aggressive image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      // 🔴 The old Lightsail bucket (bucket-rfbkoj, on Madhwendra's PERSONAL AWS
      // account) was listed here and in the CSP as a migration rollback. This
      // note used to say "remove at Phase 8 decommission, once the old server is
      // gone" — that happened on 11 Aug 2026, so it has been removed. Verified
      // first: zero references in the served HTML and zero in the database.
      {
        // Current uploads bucket, on SETU's own account (migrated 11 Aug 2026).
        // Without this entry /_next/image answers 400 for every S3 image.
        protocol: "https",
        hostname: "setu-tss-uploads.s3.ap-south-1.amazonaws.com",
      },
      {
        // UploadThing CDN — the LMS stores course thumbnails + event banners here
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "192.168.31.194",
        port: "5000",
      },
    ],
  },
  // Compression
  compress: true,
  // Power-user optimizations
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ["lucide-react", "next/font"],
  },
  // Security + cache headers
  async headers() {
    // Content-Security-Policy for all page routes
    const csp = [
      "default-src 'self'",
      // Next.js inlines scripts at runtime; GTM and Razorpay need 'unsafe-inline'.
      // *.razorpay.com covers checkout.razorpay.com, api.razorpay.com, cdn.razorpay.com, etc.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.razorpay.com https://www.googletagmanager.com https://cdn.counter.dev https://cdnjs.cloudflare.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      // *.ufs.sh / utfs.io = UploadThing CDN (LMS course thumbnails + event banners)
      "img-src 'self' data: blob: https://img.youtube.com https://ui-avatars.com https://setu-tss-uploads.s3.ap-south-1.amazonaws.com https://*.ufs.sh https://utfs.io https://*.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.google.co.in https://googleads.g.doubleclick.net https://stats.g.doubleclick.net",
      // Razorpay checkout modal is an iframe on api.razorpay.com → frame-src must allow *.razorpay.com
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://*.razorpay.com",
      "connect-src 'self' https://*.razorpay.com https://lumberjack.razorpay.com https://lumberjack-cx.razorpay.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://stats.g.doubleclick.net https://ad.doubleclick.net https://t.counter.dev",
      "media-src 'self' blob: https://setu-tss-uploads.s3.ap-south-1.amazonaws.com https://*.ufs.sh https://utfs.io",
      "object-src 'none'",
      "base-uri 'self'",
      // *.razorpay.com so redirect-based methods (netbanking/UPI) can POST back
      "form-action 'self' https://*.razorpay.com",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      // ── Security headers on every page response ──────────────────────────
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",   value: "nosniff" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy",   value: csp },
          // Deliberately SHORT while the site settles after the 11 Aug 2026 cutover.
          //
          // This header only started taking effect when HTTPS went live — over plain
          // http browsers ignore it — and the previous value (max-age=63072000,
          // i.e. two years, plus `preload`) silently broke the documented rollback:
          // once a browser has seen it, that hostname CANNOT be served over http
          // again for the lifetime of the max-age, so falling back to the old server
          // would fail for every visitor who had already loaded the site.
          //
          // `preload` was also removed. It is an application to the browsers' built-in
          // preload list; getting removed from that list takes months and is out of
          // our hands, so it is not something to carry by accident.
          //
          // Raise this to a year once the site has been stable on https for a week or
          // two, and only add `preload` as a deliberate, separate decision.
          { key: "Strict-Transport-Security", value: "max-age=86400; includeSubDomains" },
        ],
      },
      // ── Cache headers for static assets ──────────────────────────────────
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/gallery/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // Proxy uploads in local dev
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://localhost:5000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
