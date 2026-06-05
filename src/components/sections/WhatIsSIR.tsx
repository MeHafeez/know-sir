"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useInView } from "react-intersection-observer";
import { Home, Trash2, UserPlus, RefreshCw, Info } from "lucide-react";

const icons = [Home, Trash2, UserPlus, RefreshCw];
const colors = [
  "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
  "bg-danger/10 text-danger dark:bg-danger/20",
  "bg-success-light text-success dark:bg-success/20",
  "bg-warning/10 text-warning-DEFAULT dark:bg-warning/20",
];

const HOW_STEPS = [
  { step: "1", title: "ECI Issues Notification",  desc: "Official announcement for states/UTs under SIR",    color: "bg-primary-700" },
  { step: "2", title: "BLO Door-to-Door Visits",   desc: "Booth Level Officers visit every household",         color: "bg-secondary" },
  { step: "3", title: "Form Submission",            desc: "Online or offline enumeration form submitted",        color: "bg-success" },
  { step: "4", title: "Document Verification",      desc: "Identity, address & age proof checked",              color: "bg-warning-DEFAULT" },
  { step: "5", title: "Draft Rolls Published",      desc: "Public can view and file objections",               color: "bg-india-saffron" },
  { step: "6", title: "Final Roll Released",        desc: "Verified electoral roll published",                 color: "bg-india-green" },
];

export default function WhatIsSIR() {
  const t = useTranslationFn("whatIsSir");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = t.raw("features") as { title: string; desc: string }[];

  const stx = useAutoTranslate({
    howItWorks: "How SIR Works",
    ...Object.fromEntries(HOW_STEPS.flatMap((s) => [
      [`s${s.step}t`, s.title],
      [`s${s.step}d`, s.desc],
    ])),
  });

  return (
    <section id="what-is-sir" className="section-padding bg-slate-50 dark:bg-slate-900" ref={ref}>
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

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Description + Features */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card-base p-6"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-primary-700 dark:text-primary-400" aria-hidden="true" />
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {t("description")}
                </p>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, i) => {
                const Icon = icons[i] || Home;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="card-hover p-5"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[i]}`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Visual illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Process flow */}
            <div className="card-base p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-lg">
                {stx.howItWorks}
              </h3>
              <div className="space-y-0">
                {HOW_STEPS.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {item.step}
                      </div>
                      {i < 5 && <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 my-1 min-h-[20px]" />}
                    </div>
                    <div className="pb-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">{(stx as Record<string, string>)[`s${item.step}t`] ?? item.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{(stx as Record<string, string>)[`s${item.step}d`] ?? item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key fact */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-5">
              <p className="text-sm font-semibold text-primary-800 dark:text-primary-300 leading-relaxed">
                💡 {t("keyFact")}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">{t("keyFactSource")}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
