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
      {
        protocol: "https",
        hostname: "bucket-rfbkoj.s3.ap-south-1.amazonaws.com",
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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.razorpay.com https://www.googletagmanager.com https://cdn.counter.dev https://cdnjs.cloudflare.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      // *.ufs.sh / utfs.io = UploadThing CDN (LMS course thumbnails + event banners)
      "img-src 'self' data: blob: https://img.youtube.com https://ui-avatars.com https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com https://*.ufs.sh https://utfs.io https://*.razorpay.com",
      // Razorpay checkout modal is an iframe on api.razorpay.com → frame-src must allow *.razorpay.com
      "frame-src 'self' https://www.youtube.com https://*.razorpay.com",
      "connect-src 'self' https://*.razorpay.com https://lumberjack.razorpay.com https://lumberjack-cx.razorpay.com https://www.google-analytics.com https://region1.google-analytics.com",
      "media-src 'self' blob: https://bucket-rfbkoj.s3.ap-south-1.amazonaws.com https://*.ufs.sh https://utfs.io",
      "object-src 'none'",
      "base-uri 'self'",
      // *.razorpay.com so redirect-based methods (netbanking/UPI) can POST back
      "form-action 'self' https://*.razorpay.com",
    ].join("; ");

    return [
      // ── Security headers on every page response ──────────────────────────
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",   value: "nosniff" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy",   value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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
