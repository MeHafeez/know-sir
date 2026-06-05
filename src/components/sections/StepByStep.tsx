"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useInView } from "react-intersection-observer";
import {
  Search, FolderOpen, FileText, Upload, Activity, CheckCircle, ExternalLink
} from "lucide-react";
import contentData from "@/config/content.json";

const stepIcons: Record<string, React.ElementType> = {
  search: Search,
  "folder-open": FolderOpen,
  "file-text": FileText,
  upload: Upload,
  activity: Activity,
  "check-circle": CheckCircle,
};

const stepColors = [
  "bg-primary-700",
  "bg-secondary",
  "bg-success",
  "bg-warning-DEFAULT",
  "bg-india-saffron",
  "bg-purple-600",
];

const stepBgColors = [
  "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800",
  "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
];

export default function StepByStep() {
  const t = useTranslationFn("steps");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  const stepTx = useAutoTranslate(
    Object.fromEntries(contentData.steps.flatMap((s) => [
      [`${s.id}.title`, s.title],
      [`${s.id}.desc`, s.description],
      ...(s.linkText ? [[`${s.id}.linkText`, s.linkText]] : []),
    ] as [string, string][]))
  );

  return (
    <section id="steps" className="section-padding bg-white dark:bg-slate-950" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="section-badge mb-4">{t("badge")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </motion.div>

        {/* Desktop timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connector line */}
            <div
              className="absolute top-10 left-10 right-10 h-0.5 bg-gradient-to-r from-primary-300 via-success to-purple-400 dark:from-primary-700 dark:via-green-700 dark:to-purple-700"
              aria-hidden="true"
            />

            <div className="grid grid-cols-6 gap-4">
              {contentData.steps.map((step, i) => {
                const Icon = stepIcons[step.icon] || CheckCircle;
                const color = stepColors[i] || "bg-primary-700";
                const bgColor = stepBgColors[i] || stepBgColors[0];
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Step number circle */}
                    <div className={`relative w-20 h-20 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg z-10`}>
                      <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                      <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white dark:bg-slate-800 border-2 border-current rounded-full flex items-center justify-center text-xs font-black text-slate-700 dark:text-slate-300">
                        {step.id}
                      </div>
                    </div>
                    <div className={`rounded-2xl border p-4 ${bgColor} w-full`}>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                        {stepTx[`${step.id}.title`] ?? step.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {stepTx[`${step.id}.desc`] ?? step.description}
                      </p>
                      {step.link && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-primary-700 dark:text-primary-400 hover:underline"
                          aria-label={`${stepTx[`${step.id}.linkText`] ?? step.linkText} - opens in new tab`}
                        >
                          {stepTx[`${step.id}.linkText`] ?? step.linkText}
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden space-y-4">
          {contentData.steps.map((step, i) => {
            const Icon = stepIcons[step.icon] || CheckCircle;
            const color = stepColors[i] || "bg-primary-700";
            const bgColor = stepBgColors[i] || stepBgColors[0];
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  {i < contentData.steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 my-2 min-h-[24px]" aria-hidden="true" />
                  )}
                </div>
                <div className={`rounded-2xl border p-4 mb-2 flex-1 ${bgColor}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {t("stepLabel")} {step.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                    {stepTx[`${step.id}.title`] ?? step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stepTx[`${step.id}.desc`] ?? step.description}
                  </p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-primary-700 dark:text-primary-400 hover:underline"
                    >
                      {stepTx[`${step.id}.linkText`] ?? step.linkText}
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <a
            href={contentData.officialLinks.voterPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-primary text-base"
          >
            {stepTx["cta"] ?? "Start Verification on Official Portal"}
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            You will be redirected to the official Election Commission of India website.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
