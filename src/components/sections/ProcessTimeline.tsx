"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, MapPin, FileText, BookOpen, MessageSquare, CheckCircle, ExternalLink, X } from "lucide-react";
import { useInView } from "react-intersection-observer";
import rules from "@/config/sir-rules.json";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone, MapPin, FileText, BookOpen, MessageSquare, CheckCircle,
};

const COLORS = [
  { ring: "ring-blue-500",    bg: "bg-blue-500",    light: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-300"   },
  { ring: "ring-green-500",   bg: "bg-green-500",   light: "bg-green-50",  text: "text-green-700",  border: "border-green-300"  },
  { ring: "ring-purple-500",  bg: "bg-purple-500",  light: "bg-purple-50", text: "text-purple-700", border: "border-purple-300" },
  { ring: "ring-orange-500",  bg: "bg-orange-500",  light: "bg-orange-50", text: "text-orange-700", border: "border-orange-300" },
  { ring: "ring-red-500",     bg: "bg-red-500",     light: "bg-red-50",    text: "text-red-700",    border: "border-red-300"    },
  { ring: "ring-emerald-500", bg: "bg-emerald-500", light: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-300"},
];

type Phase = (typeof rules.processTimeline)[number];

export default function ProcessTimeline() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [active, setActive] = useState<Phase | null>(null);
  const phases = rules.processTimeline as Phase[];

  const htx = useAutoTranslate({
    badge: "SIR Process Timeline",
    heading: "How the SIR Process Works",
    sub: "Tap any phase to see what it means for you and what action to take.",
    clickDetails: "Click for details",
    close: "Close",
    yourAction: "Your Action",
    officialLink: "Official Link",
  });

  const phaseTx = useAutoTranslate(
    Object.fromEntries(phases.flatMap((p) => [
      [`${p.id}.phase`, p.phase],
      [`${p.id}.description`, p.description],
      [`${p.id}.citizenAction`, p.citizenAction],
    ]))
  );

  return (
    <section id="timeline" className="py-16 bg-white overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {htx.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {htx.heading}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {htx.sub}
          </p>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block relative mb-6">
          {/* Connector line */}
          <div className="absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 mx-16" />

          <div className="grid grid-cols-6 gap-2">
            {phases.map((phase, i) => {
              const color = COLORS[i % COLORS.length];
              const Icon = ICONS[phase.icon] || CheckCircle;
              return (
                <motion.button
                  key={phase.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setActive(active?.id === phase.id ? null : phase)}
                  className={`relative flex flex-col items-center gap-3 cursor-pointer group`}
                >
                  {/* Node */}
                  <div className={`relative w-20 h-20 rounded-2xl ${active?.id === phase.id ? color.bg : "bg-white"} border-2 ${active?.id === phase.id ? "border-transparent" : color.border} shadow-lg flex items-center justify-center transition-all group-hover:shadow-xl ring-2 ring-offset-2 ${active?.id === phase.id ? color.ring : "ring-transparent"}`}>
                    <Icon className={`w-8 h-8 ${active?.id === phase.id ? "text-white" : color.text}`} />
                    <span className={`absolute -top-2 -right-2 w-6 h-6 ${color.bg} rounded-full text-white text-xs font-bold flex items-center justify-center`}>
                      {i + 1}
                    </span>
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <p className={`font-bold text-sm ${active?.id === phase.id ? color.text : "text-gray-700"}`}>
                      {phaseTx[`${phase.id}.phase`] ?? phase.phase}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-3 mb-6">
          {phases.map((phase, i) => {
            const color = COLORS[i % COLORS.length];
            const Icon = ICONS[phase.icon] || CheckCircle;
            return (
              <motion.button
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActive(active?.id === phase.id ? null : phase)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  active?.id === phase.id
                    ? `${color.light} ${color.border}`
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${active?.id === phase.id ? color.bg : color.light}`}>
                  <Icon className={`w-6 h-6 ${active?.id === phase.id ? "text-white" : color.text}`} />
                </div>
                <div>
                  <span className={`text-xs font-bold ${color.text}`}>Phase {i + 1}</span>
                  <p className="font-bold text-gray-900 text-sm">{phaseTx[`${phase.id}.phase`] ?? phase.phase}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{phaseTx[`${phase.id}.description`] ?? phase.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              {(() => {
                const idx = phases.findIndex((p) => p.id === active.id);
                const color = COLORS[idx % COLORS.length];
                const Icon = ICONS[active.icon] || CheckCircle;
                return (
                  <div className={`${color.light} border-2 ${color.border} rounded-3xl p-6 md:p-8`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 ${color.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold ${color.text} uppercase tracking-wider`}>Phase {idx + 1}</span>
                          </div>
                          <h3 className="text-xl font-extrabold text-gray-900 mb-2">{phaseTx[`${active.id}.phase`] ?? active.phase}</h3>
                          <p className="text-gray-700 mb-4">{phaseTx[`${active.id}.description`] ?? active.description}</p>
                          <div className={`p-4 ${color.bg} bg-opacity-10 rounded-xl border ${color.border} mb-4`}>
                            <p className={`text-sm font-bold ${color.text} mb-1`}>Your Action:</p>
                            <p className="text-gray-800 font-medium">{phaseTx[`${active.id}.citizenAction`] ?? active.citizenAction}</p>
                          </div>
                          <a
                            href={active.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 text-sm ${color.text} font-semibold hover:underline`}
                          >
                            Official Source <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                      <button onClick={() => setActive(null)} className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center hover:bg-white flex-shrink-0">
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
