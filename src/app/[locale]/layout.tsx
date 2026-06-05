import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AccessibilityProvider } from "@/components/providers/AccessibilityProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { TranslationStoreProvider } from "@/context/TranslationStoreContext";
import TranslationLoader from "@/components/TranslationLoader";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === "ur";
  return {
    other: {
      dir: isRtl ? "rtl" : "ltr",
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <LanguageProvider initialLocale={locale}>
      <TranslationStoreProvider>
      <TranslationLoader />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange={false}
      >
        <NextIntlClientProvider messages={messages}>
          <AccessibilityProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            {children}
          </AccessibilityProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
      </TranslationStoreProvider>
    </LanguageProvider>
  );
}
