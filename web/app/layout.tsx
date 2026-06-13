import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import FooterLoader from "@/components/layout/FooterLoader";
import ChatBotGate from "@/components/layout/ChatBotGate";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thestartupschool.in"),
  title: "Setu - TheStartupSchool | An Alternate B-School for Aspiring Founders",
  description: "An alternate B-School for all Aspiring Founders. Bridging the 4 deadly gaps of Learning, Access, Mentoring, and Community.",
  keywords: ["Startup School India", "Entrepreneurship Program India", "Founder Community", "Startup Mentorship", "B-School for Founders", "Startup Incubator India", "Learn Fundraising", "Angel Investors India", "Startup Education", "Setu - TheStartupSchool", "Aspiring Founders", "Startup Cohort India", "Business School Alternative"],
  authors: [{ name: "Gaurav Bansal" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Setu - TheStartupSchool | An Alternate B-School for Aspiring Founders",
    description: "An alternate B-School for all Aspiring Founders. Bridging the 4 deadly gaps of Learning, Access, Mentoring, and Community.",
    url: "https://thestartupschool.in",
    siteName: "Setu - TheStartupSchool",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Setu - TheStartupSchool Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Setu - TheStartupSchool | An Alternate B-School for Aspiring Founders",
    description: "An alternate B-School for all Aspiring Founders.",
    creator: "@TheStartupSchool",
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  verification: {
    google: "OhWDLA9MOYXN364Zlna9Qve4XwFMHHl1yUoiY28u-Pk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MSC2KFNM');
          `}
        </Script>
        {/* End Google Tag Manager */}
        {/* Font Awesome — Use standard link for better reliability */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased bg-bg-main text-text-primary selection:bg-accent-blue selection:text-white overflow-x-hidden`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MSC2KFNM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Navbar />
        <main className="min-h-screen overflow-x-hidden w-full">
          {children}
        </main>
        <FooterLoader />
        <ChatBotGate />
      </body>
    </html>
  );
}
