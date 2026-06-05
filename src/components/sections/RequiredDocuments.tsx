"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useInView } from "react-intersection-observer";
import {
  Fingerprint, CreditCard, BookOpen, Car, Hash, Baby, Zap, Landmark, Users, Shield, Phone, CheckCircle
} from "lucide-react";
import contentData from "@/config/content.json";

const iconMap: Record<string, React.ElementType> = {
  fingerprint: Fingerprint,
  "credit-card": CreditCard,
  "book-open": BookOpen,
  car: Car,
  hash: Hash,
  baby: Baby,
  zap: Zap,
  landmark: Landmark,
  users: Users,
  shield: Shield,
};

const proofColors: Record<string, string> = {
  identity: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400",
  address: "bg-success-light text-success dark:bg-green-900/40 dark:text-green-400",
  age: "bg-warning/10 text-warning-DEFAULT dark:bg-yellow-900/40 dark:text-yellow-400",
};

export default function RequiredDocuments() {
  const t = useTranslationFn("documents");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const docTx = useAutoTranslate(
    Object.fromEntries(contentData.documents.flatMap((d) => [
      [`${d.id}.name`, d.name],
      [`${d.id}.desc`, d.description],
    ]))
  );
  const ftx = useAutoTranslate({ all: "All Documents" });

  const filters = [
    { id: "all", label: ftx.all },
    { id: "identity", label: t("identity") },
    { id: "address", label: t("address") },
    { id: "age", label: t("age") },
  ];

  const filtered = activeFilter === "all"
    ? contentData.documents
    : contentData.documents.filter(d => d.proofType.includes(activeFilter));

  return (
    <section id="documents" className="section-padding bg-slate-50 dark:bg-slate-900" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="section-badge mb-4">{t("badge")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="tablist"
          aria-label="Filter documents by type"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              role="tab"
              aria-selected={activeFilter === f.id}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f.id
                  ? "bg-primary-700 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Document cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((doc, i) => {
            const Icon = iconMap[doc.icon] || Shield;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card-hover p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-700 dark:text-primary-400" aria-hidden="true" />
                  </div>
                  {doc.officiallyAccepted && (
                    <span className="official-badge" aria-label="Officially accepted document">
                      <CheckCircle className="w-3 h-3" aria-hidden="true" />
                      Official
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">
                  {docTx[`${doc.id}.name`] ?? doc.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">
                  {docTx[`${doc.id}.desc`] ?? doc.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {doc.proofType.map((type) => (
                    <span
                      key={type}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${proofColors[type] || ""}`}
                    >
                      {type === "identity" ? t("identity") : type === "address" ? t("address") : t("age")}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No documents help box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 bg-warning/10 border border-warning/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
        >
          <div className="text-4xl flex-shrink-0" role="img" aria-label="Question mark">❓</div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t("noDocTitle")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("noDocDesc")}</p>
          </div>
          <a
            href="tel:1950"
            className="flex-shrink-0 flex items-center gap-2 bg-success text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
            aria-label="Call voter helpline 1950"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            {t("callHelpline")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
