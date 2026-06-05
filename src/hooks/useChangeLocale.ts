"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage, SUPPORTED_LOCALES, type LocaleCode } from "@/context/LanguageContext";

/** Change locale, update URL, persist choice, and keep the user at the top of the page. */
export function useChangeLocale() {
  const { setLocale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  return useCallback(
    (code: LocaleCode) => {
      if (!(code in SUPPORTED_LOCALES)) return;

      setLocale(code);

      const segments = pathname.split("/");
      if (segments[1] in SUPPORTED_LOCALES) {
        segments[1] = code;
      } else {
        segments.splice(1, 0, code);
      }

      router.push(segments.join("/") || "/");
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [pathname, router, setLocale]
  );
}
