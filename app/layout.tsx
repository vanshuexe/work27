import type { Metadata, Viewport } from "next";
import { Cinzel, Noto_Sans_Devanagari, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { POPULAR_SEARCHES, SEO_DESCRIPTION, SEO_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cinzel" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-poppins" });
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-devanagari",
});

const KEYWORDS = [
  "Astrologer Kali Charan",
  "love problem solution",
  "love back astrologer",
  "love marriage specialist",
  "husband wife problem solution",
  "inter caste marriage",
  "divorce problem solution",
  "family problem solution",
  "vashikaran specialist",
  ...POPULAR_SEARCHES.flatMap((g) => g.tags),
];

// Tracking tags from the original page. They only load when the IDs are set (see .env.example).
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  category: "astrology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [{ url: "/assets/img/logo-kali-charan.webp", width: 640, height: 640, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: ["/assets/img/logo-kali-charan.webp"],
  },
  icons: {
    icon: "/assets/img/favicon-kali-charan.png",
    apple: "/assets/img/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0a1c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cinzel.variable} ${poppins.variable} ${devanagari.variable}`}>
      <body>
        {GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        {GADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GADS_ID}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
