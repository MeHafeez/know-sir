"use client";

import { useTranslationLoading } from "@/context/TranslationStoreContext";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2 } from "lucide-react";

export default function TranslationLoader() {
  const loading = useTranslationLoading();
  const { localeName } = useLanguage();

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="translation-loader-title"
      aria-busy="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl px-8 py-7 max-w-sm mx-4 text-center border border-slate-200 dark:border-slate-700">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" aria-hidden="true" />
        <p id="translation-loader-title" className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Translating page
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading content in {localeName}…
        </p>
      </div>
    </div>
  );
}
