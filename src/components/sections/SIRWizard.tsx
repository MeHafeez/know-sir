"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, AlertCircle, ArrowRight, ArrowLeft,
  UserCheck, Search, Home, Map, Globe, Flag, Edit, UserPlus,
  FileText, Phone, ExternalLink, RotateCcw, Plane, Info
} from "lucide-react";
import rules from "@/config/sir-rules.json";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  UserCheck, Search, Home, Map, Globe, Flag, Edit, UserPlus,
  FileText, Phone, ArrowRight, Plane, Info, CheckCircle, AlertCircle,
};

type WizardQuestion = {
  id: string;
  textKey: string;
  icon: string;
  options: {
    id: string;
    labelKey: string;
    icon: string;
    color: string;
    next: string;
  }[];
};

type WizardResult = {
  id: string;
  type: string;
  titleKey: string;
  summaryKey: string;
  icon: string;
  color: string;
  actions: { label: string; url: string; primary: boolean }[];
  forms: string[];
  documentGroups: string[];
  helpline: string;
};

const QUESTION_TEXT: Record<string, string> = {
  "wizard.q1.text": "Are you already registered as a voter?",
  "wizard.q2.text": "Did you find your name in the voter list?",
  "wizard.q3.text": "Are you an Indian citizen living in India?",
  "wizard.q4.text": "Have you moved to a new address recently?",
  "wizard.q5.text": "What seems to be the problem with your entry?",
  "wizard.q6.text": "Where are you currently living?",
  "wizard.q1.yes": "Yes, I am registered",
  "wizard.q1.no": "No, never registered",
  "wizard.q2.found": "Yes, name found ✓",
  "wizard.q2.notFound": "No, not found",
  "wizard.q3.indian": "Indian citizen in India",
  "wizard.q3.nri": "NRI / Overseas Indian",
  "wizard.q4.same": "Same address as before",
  "wizard.q4.movedSame": "Moved — same constituency",
  "wizard.q4.movedDiff": "Moved — different constituency",
  "wizard.q5.detailsWrong": "My details are incorrect",
  "wizard.q5.notEnrolled": "I was never enrolled",
  "wizard.q6.resident": "Living in India",
  "wizard.q6.nri": "Living Abroad (NRI)",
};

const RESULT_TEXT: Record<string, string> = {
  "wizard.result.existingOk.title": "Your voter registration looks good!",
  "wizard.result.existingOk.summary": "Your name appears to be in the electoral roll at your current address. Please verify your details online and download your e-EPIC if needed.",
  "wizard.result.form8Transpose.title": "You need to update your address",
  "wizard.result.form8Transpose.summary": "Since you have moved within the same constituency, you can request transposition via Form 8. Submit it online or through your local BLO.",
  "wizard.result.form6New.title": "You need to register as a voter",
  "wizard.result.form6New.summary": "Fill Form 6 to register at your current address. You can submit it online via the Voter Services Portal or through your local Booth Level Officer (BLO).",
  "wizard.result.form8Correction.title": "You need to correct your details",
  "wizard.result.form8Correction.summary": "Use Form 8 to correct your name, date of birth, or other details in the electoral roll. Submit online or visit your local Electoral Registration Officer (ERO).",
  "wizard.result.nri.title": "Register as an Overseas Indian Voter",
  "wizard.result.nri.summary": "As an NRI, you can register using Form 6A on the Voter Services Portal. You will need a valid Indian passport.",
};

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; badge: string; btn: string }> = {
  green:  { bg: "bg-green-50",  border: "border-green-400", text: "text-green-700",  badge: "bg-green-100 text-green-800",  btn: "bg-green-600 hover:bg-green-700 text-white" },
  blue:   { bg: "bg-blue-50",   border: "border-blue-400",  text: "text-blue-700",   badge: "bg-blue-100 text-blue-800",    btn: "bg-blue-600 hover:bg-blue-700 text-white" },
  orange: { bg: "bg-orange-50", border: "border-orange-400",text: "text-orange-700", badge: "bg-orange-100 text-orange-800",btn: "bg-orange-600 hover:bg-orange-700 text-white" },
  red:    { bg: "bg-red-50",    border: "border-red-400",   text: "text-red-700",    badge: "bg-red-100 text-red-800",      btn: "bg-red-600 hover:bg-red-700 text-white" },
  purple: { bg: "bg-purple-50", border: "border-purple-400",text: "text-purple-700", badge: "bg-purple-100 text-purple-800",btn: "bg-purple-600 hover:bg-purple-700 text-white" },
  teal:   { bg: "bg-teal-50",   border: "border-teal-400",  text: "text-teal-700",   badge: "bg-teal-100 text-teal-800",    btn: "bg-teal-600 hover:bg-teal-700 text-white" },
};

function getIcon(name: string, cls = "w-5 h-5") {
  const Comp = ICON_MAP[name];
  return Comp ? <Comp className={cls} /> : null;
}

export default function SIRWizard() {
  const [history, setHistory] = useState<string[]>(["q1"]);
  const [result, setResult] = useState<WizardResult | null>(null);
  const [animDir, setAnimDir] = useState<1 | -1>(1);

  const qtx = useAutoTranslate(QUESTION_TEXT);
  const rtx = useAutoTranslate(RESULT_TEXT);
  const htx = useAutoTranslate({
    badge: "SIR Eligibility & Action Wizard",
    heading: "What do YOU need to do?",
    sub: "Answer 3–4 simple questions. Get your personalised action plan.",
    back: "Back",
    startOver: "Start Over",
    callHelpline: "Call Voter Helpline",
    docsNeeded: "Documents you need",
    formsToFill: "Forms to fill",
    getHelp: "Get Help",
    nextSteps: "Your Action Plan",
  });

  const currentId = history[history.length - 1];
  const question = (rules.wizardFlow.questions as WizardQuestion[]).find((q) => q.id === currentId);
  const progress = Math.min(history.length / 5, 1);

  function handleOption(next: string) {
    setAnimDir(1);
    if (next.startsWith("result_")) {
      const r = (rules.wizardFlow.results as WizardResult[]).find((x) => x.id === next);
      if (r) setResult(r);
    } else {
      setHistory((prev) => [...prev, next]);
    }
  }

  function handleBack() {
    setAnimDir(-1);
    if (result) { setResult(null); return; }
    if (history.length > 1) setHistory((prev) => prev.slice(0, -1));
  }

  function handleReset() {
    setHistory(["q1"]);
    setResult(null);
  }

  const getDocGroup = (id: string) =>
    rules.documentGroups.find((g) => g.id === id);
  const getForm = (id: string) =>
    rules.forms.find((f) => f.id === id);

  return (
    <section id="wizard" className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <CheckCircle className="w-4 h-4" />
            {htx.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {htx.heading}
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            {htx.sub}
          </p>
        </motion.div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Progress bar */}
          <div className="h-2 bg-gray-100">
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {/* QUESTION */}
              {!result && question && (
                <motion.div
                  key={currentId}
                  initial={{ opacity: 0, x: animDir * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -animDir * 60 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {getIcon(question.icon, "w-6 h-6 text-blue-700")}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {qtx[question.textKey] || question.textKey}
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {question.options.map((opt) => {
                      const colors = COLOR_CLASSES[opt.color] || COLOR_CLASSES.blue;
                      return (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOption(opt.next)}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${colors.border} ${colors.bg} text-left transition-all group hover:shadow-md`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.badge} flex-shrink-0`}>
                            {getIcon(opt.icon, `w-5 h-5 ${colors.text}`)}
                          </div>
                          <span className={`font-semibold text-lg ${colors.text}`}>
                            {qtx[opt.labelKey] || opt.labelKey}
                          </span>
                          <ArrowRight className={`w-5 h-5 ml-auto ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Back / Check voter list */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    {history.length > 1 ? (
                      <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> {htx.back}
                      </button>
                    ) : <div />}
                    <a
                      href="https://electoralsearch.eci.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Search className="w-4 h-4" />
                      Check voter list first
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* RESULT */}
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Result header */}
                  {(() => {
                    const colors = COLOR_CLASSES[result.color] || COLOR_CLASSES.blue;
                    const ResultIcon = ICON_MAP[result.icon] || CheckCircle;
                    return (
                      <>
                        <div className={`flex items-start gap-4 p-6 rounded-2xl ${colors.bg} border ${colors.border} mb-6`}>
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors.badge}`}>
                            <ResultIcon className={`w-7 h-7 ${colors.text}`} />
                          </div>
                          <div>
                            <h3 className={`text-xl font-extrabold ${colors.text} mb-1`}>
                              {rtx[result.titleKey] || result.titleKey}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {rtx[result.summaryKey] || result.summaryKey}
                            </p>
                          </div>
                        </div>

                        {/* Forms needed */}
                        {result.forms.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> {htx.formsToFill}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {result.forms.map((fid) => {
                                const f = getForm(fid);
                                if (!f) return null;
                                return (
                                  <a
                                    key={fid}
                                    href={f.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-200 rounded-xl text-blue-700 font-semibold hover:bg-blue-50 hover:border-blue-400 transition-all text-sm"
                                  >
                                    <FileText className="w-4 h-4" />
                                    {f.name}
                                    <span className="text-gray-400 font-normal">— {f.purpose}</span>
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        {result.documentGroups.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                              {htx.docsNeeded}
                            </h4>
                            <div className="grid gap-3">
                              {result.documentGroups.map((gid) => {
                                const g = getDocGroup(gid);
                                if (!g) return null;
                                return (
                                  <div key={gid} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <p className="font-semibold text-gray-800 text-sm mb-1.5">{g.label}</p>
                                    <p className="text-xs text-gray-500 mb-2">{g.note}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {g.documents.slice(0, 4).map((d) => (
                                        <span key={d.id} className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-medium">
                                          {d.name}
                                        </span>
                                      ))}
                                      {g.documents.length > 4 && (
                                        <span className="text-xs text-gray-400 px-2 py-1">+{g.documents.length - 4} more</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="grid sm:grid-cols-2 gap-3 mb-6">
                          {result.actions.map((action, i) => (
                            <a
                              key={i}
                              href={action.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                                action.primary
                                  ? colors.btn
                                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400"
                              }`}
                            >
                              {action.label}
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ))}
                        </div>

                        {/* Helpline */}
                        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-amber-700" />
                            <div>
                              <p className="font-bold text-amber-800 text-sm">{htx.callHelpline}</p>
                              <a href={`tel:${result.helpline}`} className="text-amber-700 font-extrabold text-xl">
                                {result.helpline}
                              </a>
                            </div>
                          </div>
                          <button
                            onClick={handleReset}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium"
                          >
                            <RotateCcw className="w-4 h-4" />
                            {htx.startOver}
                          </button>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                          {rules._meta.attribution} Always verify with your local BLO or ERO for the latest requirements.
                        </p>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
