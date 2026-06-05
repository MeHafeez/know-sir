"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Shield, AlertTriangle } from "lucide-react";

export default function OfficialResources() {
  const t = useTranslationFn("resources");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const links = t.raw("links") as { title: string; desc: string; url: string; badge: string }[];

  return (
    <section id="resources" className="section-padding bg-white dark:bg-slate-950" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-6"
        >
          <span className="section-badge mb-4">{t("badge")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </motion.div>

        {/* Security warning */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <div className="flex items-center gap-3 bg-warning/10 border border-warning/40 rounded-xl px-5 py-3.5">
            <AlertTriangle className="w-5 h-5 text-warning-DEFAULT flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{t("warning")}</p>
          </div>
        </motion.div>

        {/* Links grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((link, i) => (
            <motion.a
              key={i}
              href={link.url}
              target={link.url.startsWith("tel:") ? "_self" : "_blank"}
              rel={link.url.startsWith("tel:") ? undefined : "noopener noreferrer"}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-hover p-6 group flex flex-col"
              aria-label={`${link.title} — ${link.desc}${!link.url.startsWith("tel:") ? " — opens in new tab" : ""}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-700 dark:text-primary-400" aria-hidden="true" />
                </div>
                <span className="official-badge">{link.badge}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">{link.desc}</p>
              <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-primary-700 dark:text-primary-400">
                <span>{link.url.startsWith("tel:") ? link.url.replace("tel:", "") : link.url.replace("https://", "")}</span>
                {!link.url.startsWith("tel:") && <ExternalLink className="w-3 h-3" aria-hidden="true" />}
              </div>
            </motion.a>
          ))}
        </div>

        {/* Official seal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Shield className="w-4 h-4 text-success" aria-hidden="true" />
            <span>All links lead to official <strong className="text-slate-700 dark:text-slate-300">.gov.in</strong> government websites</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
