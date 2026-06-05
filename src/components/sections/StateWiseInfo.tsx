"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useInView } from "react-intersection-observer";
import { MapPin, Phone, Globe, Languages, ExternalLink, Search } from "lucide-react";
import contentData from "@/config/content.json";
import { cn } from "@/lib/utils";

export default function StateWiseInfo() {
  const t = useTranslationFn("stateWise");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [selected, setSelected] = useState<string>("");
  const [search, setSearch] = useState("");

  const utx = useAutoTranslate({
    searchPlaceholder: "Search state...",
    stateUT: "State / Union Territory",
    selectPrompt: "Select a state from the list to view contact details.",
    visitWebsite: "Visit Official Website",
  });

  const filtered = contentData.states.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectedState = contentData.states.find(s => s.code === selected);

  return (
    <section id="state-wise" className="section-padding bg-white dark:bg-slate-950" ref={ref}>
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* State list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-base p-5"
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                placeholder={utx.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Search for a state or union territory"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1" role="listbox" aria-label="Select your state">
              {filtered.map((state) => (
                <button
                  key={state.code}
                  onClick={() => setSelected(state.code)}
                  role="option"
                  aria-selected={selected === state.code}
                  className={cn(
                    "text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    selected === state.code
                      ? "bg-primary-700 text-white"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span className="text-xs text-current/60 block">{state.code}</span>
                  {state.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* State details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {selectedState ? (
              <div className="card-base p-6 space-y-5 h-full">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center text-white font-black text-sm">
                    {selectedState.code}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white">{selectedState.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{utx.stateUT}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-success" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{t("stateHelpline")}</p>
                      <a
                        href={`tel:${selectedState.helpline}`}
                        className="font-bold text-success hover:underline"
                        aria-label={`Call ${selectedState.name} helpline ${selectedState.helpline}`}
                      >
                        {selectedState.helpline}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Languages className="w-4 h-4 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{t("localLanguage")}</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedState.language}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-primary-700 dark:text-primary-400" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{t("ceoWebsite")}</p>
                      <a
                        href={selectedState.ceoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary-700 dark:text-primary-400 hover:underline text-sm flex items-center gap-1"
                        aria-label={`Visit ${selectedState.name} CEO website — opens in new tab`}
                      >
                        {selectedState.ceoUrl.replace("https://", "")}
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  href={selectedState.ceoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                  aria-label={`Visit official ${selectedState.name} CEO website — opens in new tab`}
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  {t("visitWebsite")}
                </a>
              </div>
            ) : (
              <div className="card-base p-8 flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-slate-400" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">{t("selectState")}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose your state from the list to see local election contacts and helpline
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
