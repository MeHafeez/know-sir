"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { ArrowRight, Search, FileText, Phone, CheckCircle, Users, MapPin } from "lucide-react";
import contentData from "@/config/content.json";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function HeroSection() {
  const t = useTranslationFn("hero");

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-hero-pattern"
      aria-label="Hero section — Special Intensive Revision"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-full opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
      </div>

      <div className="section-container relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="text-white">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-india-saffron rounded-full animate-pulse" />
                {t("badge")}
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
            >
              {t("title")}
              <br />
              <span className="text-india-saffron">{t("titleHighlight")}</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-xl text-white/90 font-medium mb-3"
            >
              {t("subtitle")}
            </motion.p>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-base text-white/75 leading-relaxed mb-8 max-w-lg"
            >
              {t("description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3 mb-10"
            >
              <a
                href={contentData.officialLinks.voterSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-slate-50 font-bold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                aria-label="Check your voter status on official ECI website"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                {t("cta1")}
              </a>
              <a
                href="#steps"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-3.5 rounded-xl transition-all backdrop-blur-sm"
              >
                {t("cta2")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#documents"
                className="inline-flex items-center gap-2 bg-india-saffron/20 hover:bg-india-saffron/30 border border-india-saffron/40 text-white font-bold px-6 py-3.5 rounded-xl transition-all"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                {t("cta3")}
              </a>
            </motion.div>

            {/* Helpline prominent */}
            <motion.a
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              href="tel:1950"
              className="inline-flex items-center gap-3 bg-success/20 hover:bg-success/30 border border-success/40 text-white px-5 py-3 rounded-xl transition-all"
              aria-label="Call Voter Helpline 1950"
            >
              <div className="w-9 h-9 bg-success/30 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <div className="text-success font-black text-lg leading-none">1950</div>
                <div className="text-white/70 text-xs">{t("stats.helplineLabel")}</div>
              </div>
            </motion.a>
          </div>

          {/* Right: Stats & Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="hidden lg:block"
          >
            {/* Illustration card */}
            <div className="relative">
              {/* Floating verification card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 space-y-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 float-animation">
                    <span className="text-5xl" role="img" aria-label="Family voting illustration">🗳️</span>
                  </div>
                  <p className="text-white/80 text-sm font-medium">
                    Verify your voter details to participate in democracy
                  </p>
                </div>

                {/* Status items */}
                {[
                  "Identity verified successfully",
                  "Address confirmed",
                  "Registered in electoral roll",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" aria-hidden="true" />
                    <span className="text-white/90 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 text-center min-w-[120px]">
                <div className="text-2xl font-black text-primary-700">{t("stats.voters")}</div>
                <div className="text-xs text-slate-500 font-medium">{t("stats.votersLabel")}</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-700" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800">{t("stats.states")}</div>
                  <div className="text-[10px] text-slate-500">{t("stats.statesLabel")}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0"
        >
          {[
            { icon: Users, value: t("stats.voters"), label: t("stats.votersLabel") },
            { icon: MapPin, value: t("stats.states"), label: t("stats.statesLabel") },
            { icon: Phone, value: t("stats.helpline"), label: t("stats.helplineLabel") },
          ].map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="text-center bg-white/10 backdrop-blur-sm rounded-xl py-4 px-3 border border-white/15">
              <Icon className="w-5 h-5 text-india-saffron mx-auto mb-1" aria-hidden="true" />
              <div className="text-xl font-black text-white">{value}</div>
              <div className="text-[11px] text-white/60">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
