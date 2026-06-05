"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useInView } from "react-intersection-observer";
import { Copy, RefreshCw, UserCheck, BarChart3, ShieldCheck, Heart } from "lucide-react";

const icons = [Copy, RefreshCw, UserCheck, BarChart3, ShieldCheck, Heart];
const colorMap: Record<string, string> = {
  primary: "border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20",
  success: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
  warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20",
  secondary: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
};
const iconColorMap: Record<string, string> = {
  primary: "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400",
  success: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400",
  warning: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-500",
  secondary: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400",
};

export default function WhyImportant() {
  const t = useTranslationFn("whyImportant");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const cards = t.raw("cards") as { title: string; desc: string; color: string }[];

  return (
    <section id="why-important" className="section-padding bg-white dark:bg-slate-950" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="section-badge mb-4">{t("badge")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = icons[i] || ShieldCheck;
            const color = colorMap[card.color] || colorMap.primary;
            const iconColor = iconColorMap[card.color] || iconColorMap.primary;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`card-hover p-6 border-2 ${color}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iconColor}`}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 flex items-center gap-2">
                  <span className="text-success text-xl" aria-hidden="true">✓</span>
                  {card.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-primary-700 text-white rounded-2xl px-8 py-6">
            <div className="text-4xl" role="img" aria-label="Vote illustration">🗳️</div>
            <div className="text-left">
              <p className="font-bold text-lg">Your vote matters. Protect it.</p>
              <p className="text-white/80 text-sm">Complete SIR verification to ensure your vote counts.</p>
            </div>
            <a
              href="#steps"
              className="flex-shrink-0 bg-white text-primary-700 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Verify Now →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
