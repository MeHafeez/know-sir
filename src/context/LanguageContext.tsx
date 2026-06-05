"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { usePathname } from "next/navigation";

export const SUPPORTED_LOCALES = {
  en: "English",
  hi: "हिंदी",
  te: "తెలుగు",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  mr: "मराठी",
  gu: "ગુજરાતી",
  pa: "ਪੰਜਾਬੀ",
  bn: "বাংলা",
  or: "ଓଡ଼ିଆ",
  as: "অসমীয়া",
  ur: "اردو",
} as const;

export type LocaleCode = keyof typeof SUPPORTED_LOCALES;

interface LanguageContextValue {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  localeName: string;
  isTranslating: boolean;
  setTranslating: (v: boolean) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  localeName: "English",
  isTranslating: false,
  setTranslating: () => {},
});

function localeFromPath(pathname: string): LocaleCode | null {
  const seg = pathname.split("/")[1] as LocaleCode;
  return seg && seg in SUPPORTED_LOCALES ? seg : null;
}

export function LanguageProvider({ children, initialLocale = "en" }: { children: ReactNode; initialLocale?: string }) {
  const pathname = usePathname();
  const pathLocale = localeFromPath(pathname);

  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    if (pathLocale) return pathLocale;
    return (initialLocale in SUPPORTED_LOCALES ? initialLocale : "en") as LocaleCode;
  });
  const [isTranslating, setTranslating] = useState(false);

  const setLocale = useCallback((code: LocaleCode) => {
    if (!(code in SUPPORTED_LOCALES)) return;
    setLocaleState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("sir_locale", code);
    }
  }, []);

  // Keep context in sync when the URL locale changes (nav, back/forward)
  useEffect(() => {
    if (pathLocale && pathLocale !== locale) {
      setLocaleState(pathLocale);
      if (typeof window !== "undefined") {
        localStorage.setItem("sir_locale", pathLocale);
      }
    }
  }, [pathLocale, locale]);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        localeName: SUPPORTED_LOCALES[locale],
        isTranslating,
        setTranslating,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
