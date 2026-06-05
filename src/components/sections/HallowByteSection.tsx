"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heart, Globe, Accessibility, Languages, Brain, Smartphone } from "lucide-react";

const PILLARS = [
  { icon: Languages,    label: "Multilingual",      desc: "13 Indian languages supported", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { icon: Accessibility, label: "Accessible",        desc: "WCAG AA — built for all abilities", color: "bg-green-50 text-green-700 border-green-200" },
  { icon: Brain,        label: "AI-Powered",         desc: "Official ECI knowledge base + Grok AI", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { icon: Smartphone,   label: "Mobile-First",       desc: "Optimised for low-end devices", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { icon: Globe,        label: "Open Access",        desc: "Free, ad-free, no login required", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { icon: Heart,        label: "Public Service",     desc: "Built for awareness, not profit", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export default function HallowByteSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-black text-sm">
              HB
            </div>
            <div>
              <p className="font-bold text-sm text-white">HallowByte Innovations Private Limited</p>
              <p className="text-blue-300 text-xs">Empowering Citizens Through Technology</p>
            </div>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              Public Awareness
            </span>
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            This platform is an independent public awareness initiative by{" "}
            <span className="text-white font-semibold">HallowByte Innovations Private Limited</span>.
          </p>
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 mb-12 text-center"
        >
          <p className="text-blue-100 text-lg leading-relaxed mb-6">
            Our goal is to simplify government information and help Indian citizens understand important public
            processes through technology, accessibility, multilingual support, and AI-powered guidance.
          </p>
          <p className="text-white font-semibold text-lg">
            We believe every citizen should have access to clear, understandable information —
            regardless of language, education level, or technical background.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
              >
                <div className={`inline-flex p-2.5 rounded-xl border mb-3 ${p.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-bold text-white text-sm mb-1">{p.label}</p>
                <p className="text-blue-300 text-xs">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Made with love */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center gap-3">
            <div className="text-3xl">
              Made with <span className="text-red-400">❤️</span> for the people of India
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-blue-300 text-sm">
              <span>Not affiliated with any political party</span>
              <span className="text-white/20">•</span>
              <span>Information sourced from official ECI resources</span>
              <span className="text-white/20">•</span>
              <span>Made for Public Awareness</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
