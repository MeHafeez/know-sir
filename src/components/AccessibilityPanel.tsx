"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useInView } from "react-intersection-observer";
import {
  Type, Contrast, BookOpen, MessageSquare, Volume2, RotateCcw,
  ALargeSmall, Accessibility
} from "lucide-react";
import { useAccessibility } from "@/components/providers/AccessibilityProvider";
import { cn } from "@/lib/utils";

export default function AccessibilityPanel() {
  const t = useTranslationFn("accessibility");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const {
    fontSize, setFontSize,
    highContrast, toggleHighContrast,
    dyslexiaFont, toggleDyslexiaFont,
    simpleMode, toggleSimpleMode,
    textToSpeech, toggleTextToSpeech,
    resetAll,
  } = useAccessibility();

  const fontSizes = [
    { id: "sm" as const, label: t("fontSmall") },
    { id: "md" as const, label: t("fontNormal") },
    { id: "lg" as const, label: t("fontLarge") },
    { id: "xl" as const, label: t("fontXL") },
  ];

  const toggles = [
    { id: "contrast", label: t("highContrast"), active: highContrast, fn: toggleHighContrast, icon: Contrast },
    { id: "dyslexia", label: t("dyslexiaFont"), active: dyslexiaFont, fn: toggleDyslexiaFont, icon: BookOpen },
    { id: "simple", label: t("simpleLanguage"), active: simpleMode, fn: toggleSimpleMode, icon: MessageSquare },
    { id: "tts", label: t("textToSpeech"), active: textToSpeech, fn: toggleTextToSpeech, icon: Volume2 },
  ];

  return (
    <section id="accessibility" className="section-padding bg-primary-50 dark:bg-primary-950/30" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center">
              <Accessibility className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t("title")}</h2>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto card-base p-6 md:p-8 space-y-8">
          {/* Font Size */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ALargeSmall className="w-5 h-5 text-primary-700 dark:text-primary-400" aria-hidden="true" />
              <h3 className="font-bold text-slate-900 dark:text-white">{t("fontSize")}</h3>
            </div>
            <div className="grid grid-cols-4 gap-2" role="group" aria-label="Select text size">
              {fontSizes.map((fs) => (
                <button
                  key={fs.id}
                  onClick={() => setFontSize(fs.id)}
                  aria-pressed={fontSize === fs.id}
                  className={cn(
                    "py-2.5 px-2 rounded-xl text-sm font-semibold transition-all border-2",
                    fontSize === fs.id
                      ? "bg-primary-700 text-white border-primary-700"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300"
                  )}
                >
                  {fs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle options */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-primary-700 dark:text-primary-400" aria-hidden="true" />
              <h3 className="font-bold text-slate-900 dark:text-white">Display Options</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {toggles.map((toggle) => (
                <button
                  key={toggle.id}
                  onClick={toggle.fn}
                  aria-pressed={toggle.active}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    toggle.active
                      ? "bg-primary-700 text-white border-primary-700"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600"
                  )}
                >
                  <toggle.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-sm">{toggle.label}</div>
                    <div className={cn("text-xs mt-0.5", toggle.active ? "text-white/70" : "text-slate-400")}>
                      {toggle.active ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className={cn(
                    "ml-auto w-10 h-6 rounded-full transition-colors flex items-center",
                    toggle.active ? "bg-white/30" : "bg-slate-200 dark:bg-slate-600"
                  )}>
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white shadow transition-transform mx-1",
                      toggle.active ? "translate-x-4" : "translate-x-0"
                    )} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              onClick={resetAll}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-danger transition-colors"
              aria-label="Reset all accessibility settings to default"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              {t("reset")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
