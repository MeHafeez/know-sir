"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useTranslationByEnglish, useTranslationLoading } from "@/context/TranslationStoreContext";

/**
 * Reads translated strings from the central translation store.
 * All API translation happens once in TranslationStoreProvider.
 */
export function useAutoTranslate<T extends Record<string, string>>(source: T): T {
  const { locale } = useLanguage();
  const byEnglish = useTranslationByEnglish();
  useTranslationLoading(); // subscribe to loading state for re-renders

  if (locale === "en") {
    return source;
  }

  const result = { ...source } as T;
  for (const key of Object.keys(source) as (keyof T)[]) {
    const original = source[key] as string;
    result[key] = (byEnglish[original] ?? original) as T[keyof T];
  }
  return result;
}

export function useTranslateText(text: string): string {
  const result = useAutoTranslate({ text });
  return result.text;
}
