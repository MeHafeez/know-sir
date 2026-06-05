"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowDown, RotateCcw, ExternalLink, User, Search, Home, Map, Flag, Globe } from "lucide-react";
import { useInView } from "react-intersection-observer";
import rules from "@/config/sir-rules.json";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

type TreeNode = {
  id: string;
  question?: string;
  icon?: string;
  checkUrl?: string;
  yes?: TreeNode;
  no?: TreeNode;
  outcome?: boolean;
  type?: string;
  result?: string;
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  User, Search, Home, Map, Flag, Globe, CheckCircle,
};

const RESULT_LABELS: Record<string, { title: string; color: string; bg: string; border: string; action: string; url: string }> = {
  result_existing_ok:      { title: "All Good — Verify Details Online",      color: "text-green-700",  bg: "bg-green-50",   border: "border-green-400", action: "Check Electoral Roll",    url: "https://electoralsearch.eci.gov.in" },
  result_form8_transpose:  { title: "Submit Form 8 — Address Transposition", color: "text-orange-700", bg: "bg-orange-50",  border: "border-orange-400",action: "Fill Form 8 Online",       url: "https://voters.eci.gov.in/" },
  result_form6_new:        { title: "Register — Fill Form 6",                color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-400",  action: "Register Now",             url: "https://voters.eci.gov.in/" },
  result_form8_correction: { title: "Correct Details — Fill Form 8",         color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-400",action: "Fill Form 8 Online",       url: "https://voters.eci.gov.in/" },
  result_nri:              { title: "Register as Overseas Voter — Form 6A",  color: "text-teal-700",   bg: "bg-teal-50",    border: "border-teal-400",  action: "Register as NRI Voter",    url: "https://voters.eci.gov.in/" },
};

type Step = { node: TreeNode; answer?: "yes" | "no" };

function collectQuestions(node: TreeNode, acc: Record<string, string> = {}): Record<string, string> {
  if (node.id && node.question) acc[node.id] = node.question;
  if (node.yes) collectQuestions(node.yes, acc);
  if (node.no) collectQuestions(node.no, acc);
  return acc;
}

export default function DecisionTree() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const tree = rules.decisionTree.root as TreeNode;
  const [path, setPath] = useState<Step[]>([{ node: tree }]);

  const htx = useAutoTranslate({
    badge: "Visual Decision Tree",
    heading: "Follow the Path — Find Your Answer",
    sub: "Click Yes or No to navigate. Each step brings you closer to your personalised guidance.",
    yes: "Yes",
    no: "No",
    back: "Back",
    startOver: "Start Over",
    takeAction: "Take Action",
  });

  const resultFlat = Object.fromEntries(
    Object.entries(RESULT_LABELS).flatMap(([k, v]) => [
      [`${k}.title`, v.title],
      [`${k}.action`, v.action],
    ])
  );
  const resultTx = useAutoTranslate(resultFlat);
  const questionTx = useAutoTranslate(collectQuestions(tree));

  const currentStep = path[path.length - 1];
  const currentNode = currentStep.node;
  const isOutcome = currentNode.outcome === true;
  const resultData = isOutcome && currentNode.result ? RESULT_LABELS[currentNode.result] : null;

  function answer(choice: "yes" | "no") {
    const next = choice === "yes" ? currentNode.yes : currentNode.no;
    if (next) setPath((prev) => [...prev, { node: next, answer: choice }]);
  }

  function reset() {
    setPath([{ node: tree }]);
  }

  function goBack() {
    if (path.length > 1) setPath((prev) => prev.slice(0, -1));
  }

  const IconComp = currentNode.icon ? (ICONS[currentNode.icon] || User) : User;

  return (
    <section id="decision-tree" className="py-16 bg-gradient-to-b from-slate-50 to-white" ref={ref}>
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {htx.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {htx.heading}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {htx.sub}
          </p>
        </motion.div>

        {/* Path breadcrumb */}
        {path.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center gap-2 mb-6 justify-center"
          >
            {path.slice(0, -1).map((step, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm">
                <span className="text-gray-400 text-xs truncate max-w-[120px]">
                  {step.node.question?.split(" ").slice(0, 4).join(" ")}...
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  step.answer === "yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {step.answer === "yes" ? "Yes" : "No"}
                </span>
                {i < path.length - 2 && <span className="text-gray-300">→</span>}
              </span>
            ))}
          </motion.div>
        )}

        {/* Main card */}
        <div className="relative">
          {/* Top connector */}
          {path.length > 1 && (
            <div className="flex justify-center mb-2">
              <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full" />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentNode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              {!isOutcome ? (
                /* Question node */
                <div className="p-8 md:p-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <IconComp className="w-8 h-8 text-blue-700" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-3">
                    {questionTx[currentNode.id] ?? currentNode.question}
                  </h3>

                  {currentNode.checkUrl && (
                    <div className="flex justify-center mb-6">
                      <a
                        href={currentNode.checkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-full"
                      >
                        <Search className="w-4 h-4" />
                        Check voter list to answer this
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Yes / No buttons */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => answer("yes")}
                      className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-500 transition-all group"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="font-extrabold text-green-700 text-xl">{htx.yes.toUpperCase()}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => answer("no")}
                      className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-red-300 bg-red-50 hover:bg-red-100 hover:border-red-500 transition-all group"
                    >
                      <XCircle className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
                      <span className="font-extrabold text-red-600 text-xl">{htx.no.toUpperCase()}</span>
                    </motion.button>
                  </div>

                  {/* Depth indicator */}
                  <div className="flex justify-center gap-2">
                    {[...Array(Math.max(4, path.length + 1))].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i < path.length ? "w-8 bg-blue-500" : "w-3 bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Outcome node */
                <div className="p-8 md:p-10">
                  {resultData && (
                    <>
                      <div className={`flex items-center gap-4 p-6 rounded-2xl ${resultData.bg} border-2 ${resultData.border} mb-6`}>
                        <CheckCircle className={`w-12 h-12 flex-shrink-0 ${resultData.color}`} />
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Your Result</p>
                          <h3 className={`text-2xl font-extrabold ${resultData.color}`}>{currentNode.result ? (resultTx[`${currentNode.result}.title`] ?? resultData?.title) : resultData?.title}</h3>
                        </div>
                      </div>

                      {/* Path summary */}
                      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your path:</p>
                        <div className="space-y-2">
                          {path.slice(0, -1).map((step, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                                step.answer === "yes" ? "bg-green-500" : "bg-red-500"
                              }`}>
                                {step.answer === "yes" ? "✓" : "✗"}
                              </span>
                              <span className="text-gray-600 text-xs">{step.node.question}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <a
                          href={resultData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${resultData.bg.replace("50", "600")} ${resultData.color.replace("700", "50")} border-2 ${resultData.border} hover:opacity-90`}
                          style={{ background: undefined }}
                        >
                          <span className={`${resultData.bg} ${resultData.color} px-5 py-3 rounded-xl border-2 ${resultData.border} font-bold text-sm flex items-center gap-2 hover:opacity-80 transition-opacity`}>
                            {currentNode.result ? (resultTx[`${currentNode.result}.action`] ?? resultData?.action) : resultData?.action} <ExternalLink className="w-4 h-4" />
                          </span>
                        </a>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom arrows for non-outcome */}
          {!isOutcome && currentNode.yes && currentNode.no && (
            <div className="hidden md:grid grid-cols-2 gap-8 mt-3 px-8">
              {["Yes", "No"].map((label) => (
                <div key={label} className="flex flex-col items-center gap-1 opacity-40">
                  <ArrowDown className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {path.length > 1 && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:border-gray-400 transition-all"
            >
              ← Go Back
            </button>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:border-gray-400 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Start Over
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {rules._meta.attribution}
        </p>
      </div>
    </section>
  );
}
