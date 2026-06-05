"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ExternalLink, FileText, CheckCircle, Search, MapPin, Send } from "lucide-react";
import { useInView } from "react-intersection-observer";
import rules from "@/config/sir-rules.json";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Search, ArrowRight, FileText, CheckCircle, Home: MapPin, Send, MapPin,
  GraduationCap: FileText, Globe: ArrowRight, Info: CheckCircle,
};

const COLOR_MAP: Record<string, { card: string; badge: string; btn: string; dot: string; header: string }> = {
  amber:  { card: "border-amber-200 bg-amber-50",  badge: "bg-amber-100 text-amber-800",  btn: "bg-amber-600 hover:bg-amber-700 text-white", dot: "bg-amber-400", header: "bg-amber-100" },
  blue:   { card: "border-blue-200 bg-blue-50",    badge: "bg-blue-100 text-blue-800",    btn: "bg-blue-600 hover:bg-blue-700 text-white",   dot: "bg-blue-400",   header: "bg-blue-100" },
  indigo: { card: "border-indigo-200 bg-indigo-50",badge: "bg-indigo-100 text-indigo-800",btn: "bg-indigo-600 hover:bg-indigo-700 text-white",dot: "bg-indigo-400",header: "bg-indigo-100"},
  pink:   { card: "border-pink-200 bg-pink-50",    badge: "bg-pink-100 text-pink-800",    btn: "bg-pink-600 hover:bg-pink-700 text-white",   dot: "bg-pink-400",   header: "bg-pink-100" },
  orange: { card: "border-orange-200 bg-orange-50",badge: "bg-orange-100 text-orange-800",btn: "bg-orange-600 hover:bg-orange-700 text-white",dot: "bg-orange-400",header: "bg-orange-100"},
  teal:   { card: "border-teal-200 bg-teal-50",    badge: "bg-teal-100 text-teal-800",    btn: "bg-teal-600 hover:bg-teal-700 text-white",   dot: "bg-teal-400",   header: "bg-teal-100" },
  violet: { card: "border-violet-200 bg-violet-50",badge: "bg-violet-100 text-violet-800",btn: "bg-violet-600 hover:bg-violet-700 text-white",dot: "bg-violet-400",header: "bg-violet-100"},
  cyan:   { card: "border-cyan-200 bg-cyan-50",    badge: "bg-cyan-100 text-cyan-800",    btn: "bg-cyan-600 hover:bg-cyan-700 text-white",   dot: "bg-cyan-400",   header: "bg-cyan-100" },
};

const SCENARIO_LABELS: Record<string, { title: string; subtitle: string }> = {
  "scenario.senior.title": { title: "Senior Citizen", subtitle: "Elderly person needing verification" },
  "scenario.newVoter.title": { title: "New Voter", subtitle: "First time registering to vote" },
  "scenario.student.title": { title: "College Student", subtitle: "Studying away from hometown" },
  "scenario.marriedWoman.title": { title: "Married Woman", subtitle: "Name or address change after marriage" },
  "scenario.migrant.title": { title: "Migrant Worker", subtitle: "Working away from home state" },
  "scenario.nri.title": { title: "NRI / Overseas Indian", subtitle: "Indian citizen living abroad" },
  "scenario.pwd.title": { title: "Person with Disability", subtitle: "Needs accessibility support" },
  "scenario.addressChanged.title": { title: "Address Changed", subtitle: "Moved to new residence" },
};

type Scenario = (typeof rules.scenarios)[number];

export default function ScenarioCards() {
  const [active, setActive] = useState<Scenario | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const scenarios = rules.scenarios as Scenario[];

  const scenarioFlat = Object.fromEntries(
    Object.entries(SCENARIO_LABELS).flatMap(([k, v]) => [
      [`${k}.title`, v.title],
      [`${k}.subtitle`, v.subtitle],
    ])
  );
  const stx = useAutoTranslate(scenarioFlat);
  const htx = useAutoTranslate({
    badge: "Real-Life Scenarios",
    heading: "Find Your Situation",
    sub: "Click on the scenario that matches you. Get a personalised step-by-step action plan.",
    tapForSteps: "TAP FOR STEPS",
    yourActionPlan: "Your Action Plan",
    docsNeeded: "Documents Needed",
    formsToFill: "Forms to Fill",
    getHelp: "Get Help",
    close: "Close",
    viewOnline: "Submit Online",
  });

  function getDocGroup(id: string) {
    return rules.documentGroups.find((g) => g.id === id);
  }
  function getForm(id: string) {
    return rules.forms.find((f) => f.id === id);
  }

  return (
    <section id="scenarios" className="py-16 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {htx.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {htx.heading}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            {htx.sub}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {scenarios.map((s, i) => {
            const colors = COLOR_MAP[s.color] || COLOR_MAP.blue;
            const rawLabel = SCENARIO_LABELS[s.titleKey] || { title: s.id, subtitle: "" };
            const txTitle = stx[`${s.titleKey}.title`] ?? rawLabel.title;
            const txSubtitle = stx[`${s.titleKey}.subtitle`] ?? rawLabel.subtitle;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActive(s)}
                className={`relative flex flex-col items-center text-center p-5 rounded-2xl border-2 ${colors.card} transition-all cursor-pointer group hover:shadow-xl`}
              >
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${colors.badge}`}>
                  {htx.tapForSteps}
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{txTitle}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{txSubtitle}</p>
                <ArrowRight className="w-4 h-4 mt-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
              </motion.button>
            );
          })}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 80, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                {(() => {
                  const colors = COLOR_MAP[active.color] || COLOR_MAP.blue;
                  const label = SCENARIO_LABELS[active.titleKey] || { title: active.id, subtitle: "" };
                  return (
                    <>
                      <div className={`flex items-center justify-between p-6 ${colors.header} rounded-t-3xl`}>
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">{active.icon}</span>
                          <div>
                            <h3 className="text-2xl font-extrabold text-gray-900">{label.title}</h3>
                            <p className="text-gray-600 text-sm">{active.situation}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActive(null)}
                          className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="p-6">
                        {/* Steps */}
                        <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-4">Your Action Steps</h4>
                        <div className="space-y-3 mb-6">
                          {active.steps.map((step) => {
                            const StepIcon = STEP_ICONS[step.icon] || CheckCircle;
                            return (
                              <div key={step.step} className="flex items-start gap-3">
                                <div className={`w-7 h-7 rounded-full ${colors.dot} flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5`}>
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-800 text-sm font-medium">{step.action}</p>
                                  {step.link && (
                                    <a href={step.link} target="_blank" rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-0.5">
                                      Official Source <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Forms */}
                        {active.applicableForms.length > 0 && (
                          <div className="mb-5">
                            <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Forms
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {active.applicableForms.map((fid) => {
                                const f = getForm(fid);
                                if (!f) return null;
                                return (
                                  <a key={fid} href={f.downloadUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors">
                                    {f.name} <ExternalLink className="w-3 h-3" />
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-3">Documents You May Need</h4>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {active.documentGroups.map((gid) => {
                              const g = getDocGroup(gid);
                              if (!g) return null;
                              return (
                                <div key={gid} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                  <p className="font-semibold text-gray-800 text-xs mb-1">{g.label}</p>
                                  <p className="text-xs text-gray-500">{g.note}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-3">
                          <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer"
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${colors.btn}`}>
                            Go to Voter Portal <ExternalLink className="w-4 h-4" />
                          </a>
                          <a href="tel:1950"
                            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-800 font-bold text-sm hover:bg-amber-100 transition-colors">
                            📞 1950
                          </a>
                        </div>

                        <p className="text-xs text-gray-400 text-center mt-4">
                          {rules._meta.attribution}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
