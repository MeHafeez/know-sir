"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useInView } from "react-intersection-observer";
import { ChevronDown, HelpCircle } from "lucide-react";
import contentData from "@/config/content.json";
import { cn } from "@/lib/utils";

export default function FAQSection() {
  const t = useTranslationFn("faq");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [openId, setOpenId] = useState<string | null>("what-is-sir");

  // Translate FAQ questions and answers
  const faqQSource = Object.fromEntries(contentData.faqs.map(f => [`q_${f.id}`, f.question]));
  const faqASource = Object.fromEntries(contentData.faqs.map(f => [`a_${f.id}`, f.answer]));
  const faqQTx = useAutoTranslate(faqQSource);
  const faqATx = useAutoTranslate(faqASource);

  return (
    <section id="faq" className="section-padding bg-slate-50 dark:bg-slate-900" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="section-badge mb-4">{t("badge")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3" role="list">
          {contentData.faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              role="listitem"
            >
              <div className="card-base overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      openId === faq.id
                        ? "bg-primary-700 text-white"
                        : "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                    )}>
                      <HelpCircle className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className={cn(
                      "font-semibold text-base transition-colors",
                      openId === faq.id
                        ? "text-primary-700 dark:text-primary-400"
                        : "text-slate-900 dark:text-white"
                    )}>
                      {faqQTx[`q_${faq.id}`] ?? faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300",
                      openId === faq.id && "rotate-180 text-primary-700 dark:text-primary-400"
                    )}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openId === faq.id && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <div className="ml-11 pl-3 border-l-2 border-primary-200 dark:border-primary-700">
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            {faqATx[`a_${faq.id}`] ?? faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 text-center"
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Still have questions? Our helpline is ready to help.
          </p>
          <a
            href="tel:1950"
            className="inline-flex items-center gap-2 btn-primary"
            aria-label="Call voter helpline 1950"
          >
            📞 Call Helpline: 1950
          </a>
        </motion.div>
      </div>
    </section>
  );
}
