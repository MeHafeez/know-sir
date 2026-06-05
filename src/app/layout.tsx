import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F4C81" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "SIR Verification Help Portal — Complete Your Voter Verification Easily",
    template: "%s | SIR Verification Help Portal",
  },
  description:
    "Official public awareness portal for India's Special Intensive Revision (SIR) voter verification process. Understand what SIR is, required documents, and how to verify your voter details.",
  keywords: [
    "SIR Verification",
    "Voter Verification India",
    "Election Commission Verification",
    "Voter List Update",
    "Special Intensive Revision",
    "Electoral Roll",
    "ECI",
    "EPIC",
    "Voter ID",
    "मतदाता सत्यापन",
  ],
  authors: [{ name: "SIR Verification Help Portal" }],
  openGraph: {
    title: "SIR Verification Help Portal — Complete Your Voter Verification Easily",
    description: "Understand India's Special Intensive Revision voter verification process. Guidance for every Indian citizen.",
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN", "te_IN", "ta_IN"],
    siteName: "SIR Verification Help Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIR Verification Help Portal",
    description: "Complete your voter verification easily — guidance from official ECI resources.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isRtl = locale === "ur";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentService",
              name: "SIR Voter Verification Help Portal",
              description: "Public awareness portal for India's Special Intensive Revision (SIR) voter verification process.",
              url: "https://sir-verification-portal.vercel.app",
              provider: {
                "@type": "GovernmentOrganization",
                name: "Election Commission of India",
                url: "https://www.eci.gov.in",
              },
              areaServed: { "@type": "Country", name: "India" },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "1950",
                contactType: "Voter Helpline",
                availableLanguage: "Multilingual",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
